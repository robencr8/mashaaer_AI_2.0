/**
 * Analytics Service
 * 
 * This service provides analytics tracking functionality for the application.
 * It integrates with Google Analytics and works with the LoggingService to track
 * user interactions, performance metrics, and errors.
 */

export class AnalyticsService {
  constructor() {
    this.isInitialized = false;
    this.configService = null;
    this.loggingService = null;
    this.gaInitialized = false;
    this.sessionLogs = [];
    this.sessionStartTime = null;
    this.storageKey = 'mashaaer-session-logs';
  }

  /**
   * Initialize the analytics service
   * @param {Object} configService - The config service
   * @param {Object} loggingService - The logging service
   * @returns {AnalyticsService} - This instance for chaining
   */
  initialize(configService, loggingService) {
    if (this.isInitialized) {
      if (loggingService) {
        loggingService.warn('Analytics Service is already initialized');
      }
      return this;
    }

    this.configService = configService;
    this.loggingService = loggingService;

    // Initialize Google Analytics
    this.initializeGoogleAnalytics();

    // Start session tracking
    this.startSession();

    // Load existing session logs
    this.loadSessionLogs();

    this.isInitialized = true;
    if (loggingService) {
      loggingService.logServiceInit('Analytics Service');
    }

    return this;
  }

  /**
   * Initialize Google Analytics
   * @private
   */
  initializeGoogleAnalytics() {
    const gaId = this.configService.get('analytics.googleAnalyticsId', '');
    
    if (!gaId) {
      if (this.loggingService) {
        this.loggingService.warn('Google Analytics ID not found in configuration');
      }
      return;
    }

    try {
      // Add Google Analytics script to the page
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);

      // Initialize Google Analytics
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', gaId);

      this.gaInitialized = true;
      
      if (this.loggingService) {
        this.loggingService.info('Google Analytics initialized', { gaId });
      }
    } catch (error) {
      if (this.loggingService) {
        this.loggingService.error('Error initializing Google Analytics', error);
      }
    }
  }

  /**
   * Start a new session
   * @private
   */
  startSession() {
    this.sessionStartTime = new Date();
    this.sessionId = `session_${Date.now()}`;
    
    // Track session start
    this.trackEvent('session', 'start', {
      sessionId: this.sessionId,
      startTime: this.sessionStartTime.toISOString()
    });
    
    // Set up session end tracking
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });
  }

  /**
   * End the current session
   * @private
   */
  endSession() {
    if (!this.sessionStartTime) return;
    
    const sessionDuration = (new Date() - this.sessionStartTime) / 1000; // in seconds
    
    // Track session end
    this.trackEvent('session', 'end', {
      sessionId: this.sessionId,
      duration: sessionDuration
    });
    
    // Save session logs
    this.saveSessionLogs();
  }

  /**
   * Load session logs from storage
   * @private
   */
  loadSessionLogs() {
    try {
      const logsStr = localStorage.getItem(this.storageKey);
      if (logsStr) {
        this.sessionLogs = JSON.parse(logsStr);
      }
    } catch (error) {
      if (this.loggingService) {
        this.loggingService.error('Error loading session logs', error);
      }
    }
  }

  /**
   * Save session logs to storage
   * @private
   */
  saveSessionLogs() {
    try {
      // Limit the number of stored logs to prevent localStorage from getting too large
      const maxLogs = 100;
      if (this.sessionLogs.length > maxLogs) {
        this.sessionLogs = this.sessionLogs.slice(-maxLogs);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(this.sessionLogs));
    } catch (error) {
      if (this.loggingService) {
        this.loggingService.error('Error saving session logs', error);
      }
    }
  }

  /**
   * Track a page view
   * @param {string} pagePath - The path of the page
   * @param {string} pageTitle - The title of the page
   */
  trackPageView(pagePath, pageTitle) {
    if (!this.isInitialized) return;
    
    // Track in Google Analytics
    if (this.gaInitialized && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: pagePath,
        page_title: pageTitle
      });
    }
    
    // Log the page view
    if (this.loggingService) {
      this.loggingService.info('Page view', { pagePath, pageTitle });
    }
    
    // Add to session logs
    this.addToSessionLogs('page_view', {
      pagePath,
      pageTitle,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track an event
   * @param {string} category - Event category
   * @param {string} action - Event action
   * @param {Object} params - Additional parameters
   */
  trackEvent(category, action, params = {}) {
    if (!this.isInitialized) return;
    
    // Track in Google Analytics
    if (this.gaInitialized && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        ...params
      });
    }
    
    // Log the event
    if (this.loggingService) {
      this.loggingService.info(`Event: ${category} - ${action}`, params);
    }
    
    // Add to session logs
    this.addToSessionLogs('event', {
      category,
      action,
      params,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track an error
   * @param {string} errorType - Type of error
   * @param {string} errorMessage - Error message
   * @param {Object} errorDetails - Additional error details
   */
  trackError(errorType, errorMessage, errorDetails = {}) {
    if (!this.isInitialized) return;
    
    // Track in Google Analytics
    if (this.gaInitialized && window.gtag) {
      window.gtag('event', 'exception', {
        description: `${errorType}: ${errorMessage}`,
        fatal: errorDetails.fatal || false
      });
    }
    
    // Log the error
    if (this.loggingService) {
      this.loggingService.error(`${errorType}: ${errorMessage}`, errorDetails);
    }
    
    // Add to session logs
    this.addToSessionLogs('error', {
      type: errorType,
      message: errorMessage,
      details: errorDetails,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track user feedback
   * @param {string} feedbackType - Type of feedback (positive, negative, suggestion)
   * @param {string} feedbackText - Feedback text
   * @param {Object} additionalData - Additional feedback data
   */
  trackFeedback(feedbackType, feedbackText, additionalData = {}) {
    if (!this.isInitialized) return;
    
    // Track in Google Analytics
    if (this.gaInitialized && window.gtag) {
      window.gtag('event', 'feedback', {
        event_category: 'feedback',
        event_label: feedbackType,
        feedback_text: feedbackText
      });
    }
    
    // Log the feedback
    if (this.loggingService) {
      this.loggingService.info(`Feedback: ${feedbackType}`, {
        text: feedbackText,
        ...additionalData
      });
    }
    
    // Add to session logs
    this.addToSessionLogs('feedback', {
      type: feedbackType,
      text: feedbackText,
      additionalData,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track system metrics
   * @param {Object} metrics - System metrics object
   */
  trackSystemMetrics(metrics) {
    if (!this.isInitialized) return;
    
    // Track in Google Analytics
    if (this.gaInitialized && window.gtag) {
      window.gtag('event', 'system_metrics', {
        event_category: 'performance',
        ...metrics
      });
    }
    
    // Log the metrics
    if (this.loggingService) {
      this.loggingService.info('System metrics', metrics);
    }
    
    // Add to session logs
    this.addToSessionLogs('system_metrics', {
      metrics,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Add an entry to session logs
   * @param {string} type - Log entry type
   * @param {Object} data - Log entry data
   * @private
   */
  addToSessionLogs(type, data) {
    this.sessionLogs.push({
      type,
      data,
      sessionId: this.sessionId
    });
    
    // Save logs periodically to prevent data loss
    if (this.sessionLogs.length % 10 === 0) {
      this.saveSessionLogs();
    }
  }

  /**
   * Get all session logs
   * @returns {Array} - Array of session logs
   */
  getSessionLogs() {
    return [...this.sessionLogs];
  }

  /**
   * Clear all session logs
   */
  clearSessionLogs() {
    this.sessionLogs = [];
    localStorage.removeItem(this.storageKey);
    
    if (this.loggingService) {
      this.loggingService.info('Session logs cleared');
    }
  }

  /**
   * Get session logs for the current session
   * @returns {Array} - Array of session logs for the current session
   */
  getCurrentSessionLogs() {
    return this.sessionLogs.filter(log => log.sessionId === this.sessionId);
  }

  /**
   * Export session logs to JSON
   * @returns {string} - JSON string of session logs
   */
  exportSessionLogs() {
    return JSON.stringify(this.sessionLogs);
  }
}

// Export a singleton instance
export const analyticsService = new AnalyticsService();

// Export default for dependency injection
export default AnalyticsService;