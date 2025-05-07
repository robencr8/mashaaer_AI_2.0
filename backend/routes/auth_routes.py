from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from backend.models.user import User
from backend.app import db
import re
import json
# In a production environment, you would use actual email and SMS services
# For this implementation, we'll simulate sending OTPs
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import requests

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route("/api/register", methods=["POST"])
def register():
    """Register a new user"""
    data = request.json

    # Validate required fields
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password are required"}), 400

    email = data.get('email')
    password = data.get('password')
    phone = data.get('phone')

    # Validate email format
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_regex, email):
        return jsonify({"error": "Invalid email format"}), 400

    # Validate phone format if provided
    if phone:
        phone_regex = r'^\+?[0-9]{10,15}$'
        if not re.match(phone_regex, phone):
            return jsonify({"error": "Invalid phone format"}), 400

    # Check if user already exists
    existing_user = User.get_by_email(email)
    if existing_user:
        return jsonify({"error": "Email already registered"}), 400

    if phone:
        existing_phone = User.get_by_phone(phone)
        if existing_phone:
            return jsonify({"error": "Phone number already registered"}), 400

    # Create new user
    try:
        user = User(email=email, password=password, phone=phone)
        db.session.add(user)
        db.session.commit()

        # Set session
        session["user_id"] = user.id

        return jsonify({
            "message": "User registered successfully",
            "user": user.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Registration failed: {str(e)}"}), 500

@auth_bp.route("/api/login", methods=["POST"])
def login():
    """Login a user"""
    data = request.json

    # Validate required fields
    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Login with email
    if data.get('email'):
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        user = User.get_by_email(email)
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401

        if not user.check_password(password):
            return jsonify({"error": "Invalid email or password"}), 401

    # Login with phone
    elif data.get('phone'):
        phone = data.get('phone')
        password = data.get('password')

        if not phone or not password:
            return jsonify({"error": "Phone and password are required"}), 400

        user = User.get_by_phone(phone)
        if not user:
            return jsonify({"error": "Invalid phone or password"}), 401

        if not user.check_password(password):
            return jsonify({"error": "Invalid phone or password"}), 401

    else:
        return jsonify({"error": "Email or phone is required"}), 400

    # Set session
    session["user_id"] = user.id

    return jsonify({
        "message": "Login successful",
        "user": user.to_dict()
    }), 200

@auth_bp.route("/api/logout", methods=["POST"])
def logout():
    """Logout a user"""
    session.pop("user_id", None)
    return jsonify({"message": "Logout successful"}), 200

@auth_bp.route("/api/user", methods=["GET"])
def get_user():
    """Get current user"""
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    user = User.query.get(user_id)
    if not user:
        session.pop("user_id", None)
        return jsonify({"error": "User not found"}), 404

    return jsonify({"user": user.to_dict()}), 200

@auth_bp.route("/api/forgot-password", methods=["POST"])
def forgot_password():
    """Request a password reset"""
    data = request.json

    if not data or not data.get('email'):
        return jsonify({"error": "Email is required"}), 400

    email = data.get('email')

    # Validate email format
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_regex, email):
        return jsonify({"error": "Invalid email format"}), 400

    # Find user by email
    user = User.get_by_email(email)
    if not user:
        # Don't reveal that the email doesn't exist for security reasons
        return jsonify({"message": "If your email is registered, you will receive a password reset link"}), 200

    # Generate reset token
    token = user.generate_reset_token()
    db.session.commit()

    # Send reset email
    try:
        send_reset_email(user.email, token)
        return jsonify({"message": "Password reset email sent"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to send reset email: {str(e)}"}), 500

@auth_bp.route("/api/reset-password/<token>", methods=["GET"])
def validate_reset_token(token):
    """Validate a password reset token"""
    if not token:
        return jsonify({"error": "Token is required"}), 400

    # Find user by token
    user = User.query.filter_by(reset_token=token).first()
    if not user or not user.verify_reset_token(token):
        return jsonify({"error": "Invalid or expired token"}), 400

    return jsonify({"message": "Token is valid", "email": user.email}), 200

@auth_bp.route("/api/reset-password", methods=["POST"])
def reset_password():
    """Reset a user's password"""
    data = request.json

    if not data or not data.get('token') or not data.get('password'):
        return jsonify({"error": "Token and password are required"}), 400

    token = data.get('token')
    password = data.get('password')

    # Find user by token
    user = User.query.filter_by(reset_token=token).first()
    if not user or not user.verify_reset_token(token):
        return jsonify({"error": "Invalid or expired token"}), 400

    # Update password
    user.set_password(password)
    user.clear_reset_token()
    db.session.commit()

    return jsonify({"message": "Password reset successful"}), 200

def send_reset_email(email, token):
    """Send a password reset email"""
    # Get email configuration from environment variables
    smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    smtp_port = int(os.getenv('SMTP_PORT', 587))
    smtp_username = os.getenv('SMTP_USERNAME', '')
    smtp_password = os.getenv('SMTP_PASSWORD', '')

    # Create message
    msg = MIMEMultipart()
    msg['From'] = smtp_username
    msg['To'] = email
    msg['Subject'] = 'إعادة تعيين كلمة المرور - مشاعر'

    # Create reset link
    reset_link = f"{request.host_url}reset-password/{token}"

    # Create message body
    body = f"""
    <html>
    <body dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>إعادة تعيين كلمة المرور</h2>
        <p>لقد تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بك.</p>
        <p>انقر على الرابط أدناه لإعادة تعيين كلمة المرور:</p>
        <p><a href="{reset_link}" style="background-color: #bd93f9; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">إعادة تعيين كلمة المرور</a></p>
        <p>أو انسخ والصق الرابط التالي في متصفحك:</p>
        <p>{reset_link}</p>
        <p>ينتهي هذا الرابط خلال 24 ساعة.</p>
        <p>إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد الإلكتروني.</p>
        <p>مع تحيات،<br>فريق مشاعر</p>
    </body>
    </html>
    """

    msg.attach(MIMEText(body, 'html'))

    # Send email
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.send_message(msg)

def send_otp_email(email, otp):
    """Send an OTP verification email"""
    # Get email configuration from environment variables
    smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    smtp_port = int(os.getenv('SMTP_PORT', 587))
    smtp_username = os.getenv('SMTP_USERNAME', '')
    smtp_password = os.getenv('SMTP_PASSWORD', '')

    # Create message
    msg = MIMEMultipart()
    msg['From'] = smtp_username
    msg['To'] = email
    msg['Subject'] = 'رمز التحقق - مشاعر'

    # Create message body
    body = f"""
    <html>
    <body dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>رمز التحقق</h2>
        <p>مرحبًا،</p>
        <p>رمز التحقق الخاص بك هو:</p>
        <h1 style="font-size: 32px; background-color: #f5f5f5; padding: 10px; text-align: center; letter-spacing: 5px;">{otp}</h1>
        <p>ينتهي هذا الرمز خلال 10 دقائق.</p>
        <p>إذا لم تطلب هذا الرمز، يرجى تجاهل هذا البريد الإلكتروني.</p>
        <p>مع تحيات،<br>فريق مشاعر</p>
    </body>
    </html>
    """

    msg.attach(MIMEText(body, 'html'))

    # Send email
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.send_message(msg)

def send_otp_sms(phone, otp):
    """
    Simulate sending an OTP via SMS
    In a production environment, you would integrate with an SMS service provider
    """
    print(f"[SIMULATED SMS] Sending OTP {otp} to {phone}")
    # In a real implementation, you would call an SMS API here
    return True

def send_otp_whatsapp(phone, otp):
    """
    Send an OTP via WhatsApp
    In a production environment, you would integrate with the WhatsApp Business API
    """
    print(f"[SIMULATED WHATSAPP] Sending OTP {otp} to {phone}")

    # Get WhatsApp API configuration from environment variables
    api_key = os.getenv('WHATSAPP_API_KEY', '')
    api_url = os.getenv('WHATSAPP_API_URL', 'https://api.whatsapp.com/v1/messages')

    # Format the message
    message = f"رمز التحقق الخاص بك هو: {otp}\n\nهذا الرمز صالح لمدة 10 دقائق. لا تشاركه مع أي شخص."

    # In a real implementation, you would call the WhatsApp Business API
    # For this implementation, we'll simulate the API call
    try:
        # Simulate API call
        # In a real implementation, you would do something like:
        # response = requests.post(
        #     api_url,
        #     headers={'Authorization': f'Bearer {api_key}'},
        #     json={
        #         'to': phone,
        #         'type': 'text',
        #         'text': {'body': message}
        #     }
        # )
        # return response.status_code == 200

        # For simulation, always return success
        return True
    except Exception as e:
        print(f"Error sending WhatsApp message: {str(e)}")
        return False

@auth_bp.route("/api/send-email-otp", methods=["POST"])
def send_email_otp():
    """Generate and send an OTP to the user's email"""
    # Check if user is authenticated
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    # Get user
    user = User.query.get(user_id)
    if not user:
        session.pop("user_id", None)
        return jsonify({"error": "User not found"}), 404

    # Check if cooldown period is active
    cooldown_seconds = 30  # 30 seconds cooldown
    if not user.can_resend_email_otp(cooldown_seconds):
        remaining_time = user.time_until_email_resend(cooldown_seconds)
        return jsonify({
            "error": "Please wait before requesting another OTP",
            "cooldown": True,
            "remaining_seconds": remaining_time
        }), 429  # Too Many Requests

    # Generate OTP
    otp = user.generate_email_otp()
    db.session.commit()

    # Send OTP email
    try:
        send_otp_email(user.email, otp)
        return jsonify({"message": "OTP sent to email"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to send OTP email: {str(e)}"}), 500

@auth_bp.route("/api/verify-email-otp", methods=["POST"])
def verify_email_otp():
    """Verify the email OTP"""
    data = request.json

    # Check if user is authenticated
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    # Validate required fields
    if not data or not data.get('otp'):
        return jsonify({"error": "OTP is required"}), 400

    otp = data.get('otp')

    # Get user
    user = User.query.get(user_id)
    if not user:
        session.pop("user_id", None)
        return jsonify({"error": "User not found"}), 404

    # Verify OTP
    if user.verify_email_otp(otp):
        db.session.commit()
        return jsonify({
            "message": "Email verified successfully",
            "user": user.to_dict()
        }), 200
    else:
        return jsonify({"error": "Invalid or expired OTP"}), 400

@auth_bp.route("/api/send-phone-otp", methods=["POST"])
def send_phone_otp():
    """Generate and send an OTP to the user's phone"""
    # Check if user is authenticated
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    # Get user
    user = User.query.get(user_id)
    if not user:
        session.pop("user_id", None)
        return jsonify({"error": "User not found"}), 404

    # Check if user has a phone number
    if not user.phone:
        return jsonify({"error": "No phone number associated with account"}), 400

    # Check if cooldown period is active
    cooldown_seconds = 30  # 30 seconds cooldown
    if not user.can_resend_phone_otp(cooldown_seconds):
        remaining_time = user.time_until_phone_resend(cooldown_seconds)
        return jsonify({
            "error": "Please wait before requesting another OTP",
            "cooldown": True,
            "remaining_seconds": remaining_time
        }), 429  # Too Many Requests

    # Generate OTP
    otp = user.generate_phone_otp()
    db.session.commit()

    # Send OTP SMS
    try:
        send_otp_sms(user.phone, otp)
        return jsonify({"message": "OTP sent to phone"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to send OTP SMS: {str(e)}"}), 500

@auth_bp.route("/api/verify-phone-otp", methods=["POST"])
def verify_phone_otp():
    """Verify the phone OTP"""
    data = request.json

    # Check if user is authenticated
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    # Validate required fields
    if not data or not data.get('otp'):
        return jsonify({"error": "OTP is required"}), 400

    otp = data.get('otp')

    # Get user
    user = User.query.get(user_id)
    if not user:
        session.pop("user_id", None)
        return jsonify({"error": "User not found"}), 404

    # Verify OTP
    if user.verify_phone_otp(otp):
        db.session.commit()
        return jsonify({
            "message": "Phone verified successfully",
            "user": user.to_dict()
        }), 200
    else:
        return jsonify({"error": "Invalid or expired OTP"}), 400

@auth_bp.route("/api/send-whatsapp-otp", methods=["POST"])
def send_whatsapp_otp():
    """Generate and send an OTP to the user's WhatsApp"""
    # Check if user is authenticated
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    # Get user
    user = User.query.get(user_id)
    if not user:
        session.pop("user_id", None)
        return jsonify({"error": "User not found"}), 404

    # Check if user has a phone number
    if not user.phone:
        return jsonify({"error": "No phone number associated with account"}), 400

    # Check if cooldown period is active
    cooldown_seconds = 30  # 30 seconds cooldown
    if not user.can_resend_phone_otp(cooldown_seconds):
        remaining_time = user.time_until_phone_resend(cooldown_seconds)
        return jsonify({
            "error": "Please wait before requesting another OTP",
            "cooldown": True,
            "remaining_seconds": remaining_time
        }), 429  # Too Many Requests

    # Generate OTP
    otp = user.generate_phone_otp()
    db.session.commit()

    # Send OTP via WhatsApp
    try:
        if send_otp_whatsapp(user.phone, otp):
            return jsonify({"message": "OTP sent to WhatsApp"}), 200
        else:
            return jsonify({"error": "Failed to send OTP via WhatsApp"}), 500
    except Exception as e:
        return jsonify({"error": f"Failed to send OTP via WhatsApp: {str(e)}"}), 500

@auth_bp.route("/api/verify-whatsapp-otp", methods=["POST"])
def verify_whatsapp_otp():
    """Verify the WhatsApp OTP"""
    data = request.json

    # Check if user is authenticated
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    # Validate required fields
    if not data or not data.get('otp'):
        return jsonify({"error": "OTP is required"}), 400

    otp = data.get('otp')

    # Get user
    user = User.query.get(user_id)
    if not user:
        session.pop("user_id", None)
        return jsonify({"error": "User not found"}), 404

    # Verify OTP (WhatsApp OTP uses the same field as phone OTP)
    if user.verify_phone_otp(otp):
        db.session.commit()
        return jsonify({
            "message": "WhatsApp verified successfully",
            "user": user.to_dict()
        }), 200
    else:
        return jsonify({"error": "Invalid or expired OTP"}), 400

@auth_bp.route("/api/update-profile", methods=["PUT"])
def update_profile():
    """Update user profile information"""
    data = request.json

    # Check if user is authenticated
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    # Get user
    user = User.query.get(user_id)
    if not user:
        session.pop("user_id", None)
        return jsonify({"error": "User not found"}), 404

    # Update email if provided
    if data.get('email') and data.get('email') != user.email:
        email = data.get('email')

        # Validate email format
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, email):
            return jsonify({"error": "Invalid email format"}), 400

        # Check if email is already in use
        existing_user = User.get_by_email(email)
        if existing_user and existing_user.id != user.id:
            return jsonify({"error": "Email already registered"}), 400

        # Update email and reset verification
        user.email = email
        user.email_verified = False

    # Update phone if provided
    if data.get('phone') and data.get('phone') != user.phone:
        phone = data.get('phone')

        # Validate phone format
        phone_regex = r'^\+?[0-9]{10,15}$'
        if not re.match(phone_regex, phone):
            return jsonify({"error": "Invalid phone format"}), 400

        # Check if phone is already in use
        existing_phone = User.get_by_phone(phone)
        if existing_phone and existing_phone.id != user.id:
            return jsonify({"error": "Phone number already registered"}), 400

        # Update phone and reset verification
        user.phone = phone
        user.phone_verified = False

    # Update password if provided
    if data.get('current_password') and data.get('new_password'):
        current_password = data.get('current_password')
        new_password = data.get('new_password')

        # Verify current password
        if not user.check_password(current_password):
            return jsonify({"error": "Current password is incorrect"}), 400

        # Update password
        user.set_password(new_password)

    # Save changes
    try:
        db.session.commit()
        return jsonify({
            "message": "Profile updated successfully",
            "user": user.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to update profile: {str(e)}"}), 500
