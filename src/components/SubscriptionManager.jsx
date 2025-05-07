import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SubscriptionManager.css';

const SubscriptionManager = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState('Free');
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paypalClientId, setPaypalClientId] = useState('');

  // Get subscription status and PayPal client ID from window object
  // (injected by Flask's context_processor)
  useEffect(() => {
    if (window.subscriptionStatus) {
      setSubscriptionStatus(window.subscriptionStatus);
    }

    if (window.paypalClientId) {
      setPaypalClientId(window.paypalClientId);
    }

    // Fetch subscription details from API
    fetchSubscriptionDetails();

    // Fetch subscription plans
    fetchSubscriptionPlans();
  }, []);

  // Fetch subscription status from API
  const fetchSubscriptionStatus = async () => {
    try {
      const response = await axios.get('/api/subscription/status');
      setSubscriptionStatus(response.data.status);
    } catch (err) {
      console.error('Error fetching subscription status:', err);
      // Don't set error state here, as this is a fallback
    }
  };

  // Fetch subscription details from API
  const fetchSubscriptionDetails = async () => {
    try {
      const response = await axios.get('/api/subscription/details');
      setSubscriptionDetails(response.data);
      setSubscriptionStatus(response.data.status);
    } catch (err) {
      console.error('Error fetching subscription details:', err);
      // Don't set error state here, as this is a fallback
    }
  };

  // Fetch subscription plans from API
  const fetchSubscriptionPlans = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/subscription/plans');
      setSubscriptionPlans(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching subscription plans:', err);
      setError('Failed to load subscription plans. Please try again later.');
      setLoading(false);
    }
  };

  // Handle subscription button click
  const handleSubscribe = (planId) => {
    // Initialize PayPal if not already initialized
    if (window.paypalIntegration && !window.paypalIntegration.isInitialized) {
      window.paypalIntegration.initialize({
        clientId: paypalClientId
      });
    }

    // Create container for PayPal buttons
    const container = document.getElementById('paypal-button-container');
    if (!container) {
      console.error('PayPal button container not found');
      return;
    }

    // Clear container
    container.innerHTML = '';

    // Dispatch event to trigger PayPal subscription
    document.dispatchEvent(new CustomEvent('subscribeWithPayPal', {
      detail: {
        planId,
        containerId: 'paypal-button-container'
      }
    }));
  };

  // Handle subscription success
  useEffect(() => {
    const handleSubscriptionCreated = (event) => {
      const { subscriptionId, planId } = event.detail;

      // Call API to activate subscription
      axios.post('/api/subscription/activate', {
        subscription_id: subscriptionId,
        plan_id: planId
      })
      .then(response => {
        setSubscriptionStatus('Premium');
        alert('Subscription activated successfully!');
      })
      .catch(err => {
        console.error('Error activating subscription:', err);
        alert('Failed to activate subscription. Please contact support.');
      });
    };

    // Add event listener
    document.addEventListener('subscriptionCreated', handleSubscriptionCreated);

    // Clean up
    return () => {
      document.removeEventListener('subscriptionCreated', handleSubscriptionCreated);
    };
  }, []);

  // Render loading state
  if (loading) {
    return (
      <div className="subscription-manager">
        <div className="subscription-loading">
          <div className="loading-spinner"></div>
          <p>Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="subscription-manager">
        <div className="subscription-error">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={fetchSubscriptionPlans}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-manager">
      <div className="subscription-header">
        <h2>Subscription Management</h2>
        <p>Current Plan: <span className={`plan-badge ${subscriptionStatus.toLowerCase()}`}>{subscriptionStatus}</span></p>
      </div>

      {subscriptionStatus === 'Premium' ? (
        <div className="premium-features">
          <h3>Your Premium Features</h3>
          <ul className="features-list">
            <li>✅ Advanced Emotion Timeline</li>
            <li>✅ Weekly Emotion Analysis</li>
            <li>✅ AI News Integration</li>
            <li>✅ Advanced Memory Search</li>
            <li>✅ System Metrics</li>
          </ul>
          <p className="thank-you-message">Thank you for supporting Mashaaer!</p>
        </div>
      ) : subscriptionStatus === 'Trial' ? (
        <div className="trial-features">
          <h3>Trial Subscription</h3>
          <div className="trial-info">
            <div className="trial-icon">🎁</div>
            <p className="trial-message">
              You are currently on a free trial. You have access to all premium features for 
              <span className="days-remaining"> {subscriptionDetails?.days_remaining || 0} days</span> remaining.
            </p>
          </div>

          <div className="trial-progress">
            <div className="progress-label">Trial Period:</div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${((7 - (subscriptionDetails?.days_remaining || 0)) / 7) * 100}%` 
                }}
              ></div>
            </div>
            <div className="progress-days">
              <span>0</span>
              <span>7 days</span>
            </div>
          </div>

          <div className="premium-features">
            <h4>Features Included in Your Trial:</h4>
            <ul className="features-list">
              <li>✅ Advanced Emotion Timeline</li>
              <li>✅ Weekly Emotion Analysis</li>
              <li>✅ AI News Integration</li>
              <li>✅ Advanced Memory Search</li>
              <li>✅ System Metrics</li>
            </ul>
          </div>

          <div className="trial-cta">
            <p>Enjoying the premium features? Subscribe now to continue after your trial ends.</p>
            <button 
              className="upgrade-from-trial-button"
              onClick={() => document.getElementById('subscription-plans-section').scrollIntoView({ behavior: 'smooth' })}
            >
              Upgrade to Premium
            </button>
          </div>

          <div id="subscription-plans-section" className="subscription-plans">
            <h3>Available Plans</h3>
            <div className="plans-container">
              {subscriptionPlans.map((plan) => (
                <div className="plan-card" key={plan.id}>
                  <div className="plan-header">
                    <h4>{plan.name}</h4>
                    <div className="plan-price">
                      <span className="price">${plan.price}</span>
                      <span className="interval">/{plan.interval}</span>
                    </div>
                  </div>
                  <p className="plan-description">{plan.description}</p>
                  <button 
                    className="subscribe-button"
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    Subscribe
                  </button>
                </div>
              ))}
            </div>

            <div id="paypal-button-container" className="paypal-container"></div>
          </div>
        </div>
      ) : (
        <div className="subscription-plans">
          <h3>Available Plans</h3>
          <div className="plans-container">
            {subscriptionPlans.map((plan) => (
              <div className="plan-card" key={plan.id}>
                <div className="plan-header">
                  <h4>{plan.name}</h4>
                  <div className="plan-price">
                    <span className="price">${plan.price}</span>
                    <span className="interval">/{plan.interval}</span>
                  </div>
                </div>
                <p className="plan-description">{plan.description}</p>
                <button 
                  className="subscribe-button"
                  onClick={() => handleSubscribe(plan.id)}
                >
                  Subscribe
                </button>
              </div>
            ))}
          </div>

          <div id="paypal-button-container" className="paypal-container"></div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManager;
