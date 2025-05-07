import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import VerificationGate from './VerificationGate.jsx';
import PremiumFeature from './PremiumFeature.jsx';
import './FeatureDemo.css';

/**
 * FeatureDemo component
 * Demonstrates the new features: toast notifications, OTP verification, and feature restrictions
 */
const FeatureDemo = () => {
  const { currentUser } = useAuth();
  
  const handleShowToast = (type) => {
    switch (type) {
      case 'success':
        window.toast.success('هذا مثال على رسالة نجاح');
        break;
      case 'error':
        window.toast.error('هذا مثال على رسالة خطأ');
        break;
      case 'info':
        window.toast.info('هذا مثال على رسالة معلومات');
        break;
      default:
        window.toast.info('هذا مثال على رسالة');
    }
  };
  
  return (
    <div className="feature-demo-container">
      <h1 className="feature-demo-title">عرض الميزات الجديدة</h1>
      
      <section className="feature-demo-section">
        <h2>الإشعارات التلقائية</h2>
        <p>انقر على الأزرار أدناه لعرض أنواع مختلفة من الإشعارات</p>
        
        <div className="toast-demo-buttons">
          <button 
            className="toast-demo-button success"
            onClick={() => handleShowToast('success')}
          >
            إشعار نجاح
          </button>
          
          <button 
            className="toast-demo-button error"
            onClick={() => handleShowToast('error')}
          >
            إشعار خطأ
          </button>
          
          <button 
            className="toast-demo-button info"
            onClick={() => handleShowToast('info')}
          >
            إشعار معلومات
          </button>
        </div>
      </section>
      
      <section className="feature-demo-section">
        <h2>التحقق من الهوية</h2>
        <p>يمكنك التحقق من هويتك عبر البريد الإلكتروني أو الرسائل القصيرة أو WhatsApp</p>
        
        {currentUser ? (
          <div className="verification-status-summary">
            <p>
              <strong>حالة التحقق:</strong> {' '}
              {currentUser.email_verified || currentUser.phone_verified 
                ? <span className="verified-status">تم التحقق ✓</span>
                : <span className="not-verified-status">لم يتم التحقق ✗</span>
              }
            </p>
            <p>
              <a href="/profile" className="profile-link">
                انتقل إلى صفحة الملف الشخصي للتحقق
              </a>
            </p>
          </div>
        ) : (
          <p>
            <a href="/login" className="login-link">
              قم بتسجيل الدخول أولاً
            </a>
          </p>
        )}
      </section>
      
      <section className="feature-demo-section">
        <h2>الميزات المقيدة</h2>
        <p>بعض الميزات تتطلب التحقق من الهوية للوصول إليها</p>
        
        <div className="premium-features-container">
          <VerificationGate strict={true}>
            <PremiumFeature 
              title="تحليل المشاعر المتقدم" 
              description="تحليل عميق للمشاعر باستخدام الذكاء الاصطناعي المتقدم"
            />
          </VerificationGate>
          
          <VerificationGate strict={false}>
            <PremiumFeature 
              title="تقارير أسبوعية" 
              description="تقارير أسبوعية مفصلة عن حالتك النفسية والعاطفية"
              strictVerification={false}
            />
          </VerificationGate>
        </div>
      </section>
    </div>
  );
};

export default FeatureDemo;