import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './UpgradePrompt.css';

/**
 * UpgradePrompt Component
 * 
 * A component that prompts users to upgrade to a premium subscription
 * to access advanced features. Also offers a free trial option.
 */
const UpgradePrompt = ({ featureName = "هذه الميزة" }) => {
  const [loading, setLoading] = useState(false);
  const [trialActivated, setTrialActivated] = useState(false);
  const [error, setError] = useState(null);

  // Handle trial activation
  const handleActivateTrial = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/subscription/activate-trial');

      if (response.data.success) {
        setTrialActivated(true);
        // Reload the page after a short delay to reflect the new subscription status
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setError('Failed to activate trial. Please try again later.');
      }
    } catch (err) {
      console.error('Error activating trial:', err);
      setError(err.response?.data?.error || 'Failed to activate trial. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // If trial was just activated, show success message
  if (trialActivated) {
    return (
      <div className="upgrade-prompt trial-success">
        <div className="upgrade-icon">🎉</div>
        <h3 className="upgrade-title">تم تفعيل الفترة التجريبية بنجاح!</h3>
        <p className="upgrade-message">
          تم تفعيل الفترة التجريبية المجانية لمدة 7 أيام. استمتع بجميع الميزات المتقدمة!
        </p>
        <p className="trial-reload-message">جاري إعادة تحميل الصفحة...</p>
      </div>
    );
  }

  return (
    <div className="upgrade-prompt">
      <div className="upgrade-icon">🔒</div>
      <h3 className="upgrade-title">ميزة متاحة للمشتركين فقط</h3>
      <p className="upgrade-message">
        {featureName} متاحة فقط للمشتركين في الباقة المميزة.
        قم بالترقية للوصول إلى جميع الميزات المتقدمة.
      </p>
      <div className="upgrade-features">
        <h4>ميزات الاشتراك المميز:</h4>
        <ul>
          <li>✨ خط زمني متقدم للمشاعر</li>
          <li>✨ تحليل أسبوعي للمشاعر</li>
          <li>✨ بحث متقدم في الذاكرة</li>
          <li>✨ أخبار الذكاء الاصطناعي</li>
          <li>✨ مقاييس النظام</li>
        </ul>
      </div>

      {error && (
        <div className="trial-error">
          {error}
        </div>
      )}

      <div className="upgrade-buttons">
        <Link to="/subscription" className="upgrade-button">
          ترقية الآن
        </Link>
        <button 
          className="trial-button" 
          onClick={handleActivateTrial}
          disabled={loading}
        >
          {loading ? 'جاري التفعيل...' : 'تجربة مجانية لمدة 7 أيام'}
        </button>
      </div>
    </div>
  );
};

export default UpgradePrompt;
