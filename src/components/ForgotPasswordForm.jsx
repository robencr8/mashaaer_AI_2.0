import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import './AuthForms.css';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { requestPasswordReset, error, clearError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage('البريد الإلكتروني مطلوب');
      return;
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('صيغة البريد الإلكتروني غير صحيحة');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    clearError();

    try {
      const response = await requestPasswordReset(email);
      setSuccessMessage(response.message || 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
    } catch (err) {
      setErrorMessage(error || 'حدث خطأ أثناء إرسال طلب إعادة تعيين كلمة المرور');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2 className="auth-form-title">نسيت كلمة المرور</h2>

      {errorMessage && (
        <div className="auth-error-message">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="auth-success-message">
          {successMessage}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">البريد الإلكتروني</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="أدخل البريد الإلكتروني"
            disabled={isLoading || successMessage}
          />
        </div>

        <button 
          type="submit" 
          className="auth-submit-button"
          disabled={isLoading || successMessage}
        >
          {isLoading ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}
        </button>
      </form>

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

export default ForgotPasswordForm;
