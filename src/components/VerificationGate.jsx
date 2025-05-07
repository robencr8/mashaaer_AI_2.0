import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { isUserVerified } from '../utils/verificationUtils.js';
import './VerificationGate.css';

/**
 * VerificationGate component
 * Restricts access to premium features for unverified users
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The content to render if user is verified
 * @param {boolean} props.strict - If true, completely blocks access. If false, shows warning but allows access.
 */
const VerificationGate = ({ children, strict = false }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const verified = isUserVerified(currentUser);
  
  const handleVerifyNow = () => {
    navigate('/profile');
    window.toast.info('يرجى توثيق حسابك للوصول إلى جميع الميزات');
  };
  
  if (!currentUser) {
    return (
      <div className="verification-gate">
        <div className="verification-message error">
          <h3>يرجى تسجيل الدخول</h3>
          <p>يجب عليك تسجيل الدخول للوصول إلى هذه الميزة</p>
          <button 
            className="verification-button"
            onClick={() => navigate('/login')}
          >
            تسجيل الدخول
          </button>
        </div>
      </div>
    );
  }
  
  if (!verified) {
    return (
      <div className="verification-gate">
        <div className="verification-message warning">
          <h3>التوثيق مطلوب</h3>
          <p>يجب توثيق حسابك للوصول إلى هذه الميزة</p>
          <p className="verification-details">
            قم بتوثيق بريدك الإلكتروني أو رقم هاتفك من صفحة الملف الشخصي
          </p>
          <button 
            className="verification-button"
            onClick={handleVerifyNow}
          >
            توثيق الآن
          </button>
          
          {!strict && (
            <button 
              className="verification-skip-button"
              onClick={() => window.toast.warning('ننصح بتوثيق حسابك للوصول إلى جميع الميزات')}
            >
              متابعة بدون توثيق
            </button>
          )}
        </div>
        
        {!strict && children}
      </div>
    );
  }
  
  return <>{children}</>;
};

export default VerificationGate;