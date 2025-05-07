import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import './AuthForms.css';

const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [email, setEmail] = useState('');

  const { token } = useParams();
  const navigate = useNavigate();
  const { validateResetToken, resetPassword, error, clearError } = useAuth();

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setErrorMessage('رمز إعادة تعيين كلمة المرور غير صالح');
        setIsValidating(false);
        return;
      }

      try {
        clearError();
        const response = await validateResetToken(token);
        setEmail(response.email);
        setIsValidating(false);
      } catch (err) {
        setErrorMessage(error || 'رمز إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية');
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token, validateResetToken, clearError, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setErrorMessage('جميع الحقول مطلوبة');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('كلمات المرور غير متطابقة');
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setErrorMessage('يجب أن تتكون كلمة المرور من 8 أحرف على الأقل');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    clearError();

    try {
      const response = await resetPassword(token, password);

      setSuccessMessage(response.message || 'تم إعادة تعيين كلمة المرور بنجاح');

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setErrorMessage(error || 'حدث خطأ أثناء إعادة تعيين كلمة المرور');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while validating token
  if (isValidating) {
    return (
      <div className="auth-form-container">
        <div className="auth-loading">
          <div className="auth-loading-spinner"></div>
          <p>جاري التحقق من صلاحية الرمز...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-form-container">
      <h2 className="auth-form-title">إعادة تعيين كلمة المرور</h2>

      {errorMessage && (
        <div className="auth-error-message">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="auth-success-message">
          {successMessage}
          <p className="redirect-message">سيتم توجيهك إلى صفحة تسجيل الدخول خلال 3 ثوانٍ...</p>
        </div>
      )}

      {!errorMessage && !successMessage && email && (
        <div className="auth-info-message">
          إعادة تعيين كلمة المرور للحساب: {email}
        </div>
      )}

      {!errorMessage && !successMessage && (
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">كلمة المرور الجديدة</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور الجديدة"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">تأكيد كلمة المرور</label>
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
            {isLoading ? 'جاري إعادة التعيين...' : 'إعادة تعيين كلمة المرور'}
          </button>
        </form>
      )}

      <div className="auth-links">
        <p>
          <Link to="/login" className="auth-link">
            العودة إلى تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
