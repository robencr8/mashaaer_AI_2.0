import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import whatsAppOTPService from '../services/WhatsAppOTPService.js';
import './AuthForms.css';
import './ProfilePage.css';

const ProfilePage = () => {
  const { 
    currentUser, 
    updateProfile, 
    sendEmailOTP, 
    verifyEmailOTP, 
    sendPhoneOTP, 
    verifyPhoneOTP,
    sendWhatsAppOTP,
    verifyWhatsAppOTP, 
    error, 
    otpSent 
  } = useAuth();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  const [verifyingWhatsApp, setVerifyingWhatsApp] = useState(false);
  const [whatsAppAvailable, setWhatsAppAvailable] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Cooldown state
  const [emailCooldown, setEmailCooldown] = useState(0);
  const [phoneCooldown, setPhoneCooldown] = useState(0);
  const [whatsAppCooldown, setWhatsAppCooldown] = useState(0);

  // Initialize form with current user data
  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');

      // Check if WhatsApp is available
      setWhatsAppAvailable(whatsAppOTPService.isAvailable());
    }
  }, [currentUser]);

  // Check WhatsApp availability when component mounts
  useEffect(() => {
    const checkWhatsAppAvailability = async () => {
      try {
        // Initialize WhatsApp OTP service
        whatsAppOTPService.initialize();

        // Check if WhatsApp is available
        setWhatsAppAvailable(whatsAppOTPService.isAvailable());
      } catch (err) {
        console.error('Error checking WhatsApp availability:', err);
        setWhatsAppAvailable(false);
      }
    };

    checkWhatsAppAvailability();
  }, []);

  // Handle cooldown timers
  useEffect(() => {
    // Only set up interval if any cooldown is active
    if (emailCooldown <= 0 && phoneCooldown <= 0 && whatsAppCooldown <= 0) {
      return;
    }

    // Set up interval to decrement cooldown timers every second
    const interval = setInterval(() => {
      if (emailCooldown > 0) {
        setEmailCooldown(prev => prev - 1);
      }

      if (phoneCooldown > 0) {
        setPhoneCooldown(prev => prev - 1);
      }

      if (whatsAppCooldown > 0) {
        setWhatsAppCooldown(prev => prev - 1);
      }
    }, 1000);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [emailCooldown, phoneCooldown, whatsAppCooldown]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    // Reset messages
    setSuccessMessage('');
    setErrorMessage('');

    // Validate form
    if (newPassword && newPassword !== confirmPassword) {
      window.toast.error('كلمات المرور غير متطابقة');
      return;
    }

    if (newPassword && !currentPassword) {
      window.toast.error('يجب إدخال كلمة المرور الحالية لتغيير كلمة المرور');
      return;
    }

    // Prepare data for update
    const profileData = {};

    if (email !== currentUser.email) {
      profileData.email = email;
    }

    if (phone !== currentUser.phone) {
      profileData.phone = phone;
    }

    if (newPassword && currentPassword) {
      profileData.current_password = currentPassword;
      profileData.new_password = newPassword;
    }

    // Only update if there are changes
    if (Object.keys(profileData).length === 0) {
      window.toast.info('لم يتم إجراء أي تغييرات');
      return;
    }

    setIsLoading(true);

    try {
      await updateProfile(profileData);
      window.toast.success('تم تحديث الملف الشخصي بنجاح');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      window.toast.error(err.response?.data?.error || 'فشل تحديث الملف الشخصي');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmailOTP = async () => {
    setSuccessMessage('');
    setErrorMessage('');
    setIsLoading(true);

    try {
      await sendEmailOTP();
      setVerifyingEmail(true);
      window.toast.success('تم إرسال رمز التحقق إلى بريدك الإلكتروني');
      // Set cooldown after successful send
      setEmailCooldown(30);
    } catch (err) {
      const responseData = err.response?.data;

      // Check if this is a cooldown error
      if (responseData?.cooldown && responseData?.remaining_seconds) {
        setEmailCooldown(responseData.remaining_seconds);
        window.toast.info(`يرجى الانتظار ${responseData.remaining_seconds} ثانية قبل إعادة الإرسال`);
      } else {
        window.toast.error(responseData?.error || 'فشل إرسال رمز التحقق');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmailOTP = async () => {
    setSuccessMessage('');
    setErrorMessage('');
    setIsLoading(true);

    try {
      await verifyEmailOTP(otp);
      setVerifyingEmail(false);
      setOtp('');
      window.toast.success('تم التحقق من البريد الإلكتروني بنجاح');
    } catch (err) {
      window.toast.error(err.response?.data?.error || 'فشل التحقق من رمز التحقق');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendPhoneOTP = async () => {
    setSuccessMessage('');
    setErrorMessage('');
    setIsLoading(true);

    try {
      await sendPhoneOTP();
      setVerifyingPhone(true);
      window.toast.success('تم إرسال رمز التحقق إلى هاتفك');
      // Set cooldown after successful send
      setPhoneCooldown(30);
    } catch (err) {
      const responseData = err.response?.data;

      // Check if this is a cooldown error
      if (responseData?.cooldown && responseData?.remaining_seconds) {
        setPhoneCooldown(responseData.remaining_seconds);
        window.toast.info(`يرجى الانتظار ${responseData.remaining_seconds} ثانية قبل إعادة الإرسال`);
      } else {
        window.toast.error(responseData?.error || 'فشل إرسال رمز التحقق');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPhoneOTP = async () => {
    setSuccessMessage('');
    setErrorMessage('');
    setIsLoading(true);

    try {
      await verifyPhoneOTP(otp);
      setVerifyingPhone(false);
      setOtp('');
      window.toast.success('تم التحقق من رقم الهاتف بنجاح');
    } catch (err) {
      window.toast.error(err.response?.data?.error || 'فشل التحقق من رمز التحقق');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendWhatsAppOTP = async () => {
    setSuccessMessage('');
    setErrorMessage('');
    setIsLoading(true);

    try {
      // If WhatsApp is not connected, show connect dialog
      if (!whatsAppAvailable) {
        const containerId = 'whatsapp-qr-container';

        // Create container for QR code if it doesn't exist
        let container = document.getElementById(containerId);
        if (!container) {
          container = document.createElement('div');
          container.id = containerId;
          container.className = 'whatsapp-qr-container';
          document.body.appendChild(container);
        }

        // Show toast with instructions
        window.toast.info('يرجى ربط WhatsApp أولاً للمتابعة');

        // Try to connect to WhatsApp
        try {
          await whatsAppOTPService.connect(containerId);
          setWhatsAppAvailable(true);
          window.toast.success('تم ربط WhatsApp بنجاح');
        } catch (err) {
          window.toast.error('فشل ربط WhatsApp. يرجى المحاولة مرة أخرى');
          setIsLoading(false);
          return;
        }
      }

      // Send OTP via WhatsApp
      await sendWhatsAppOTP();
      setVerifyingWhatsApp(true);
      window.toast.success('تم إرسال رمز التحقق إلى WhatsApp');
      // Set cooldown after successful send
      setWhatsAppCooldown(30);
    } catch (err) {
      const responseData = err.response?.data;

      // Check if this is a cooldown error
      if (responseData?.cooldown && responseData?.remaining_seconds) {
        setWhatsAppCooldown(responseData.remaining_seconds);
        window.toast.info(`يرجى الانتظار ${responseData.remaining_seconds} ثانية قبل إعادة الإرسال`);
      } else {
        window.toast.error(responseData?.error || 'فشل إرسال رمز التحقق');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyWhatsAppOTP = async () => {
    setSuccessMessage('');
    setErrorMessage('');
    setIsLoading(true);

    try {
      await verifyWhatsAppOTP(otp);
      setVerifyingWhatsApp(false);
      setOtp('');
      window.toast.success('تم التحقق من WhatsApp بنجاح');
    } catch (err) {
      window.toast.error(err.response?.data?.error || 'فشل التحقق من رمز التحقق');
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return <div className="auth-form-container">يرجى تسجيل الدخول لعرض الملف الشخصي</div>;
  }

  return (
    <div className="auth-form-container">
      <h2 className="auth-form-title">الملف الشخصي</h2>

      <div className="profile-verification-status">
        <div className="verification-item">
          <span>البريد الإلكتروني: </span>
          <span className={currentUser.email_verified ? "verified" : "not-verified"}>
            {currentUser.email_verified ? "تم التحقق ✓" : "لم يتم التحقق ✗"}
          </span>
          {!currentUser.email_verified && (
            <button 
              type="button" 
              className="verify-button"
              onClick={handleSendEmailOTP}
              disabled={isLoading || verifyingEmail}
            >
              تحقق الآن
            </button>
          )}
        </div>

        {currentUser.phone && (
          <>
            <div className="verification-item">
              <span>رقم الهاتف: </span>
              <span className={currentUser.phone_verified ? "verified" : "not-verified"}>
                {currentUser.phone_verified ? "تم التحقق ✓" : "لم يتم التحقق ✗"}
              </span>
              {!currentUser.phone_verified && (
                <button 
                  type="button" 
                  className="verify-button"
                  onClick={handleSendPhoneOTP}
                  disabled={isLoading || verifyingPhone}
                >
                  تحقق عبر SMS
                </button>
              )}
            </div>

            <div className="verification-item">
              <span>WhatsApp: </span>
              <span className={currentUser.phone_verified ? "verified" : "not-verified"}>
                {currentUser.phone_verified ? "تم التحقق ✓" : "لم يتم التحقق ✗"}
              </span>
              {!currentUser.phone_verified && (
                <button 
                  type="button" 
                  className="verify-button whatsapp-button"
                  onClick={handleSendWhatsAppOTP}
                  disabled={isLoading || verifyingWhatsApp}
                >
                  تحقق عبر WhatsApp
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {(verifyingEmail || verifyingPhone || verifyingWhatsApp) && (
        <div className="otp-verification-form">
          <h3>التحقق برمز OTP</h3>
          <p>
            {verifyingEmail 
              ? "تم إرسال رمز التحقق إلى بريدك الإلكتروني" 
              : verifyingWhatsApp
                ? "تم إرسال رمز التحقق إلى WhatsApp"
                : "تم إرسال رمز التحقق إلى هاتفك"}
          </p>
          <div className="form-group">
            <label htmlFor="otp">رمز التحقق</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="أدخل رمز التحقق"
              disabled={isLoading}
              maxLength={6}
            />
          </div>

          {/* Resend OTP button with cooldown */}
          <div className="resend-otp-container">
            <button 
              type="button" 
              className="resend-otp-button"
              onClick={
                verifyingEmail 
                  ? handleSendEmailOTP 
                  : verifyingWhatsApp
                    ? handleSendWhatsAppOTP
                    : handleSendPhoneOTP
              }
              disabled={
                isLoading || 
                (verifyingEmail && emailCooldown > 0) || 
                (verifyingPhone && phoneCooldown > 0) || 
                (verifyingWhatsApp && whatsAppCooldown > 0)
              }
            >
              {verifyingEmail && emailCooldown > 0 
                ? `إعادة الإرسال (${emailCooldown})`
                : verifyingPhone && phoneCooldown > 0
                  ? `إعادة الإرسال (${phoneCooldown})`
                  : verifyingWhatsApp && whatsAppCooldown > 0
                    ? `إعادة الإرسال (${whatsAppCooldown})`
                    : 'إعادة إرسال الرمز'
              }
            </button>
            <span className="resend-otp-hint">
              {((verifyingEmail && emailCooldown > 0) || 
                (verifyingPhone && phoneCooldown > 0) || 
                (verifyingWhatsApp && whatsAppCooldown > 0)) 
                ? 'يرجى الانتظار قبل إعادة الإرسال' 
                : 'لم يصلك الرمز؟ يمكنك إعادة الإرسال'
              }
            </span>
          </div>

          <button 
            type="button" 
            className="auth-submit-button"
            onClick={
              verifyingEmail 
                ? handleVerifyEmailOTP 
                : verifyingWhatsApp
                  ? handleVerifyWhatsAppOTP
                  : handleVerifyPhoneOTP
            }
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? 'جاري التحقق...' : 'تحقق'}
          </button>
        </div>
      )}

      <form className="auth-form" onSubmit={handleProfileUpdate}>
        <h3>تحديث المعلومات الشخصية</h3>

        <div className="form-group">
          <label htmlFor="email">البريد الإلكتروني</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="أدخل البريد الإلكتروني"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">رقم الهاتف (اختياري)</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="أدخل رقم الهاتف"
            disabled={isLoading}
          />
        </div>

        <h3>تغيير كلمة المرور</h3>

        <div className="form-group">
          <label htmlFor="currentPassword">كلمة المرور الحالية</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="أدخل كلمة المرور الحالية"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">كلمة المرور الجديدة</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="أدخل كلمة المرور الجديدة"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">تأكيد كلمة المرور الجديدة</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="أعد إدخال كلمة المرور الجديدة"
            disabled={isLoading}
          />
        </div>

        <button 
          type="submit" 
          className="auth-submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
