import React from 'react';
import VerificationGate from './VerificationGate.jsx';
import './PremiumFeature.css';

/**
 * PremiumFeature component
 * A sample component that demonstrates how to use VerificationGate
 * @param {Object} props - Component props
 * @param {string} props.title - Feature title
 * @param {string} props.description - Feature description
 * @param {boolean} props.strictVerification - If true, requires verification to access
 */
const PremiumFeature = ({ title, description, strictVerification = true }) => {
  return (
    <VerificationGate strict={strictVerification}>
      <div className="premium-feature">
        <div className="premium-feature-header">
          <h3>{title}</h3>
          <span className="premium-badge">ميزة مدفوعة</span>
        </div>
        <p className="premium-feature-description">{description}</p>
        <div className="premium-feature-content">
          {/* Sample premium content */}
          <div className="premium-feature-demo">
            <div className="premium-feature-icon"></div>
            <div className="premium-feature-stats">
              <div className="stat">
                <span className="stat-value">98%</span>
                <span className="stat-label">دقة التحليل</span>
              </div>
              <div className="stat">
                <span className="stat-value">24/7</span>
                <span className="stat-label">دعم متواصل</span>
              </div>
              <div className="stat">
                <span className="stat-value">+50</span>
                <span className="stat-label">ميزة متقدمة</span>
              </div>
            </div>
          </div>
          <button className="premium-feature-button">استخدم الميزة الآن</button>
        </div>
      </div>
    </VerificationGate>
  );
};

export default PremiumFeature;