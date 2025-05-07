import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import './AuthForms.css';

const LoginForm = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailOrPhone || !password) {
      setErrorMessage('جميع الحقول مطلوبة');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    clearError();

    try {
      await login(emailOrPhone, password);
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2 className="auth-form-title">تسجيل الدخول</h2>

      {(errorMessage || error) && (
        <div className="auth-error-message">
          {errorMessage || error}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="emailOrPhone">البريد الإلكتروني أو رقم الهاتف</label>
          <input
            type="text"
            id="emailOrPhone"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            placeholder="أدخل البريد الإلكتروني أو رقم الهاتف"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">كلمة المرور</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="أدخل كلمة المرور"
            disabled={isLoading}
          />
        </div>

        <button 
          type="submit" 
          className="auth-submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
        </button>
      </form>

      <div className="auth-links">
        <p>
          ليس لديك حساب؟{' '}
          <Link to="/register" className="auth-link">
            إنشاء حساب جديد
          </Link>
        </p>
        <p>
          <Link to="/forgot-password" className="auth-link">
            نسيت كلمة المرور؟
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
