from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from backend.app import db
import secrets
import string
import random

class User(db.Model):
    """User model for authentication"""
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=True)
    password_hash = db.Column(db.String(256), nullable=False)
    reset_token = db.Column(db.String(100), nullable=True)
    reset_token_expiry = db.Column(db.DateTime, nullable=True)
    email_verified = db.Column(db.Boolean, default=False)
    phone_verified = db.Column(db.Boolean, default=False)
    email_otp = db.Column(db.String(6), nullable=True)
    phone_otp = db.Column(db.String(6), nullable=True)
    otp_expiry = db.Column(db.DateTime, nullable=True)
    last_email_otp_sent = db.Column(db.DateTime, nullable=True)
    last_phone_otp_sent = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self, email, password, phone=None):
        self.email = email
        self.set_password(password)
        self.phone = phone

    def set_password(self, password):
        """Set password hash"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Check password against hash"""
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        """Convert user to dictionary"""
        return {
            'id': self.id,
            'email': self.email,
            'phone': self.phone,
            'email_verified': self.email_verified,
            'phone_verified': self.phone_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def generate_reset_token(self):
        """Generate a password reset token"""
        # Generate a secure random token
        token = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(64))

        # Set token and expiry (24 hours from now)
        self.reset_token = token
        self.reset_token_expiry = datetime.utcnow() + timedelta(hours=24)

        return token

    def verify_reset_token(self, token):
        """Verify a password reset token"""
        # Check if token matches and is not expired
        if self.reset_token == token and self.reset_token_expiry > datetime.utcnow():
            return True
        return False

    def clear_reset_token(self):
        """Clear the password reset token"""
        self.reset_token = None
        self.reset_token_expiry = None

    @staticmethod
    def get_by_email(email):
        """Get user by email"""
        return User.query.filter_by(email=email).first()

    @staticmethod
    def get_by_phone(phone):
        """Get user by phone"""
        return User.query.filter_by(phone=phone).first()

    def generate_email_otp(self):
        """Generate a 6-digit OTP for email verification"""
        otp = ''.join(random.choices(string.digits, k=6))
        self.email_otp = otp
        now = datetime.utcnow()
        self.otp_expiry = now + timedelta(minutes=10)
        self.last_email_otp_sent = now
        return otp

    def generate_phone_otp(self):
        """Generate a 6-digit OTP for phone verification"""
        otp = ''.join(random.choices(string.digits, k=6))
        self.phone_otp = otp
        now = datetime.utcnow()
        self.otp_expiry = now + timedelta(minutes=10)
        self.last_phone_otp_sent = now
        return otp

    def can_resend_email_otp(self, cooldown_seconds=30):
        """Check if email OTP can be resent (after cooldown period)"""
        if not self.last_email_otp_sent:
            return True
        elapsed = datetime.utcnow() - self.last_email_otp_sent
        return elapsed.total_seconds() >= cooldown_seconds

    def can_resend_phone_otp(self, cooldown_seconds=30):
        """Check if phone OTP can be resent (after cooldown period)"""
        if not self.last_phone_otp_sent:
            return True
        elapsed = datetime.utcnow() - self.last_phone_otp_sent
        return elapsed.total_seconds() >= cooldown_seconds

    def time_until_email_resend(self, cooldown_seconds=30):
        """Get remaining time until email OTP can be resent (in seconds)"""
        if not self.last_email_otp_sent:
            return 0
        elapsed = datetime.utcnow() - self.last_email_otp_sent
        remaining = cooldown_seconds - elapsed.total_seconds()
        return max(0, int(remaining))

    def time_until_phone_resend(self, cooldown_seconds=30):
        """Get remaining time until phone OTP can be resent (in seconds)"""
        if not self.last_phone_otp_sent:
            return 0
        elapsed = datetime.utcnow() - self.last_phone_otp_sent
        remaining = cooldown_seconds - elapsed.total_seconds()
        return max(0, int(remaining))

    def verify_email_otp(self, otp):
        """Verify the email OTP"""
        if self.email_otp == otp and self.otp_expiry > datetime.utcnow():
            self.email_verified = True
            self.email_otp = None
            return True
        return False

    def verify_phone_otp(self, otp):
        """Verify the phone OTP"""
        if self.phone_otp == otp and self.otp_expiry > datetime.utcnow():
            self.phone_verified = True
            self.phone_otp = None
            return True
        return False
