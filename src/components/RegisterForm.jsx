import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import './AuthForms.css';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!email || !password || !confirmPassword) {
      setErrorMessage('البريد الإلكتروني وكلمة المرور مطلوبة');
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage('كلمات المرور غير متطابقة');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('صيغة البريد الإلكتروني غير صحيحة');
      return;
    }
    
    // Validate phone format if provided
    if (phone) {
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      if (!phoneRegex.test(phone)) {
        setErrorMessage('صيغة رقم الهاتف غير صحيحة');
        return;
      }
    }
    
    setIsLoading(true);
    setErrorMessage('');
    clearError();
    
    try {
      await register(email, password, phone || null);
      navigate('/dashboard'); // Redirect to dashboard after successful registration
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'فشل التسجيل. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="auth-form-container">
      <h2 className="auth-form-title">إنشاء حساب جديد</h2>
      
      {(errorMessage || error) && (
        <div className="auth-error-message">
          {errorMessage || error}
        </div>
      )}
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">البريد الإلكتروني *</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="أدخل البريد الإلكتروني"
            disabled={isLoading}
            required
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
        
        <div className="form-group">
          <label htmlFor="password">كلمة المرور *</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="أدخل كلمة المرور"
            disabled={isLoading}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">تأكيد كلمة المرور *</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="أعد إدخال كلمة المرور"
            disabled={isLoading}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="auth-submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'جاري التسجيل...' : 'إنشاء حساب'}
        </button>
      </form>
      
      <div className="auth-links">
        <p>
          لديك حساب بالفعل؟{' '}
          <Link to="/login" className="auth-link">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;