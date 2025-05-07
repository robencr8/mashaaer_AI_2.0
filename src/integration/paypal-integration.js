/**
 * Mashaaer Enhanced Project
 * PayPal Integration Module
 * 
 * This module provides integration with PayPal for subscription payments
 * with features like:
 * - Secure payment processing
 * - Subscription management
 * - Payment status tracking
 * - Webhook handling
 */

class PayPalIntegration {
  constructor() {
    this.config = {
      clientId: 'YOUR_PAYPAL_CLIENT_ID', // Replace with actual client ID in production
      currency: 'USD',
      intent: 'subscription',
      sandboxMode: true, // Set to false in production
      webhookUrl: '/api/webhooks/paypal',
      returnUrl: '/settings/subscription/success',
      cancelUrl: '/settings/subscription/cancel'
    };
    
    this.isInitialized = false;
    this.paypalInstance = null;
    this.subscriptionPlans = {
      basic: {
        planId: 'P-BASIC12345',
        name: 'Basic Plan',
        description: 'Access to basic features',
        price: 4.99,
        currency: 'USD',
        interval: 'month'
      },
      premium: {
        planId: 'P-PREMIUM12345',
        name: 'Premium Plan',
        description: 'Access to all premium features',
        price: 9.99,
        currency: 'USD',
        interval: 'month'
      }
    };
  }

  /**
   * Initialize PayPal integration
   * @param {Object} config - Configuration options
   */
  initialize(config = {}) {
    if (this.isInitialized) return this;
    
    // Apply configuration
    this.config = { ...this.config, ...config };
    
    // Load PayPal SDK
    this.loadPayPalSDK()
      .then(() => {
        console.log('PayPal SDK loaded successfully');
        this.isInitialized = true;
        
        // Dispatch initialization event
        document.dispatchEvent(new CustomEvent('paypalInitialized', {
          detail: { success: true }
        }));
      })
      .catch(error => {
        console.error('Failed to load PayPal SDK:', error);
        
        // Dispatch initialization event with error
        document.dispatchEvent(new CustomEvent('paypalInitialized', {
          detail: { success: false, error }
        }));
      });
    
    // Initialize event listeners
    this.initEventListeners();
    
    return this;
  }

  /**
   * Load PayPal SDK
   * @returns {Promise} Promise that resolves when SDK is loaded
   */
  loadPayPalSDK() {
    return new Promise((resolve, reject) => {
      // Check if SDK is already loaded
      if (window.paypal) {
        resolve(window.paypal);
        return;
      }
      
      // Create script element
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${this.config.clientId}&currency=${this.config.currency}&intent=${this.config.intent}`;
      script.async = true;
      
      // Set up event handlers
      script.onload = () => {
        if (window.paypal) {
          this.paypalInstance = window.paypal;
          resolve(window.paypal);
        } else {
          reject(new Error('PayPal SDK loaded but paypal object not found'));
        }
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load PayPal SDK'));
      };
      
      // Add script to document
      document.body.appendChild(script);
    });
  }

  /**
   * Initialize event listeners
   */
  initEventListeners() {
    // Listen for subscription button clicks
    document.addEventListener('subscribeWithPayPal', this.handleSubscribeRequest.bind(this));
    
    // Listen for subscription cancellation
    document.addEventListener('cancelSubscription', this.handleCancellationRequest.bind(this));
    
    // Listen for subscription updates
    document.addEventListener('updateSubscription', this.handleUpdateRequest.bind(this));
  }

  /**
   * Handle subscription request
   * @param {Event} event - Subscribe event
   */
  handleSubscribeRequest(event) {
    const { planId, containerId } = event.detail;
    
    // Validate plan ID
    const plan = this.getPlanById(planId);
    if (!plan) {
      console.error(`Invalid plan ID: ${planId}`);
      this.showError('Invalid subscription plan');
      return;
    }
    
    // Validate container ID
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container not found: ${containerId}`);
      this.showError('Payment container not found');
      return;
    }
    
    // Render PayPal buttons
    this.renderSubscriptionButtons(container, plan);
  }

  /**
   * Handle subscription cancellation request
   * @param {Event} event - Cancellation event
   */
  handleCancellationRequest(event) {
    const { subscriptionId } = event.detail;
    
    // Validate subscription ID
    if (!subscriptionId) {
      console.error('No subscription ID provided');
      this.showError('Subscription ID is required');
      return;
    }
    
    // Show confirmation dialog
    this.showConfirmationDialog(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.',
      () => this.cancelSubscription(subscriptionId)
    );
  }

  /**
   * Handle subscription update request
   * @param {Event} event - Update event
   */
  handleUpdateRequest(event) {
    const { subscriptionId, newPlanId } = event.detail;
    
    // Validate subscription ID
    if (!subscriptionId) {
      console.error('No subscription ID provided');
      this.showError('Subscription ID is required');
      return;
    }
    
    // Validate new plan ID
    const newPlan = this.getPlanById(newPlanId);
    if (!newPlan) {
      console.error(`Invalid plan ID: ${newPlanId}`);
      this.showError('Invalid subscription plan');
      return;
    }
    
    // Show confirmation dialog
    this.showConfirmationDialog(
      'Update Subscription',
      `Are you sure you want to update your subscription to ${newPlan.name}? Your billing will be adjusted accordingly.`,
      () => this.updateSubscription(subscriptionId, newPlanId)
    );
  }

  /**
   * Render PayPal subscription buttons
   * @param {HTMLElement} container - Container element
   * @param {Object} plan - Subscription plan
   */
  renderSubscriptionButtons(container, plan) {
    // Ensure PayPal is initialized
    if (!this.paypalInstance || !this.paypalInstance.Buttons) {
      console.error('PayPal not initialized');
      this.showError('Payment system not ready. Please try again later.');
      return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Create buttons
    this.paypalInstance.Buttons({
      style: {
        shape: 'rect',
        color: 'gold',
        layout: 'vertical',
        label: 'subscribe'
      },
      createSubscription: (data, actions) => {
        return actions.subscription.create({
          plan_id: plan.planId,
          application_context: {
            shipping_preference: 'NO_SHIPPING',
            user_action: 'SUBSCRIBE_NOW',
            return_url: this.config.returnUrl,
            cancel_url: this.config.cancelUrl
          }
        });
      },
      onApprove: (data, actions) => {
        // Handle successful subscription
        this.handleSubscriptionSuccess(data.subscriptionID, plan);
        return actions.redirect();
      },
      onCancel: () => {
        // Handle cancellation
        this.handleSubscriptionCancel();
      },
      onError: (err) => {
        // Handle errors
        console.error('PayPal subscription error:', err);
        this.showError('An error occurred during payment processing. Please try again.');
      }
    }).render(container);
  }

  /**
   * Handle successful subscription
   * @param {string} subscriptionId - PayPal subscription ID
   * @param {Object} plan - Subscription plan
   */
  handleSubscriptionSuccess(subscriptionId, plan) {
    console.log(`Subscription successful: ${subscriptionId} for plan ${plan.name}`);
    
    // Store subscription info
    this.storeSubscriptionInfo(subscriptionId, plan);
    
    // Notify subscription system
    document.dispatchEvent(new CustomEvent('subscriptionCreated', {
      detail: {
        subscriptionId,
        planId: plan.planId,
        planName: plan.name,
        startDate: new Date().toISOString()
      }
    }));
    
    // Show success message
    this.showSuccess(`Successfully subscribed to ${plan.name}!`);
  }

  /**
   * Handle subscription cancellation
   */
  handleSubscriptionCancel() {
    console.log('Subscription process cancelled by user');
    
    // Show message
    this.showMessage('Subscription process cancelled');
  }

  /**
   * Cancel subscription
   * @param {string} subscriptionId - PayPal subscription ID
   */
  cancelSubscription(subscriptionId) {
    console.log(`Cancelling subscription: ${subscriptionId}`);
    
    // In a real implementation, this would call PayPal's API
    // For this implementation, we'll simulate the API call
    
    // Show loading indicator
    this.showLoading('Cancelling subscription...');
    
    // Simulate API call
    setTimeout(() => {
      // Hide loading indicator
      this.hideLoading();
      
      // Notify subscription system
      document.dispatchEvent(new CustomEvent('subscriptionCancelled', {
        detail: {
          subscriptionId,
          cancellationDate: new Date().toISOString()
        }
      }));
      
      // Show success message
      this.showSuccess('Your subscription has been cancelled. You will have access until the end of your billing period.');
    }, 1500);
  }

  /**
   * Update subscription
   * @param {string} subscriptionId - PayPal subscription ID
   * @param {string} newPlanId - New plan ID
   */
  updateSubscription(subscriptionId, newPlanId) {
    console.log(`Updating subscription: ${subscriptionId} to plan ${newPlanId}`);
    
    // Get new plan
    const newPlan = this.getPlanById(newPlanId);
    if (!newPlan) {
      console.error(`Invalid plan ID: ${newPlanId}`);
      this.showError('Invalid subscription plan');
      return;
    }
    
    // In a real implementation, this would call PayPal's API
    // For this implementation, we'll simulate the API call
    
    // Show loading indicator
    this.showLoading('Updating subscription...');
    
    // Simulate API call
    setTimeout(() => {
      // Hide loading indicator
      this.hideLoading();
      
      // Store updated subscription info
      this.storeSubscriptionInfo(subscriptionId, newPlan);
      
      // Notify subscription system
      document.dispatchEvent(new CustomEvent('subscriptionUpdated', {
        detail: {
          subscriptionId,
          planId: newPlanId,
          planName: newPlan.name,
          updateDate: new Date().toISOString()
        }
      }));
      
      // Show success message
      this.showSuccess(`Your subscription has been updated to ${newPlan.name}.`);
    }, 1500);
  }

  /**
   * Store subscription information
   * @param {string} subscriptionId - PayPal subscription ID
   * @param {Object} plan - Subscription plan
   */
  storeSubscriptionInfo(subscriptionId, plan) {
    // Store in localStorage
    const subscriptionInfo = {
      id: subscriptionId,
      planId: plan.planId,
      planName: plan.name,
      price: plan.price,
      currency: plan.currency,
      interval: plan.interval,
      startDate: new Date().toISOString(),
      status: 'active'
    };
    
    localStorage.setItem('paypal_subscription', JSON.stringify(subscriptionInfo));
    
    // Store in memory.db if available
    if (window.memoryDB) {
      window.memoryDB.set('paypal_subscription', subscriptionInfo);
    }
  }

  /**
   * Get subscription information
   * @returns {Object|null} Subscription information or null if not found
   */
  getSubscriptionInfo() {
    // Try to get from memory.db first
    if (window.memoryDB) {
      const info = window.memoryDB.get('paypal_subscription');
      if (info) return info;
    }
    
    // Otherwise try localStorage
    const storedInfo = localStorage.getItem('paypal_subscription');
    if (storedInfo) {
      try {
        return JSON.parse(storedInfo);
      } catch (e) {
        console.error('Error parsing subscription info:', e);
        return null;
      }
    }
    
    return null;
  }

  /**
   * Get subscription plan by ID
   * @param {string} planId - Plan ID
   * @returns {Object|null} Plan object or null if not found
   */
  getPlanById(planId) {
    // Check if plan ID is a key in subscriptionPlans
    if (this.subscriptionPlans[planId]) {
      return this.subscriptionPlans[planId];
    }
    
    // Otherwise check if plan ID matches any plan's planId
    for (const key in this.subscriptionPlans) {
      if (this.subscriptionPlans[key].planId === planId) {
        return this.subscriptionPlans[key];
      }
    }
    
    return null;
  }

  /**
   * Get all subscription plans
   * @returns {Object} Subscription plans
   */
  getSubscriptionPlans() {
    return this.subscriptionPlans;
  }

  /**
   * Set subscription plans
   * @param {Object} plans - Subscription plans
   */
  setSubscriptionPlans(plans) {
    this.subscriptionPlans = plans;
  }

  /**
   * Show loading indicator
   * @param {string} message - Loading message
   */
  showLoading(message = 'Loading...') {
    // Remove existing loading indicator
    this.hideLoading();
    
    // Create loading indicator
    const loadingElement = document.createElement('div');
    loadingElement.className = 'paypal-loading-indicator';
    loadingElement.innerHTML = `
      <div class="loading-spinner"></div>
      <div class="loading-message">${message}</div>
    `;
    
    // Add to document
    document.body.appendChild(loadingElement);
  }

  /**
   * Hide loading indicator
   */
  hideLoading() {
    const loadingElement = document.querySelector('.paypal-loading-indicator');
    if (loadingElement) {
      loadingElement.remove();
    }
  }

  /**
   * Show error message
   * @param {string} message - Error message
   */
  showError(message) {
    this.showNotification(message, 'error');
  }

  /**
   * Show success message
   * @param {string} message - Success message
   */
  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  /**
   * Show information message
   * @param {string} message - Information message
   */
  showMessage(message) {
    this.showNotification(message, 'info');
  }

  /**
   * Show notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type ('error', 'success', 'info')
   */
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `paypal-notification ${type}`;
    notification.innerHTML = `
      <div class="notification-icon ${type}"></div>
      <div class="notification-message">${message}</div>
      <button class="notification-close">×</button>
    `;
    
    // Add close button event listener
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.classList.remove('visible');
      setTimeout(() => {
        notification.remove();
      }, 300);
    });
    
    // Add to document
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
      notification.classList.add('visible');
    }, 10);
    
    // Auto-hide after delay
    setTimeout(() => {
      if (notification.parentNode) {
        notification.classList.remove('visible');
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 300);
      }
    }, 5000);
  }

  /**
   * Show confirmation dialog
   * @param {string} title - Dialog title
   * @param {string} message - Dialog message
   * @param {Function} onConfirm - Confirmation callback
   */
  showConfirmationDialog(title, message, onConfirm) {
    // Create dialog element
    const dialog = document.createElement('div');
    dialog.className = 'paypal-confirmation-dialog';
    dialog.innerHTML = `
      <div class="dialog-content">
        <h3 class="dialog-title">${title}</h3>
        <p class="dialog-message">${message}</p>
        <div class="dialog-actions">
          <button class="dialog-cancel-btn">Cancel</button>
          <button class="dialog-confirm-btn">Confirm</button>
        </div>
      </div>
    `;
    
    // Add event listeners
    dialog.querySelector('.dialog-cancel-btn').addEventListener('click', () => {
      dialog.classList.remove('visible');
      setTimeout(() => {
        dialog.remove();
      }, 300);
    });
    
    dialog.querySelector('.dialog-confirm-btn').addEventListener('click', () => {
      dialog.classList.remove('visible');
      setTimeout(() => {
        dialog.remove();
        onConfirm();
      }, 300);
    });
    
    // Add to document
    document.body.appendChild(dialog);
    
    // Show with animation
    setTimeout(() => {
      dialog.classList.add('visible');
    }, 10);
  }

  /**
   * Clean up and release resources
   */
  destroy() {
    console.log('Cleaning up PayPal Integration...');
    
    // Remove event listeners
    document.removeEventListener('subscribeWithPayPal', this.handleSubscribeRequest);
    document.removeEventListener('cancelSubscription', this.handleCancellationRequest);
    document.removeEventListener('updateSubscription', this.handleUpdateRequest);
    
    // Remove UI elements
    const notifications = document.querySelectorAll('.paypal-notification');
    notifications.forEach(notification => {
      notification.remove();
    });
    
    const dialogs = document.querySelectorAll('.paypal-confirmation-dialog');
    dialogs.forEach(dialog => {
      dialog.remove();
    });
    
    const loadingIndicators = document.querySelectorAll('.paypal-loading-indicator');
    loadingIndicators.forEach(indicator => {
      indicator.remove();
    });
    
    this.isInitialized = false;
    console.log('PayPal Integration cleaned up');
  }
}

// Export the PayPal integration module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PayPalIntegration };
} else {
  window.paypalIntegration = new PayPalIntegration();
}
