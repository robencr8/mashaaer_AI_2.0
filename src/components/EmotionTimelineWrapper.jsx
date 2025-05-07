import React, { useState, useEffect } from 'react';
import AdvancedEmotionTimeline from './AdvancedEmotionTimeline.jsx';
import UpgradePrompt from './UpgradePrompt.jsx';
import axios from 'axios';

/**
 * EmotionTimelineWrapper Component
 * 
 * A wrapper component that conditionally renders either the AdvancedEmotionTimeline
 * or the UpgradePrompt based on the user's subscription status.
 */
const EmotionTimelineWrapper = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState('Free');
  const [loading, setLoading] = useState(true);

  // Get subscription status from window object or API
  useEffect(() => {
    // Check if subscription status is available in window object
    // (injected by Flask's context_processor)
    if (window.subscriptionStatus) {
      setSubscriptionStatus(window.subscriptionStatus);
      setLoading(false);
    } else {
      // Fetch subscription status from API as a fallback
      fetchSubscriptionStatus();
    }
  }, []);

  // Fetch subscription status from API
  const fetchSubscriptionStatus = async () => {
    try {
      const response = await axios.get('/api/subscription/status');
      setSubscriptionStatus(response.data.status);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching subscription status:', err);
      // Default to Free if there's an error
      setSubscriptionStatus('Free');
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="timeline-loading">
        <div className="loading-spinner"></div>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  // Conditionally render based on subscription status
  return (
    <>
      {subscriptionStatus === 'Premium' ? (
        <AdvancedEmotionTimeline />
      ) : (
        <UpgradePrompt featureName="خط زمني المشاعر المتقدم" />
      )}
    </>
  );
};

export default EmotionTimelineWrapper;