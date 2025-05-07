/**
 * Authentication Service
 * 
 * This service provides authentication functionality for the application.
 * It implements JWT-based authentication and manages user sessions.
 * It also enforces usage limits based on subscription plans.
 */

export class AuthService {
  constructor() {
    this.isInitialized = false;
    this.configService = null;
    this.loggingService = null;
    this.errorService = null;
    this.currentUser = null;
    this.token = null;
    this.usageStats = {
      requestsToday: 0,
      sessionStartTime: null,
      storedConversations: 0
    };
    this.storageKeys = {
      token: 'mashaaer-auth-token',
      user: 'mashaaer-user',
      usageStats: 'mashaaer-usage-stats'
    };
  }

  /**
   * Initialize the authentication service
   * @param {Object} configService - The config service
   * @param {Object} loggingService - The logging service
   * @param {Object} errorService - The error service
   * @returns {AuthService} - This instance for chaining
   */
  initialize(configService, loggingService, errorService) {
    if (this.isInitialized) {
      if (loggingService) {
        loggingService.warn('Auth Service is already initialized');
      }
      return this;
    }

    this.configService = configService;
    this.loggingService = loggingService;
    this.errorService = errorService;

    // Load user data from storage
    this.loadUserFromStorage();
    this.loadUsageStatsFromStorage();

    // Reset usage stats at midnight
    this.setupDailyReset();

    // Start session timer
    this.startSessionTimer();

    this.isInitialized = true;
    if (loggingService) {
      loggingService.logServiceInit('Auth Service');
    }

    return this;
  }

  /**
   * Load user data from storage
   * @private
   */
  loadUserFromStorage() {
    try {
      const tokenStr = localStorage.getItem(this.storageKeys.token);
      const userStr = localStorage.getItem(this.storageKeys.user);
      
      if (tokenStr && userStr) {
        this.token = tokenStr;
        this.currentUser = JSON.parse(userStr);
        
        // Verify token expiration
        if (this.isTokenExpired()) {
          this.logout();
        }
      }
    } catch (error) {
      if (this.loggingService) {
        this.loggingService.error('Error loading user from storage', error);
      }
    }
  }

  /**
   * Load usage stats from storage
   * @private
   */
  loadUsageStatsFromStorage() {
    try {
      const statsStr = localStorage.getItem(this.storageKeys.usageStats);
      
      if (statsStr) {
        const stats = JSON.parse(statsStr);
        
        // Only load today's stats
        const today = new Date().toDateString();
        if (stats.date === today) {
          this.usageStats = {
            ...this.usageStats,
            ...stats
          };
        } else {
          // Reset stats if from a different day
          this.usageStats.requestsToday = 0;
          this.saveUsageStatsToStorage();
        }
      }
    } catch (error) {
      if (this.loggingService) {
        this.loggingService.error('Error loading usage stats from storage', error);
      }
    }
  }

  /**
   * Save usage stats to storage
   * @private
   */
  saveUsageStatsToStorage() {
    try {
      const stats = {
        ...this.usageStats,
        date: new Date().toDateString()
      };
      
      localStorage.setItem(this.storageKeys.usageStats, JSON.stringify(stats));
    } catch (error) {
      if (this.loggingService) {
        this.loggingService.error('Error saving usage stats to storage', error);
      }
    }
  }

  /**
   * Setup daily reset of usage stats
   * @private
   */
  setupDailyReset() {
    // Calculate time until midnight
    const now = new Date();
    const night = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1, // tomorrow
      0, 0, 0 // midnight
    );
    const msUntilMidnight = night.getTime() - now.getTime();

    // Set timeout to reset stats at midnight
    setTimeout(() => {
      this.usageStats.requestsToday = 0;
      this.saveUsageStatsToStorage();
      
      // Setup for next day
      this.setupDailyReset();
      
      if (this.loggingService) {
        this.loggingService.info('Daily usage stats reset');
      }
    }, msUntilMidnight);
  }

  /**
   * Start session timer
   * @private
   */
  startSessionTimer() {
    this.usageStats.sessionStartTime = new Date();
  }

  /**
   * Register a new user
   * @param {string} username - Username
   * @param {string} password - Password
   * @param {string} email - Email address
   * @returns {Promise<Object>} - User object
   */
  async register(username, password, email) {
    try {
      // In a real implementation, this would make an API call to register the user
      // For now, we'll simulate a successful registration
      
      const user = {
        id: 'user_' + Date.now(),
        username,
        email,
        subscriptionPlan: 'free',
        createdAt: new Date().toISOString()
      };
      
      // Generate a token
      const token = this.generateToken(user);
      
      // Save user and token
      this.currentUser = user;
      this.token = token;
      
      localStorage.setItem(this.storageKeys.user, JSON.stringify(user));
      localStorage.setItem(this.storageKeys.token, token);
      
      // Reset usage stats
      this.usageStats = {
        requestsToday: 0,
        sessionStartTime: new Date(),
        storedConversations: 0
      };
      this.saveUsageStatsToStorage();
      
      if (this.loggingService) {
        this.loggingService.info('User registered', { username });
      }
      
      return user;
    } catch (error) {
      if (this.errorService) {
        throw this.errorService.createAuthenticationError('Registration failed', { error });
      }
      throw error;
    }
  }

  /**
   * Login a user
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Promise<Object>} - User object
   */
  async login(username, password) {
    try {
      // In a real implementation, this would make an API call to authenticate the user
      // For now, we'll simulate a successful login
      
      const user = {
        id: 'user_' + Date.now(),
        username,
        subscriptionPlan: 'free',
        createdAt: new Date().toISOString()
      };
      
      // Generate a token
      const token = this.generateToken(user);
      
      // Save user and token
      this.currentUser = user;
      this.token = token;
      
      localStorage.setItem(this.storageKeys.user, JSON.stringify(user));
      localStorage.setItem(this.storageKeys.token, token);
      
      // Start session
      this.startSessionTimer();
      
      if (this.loggingService) {
        this.loggingService.info('User logged in', { username });
      }
      
      return user;
    } catch (error) {
      if (this.errorService) {
        throw this.errorService.createAuthenticationError('Login failed', { error });
      }
      throw error;
    }
  }

  /**
   * Logout the current user
   */
  logout() {
    this.currentUser = null;
    this.token = null;
    
    localStorage.removeItem(this.storageKeys.token);
    localStorage.removeItem(this.storageKeys.user);
    
    if (this.loggingService) {
      this.loggingService.info('User logged out');
    }
  }

  /**
   * Check if a user is logged in
   * @returns {boolean} - True if a user is logged in
   */
  isLoggedIn() {
    return !!this.currentUser && !!this.token && !this.isTokenExpired();
  }

  /**
   * Get the current user
   * @returns {Object|null} - Current user or null if not logged in
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Get the current user's subscription plan
   * @returns {string} - Subscription plan ID
   */
  getCurrentSubscriptionPlan() {
    return this.currentUser?.subscriptionPlan || 'free';
  }

  /**
   * Update the current user's subscription plan
   * @param {string} planId - Subscription plan ID
   */
  updateSubscriptionPlan(planId) {
    if (!this.currentUser) {
      if (this.loggingService) {
        this.loggingService.warn('Cannot update subscription plan: No user logged in');
      }
      return;
    }
    
    this.currentUser.subscriptionPlan = planId;
    localStorage.setItem(this.storageKeys.user, JSON.stringify(this.currentUser));
    
    // Dispatch event for other components to update
    const event = new CustomEvent('subscriptionChanged', {
      detail: { level: planId }
    });
    document.dispatchEvent(event);
    
    if (this.loggingService) {
      this.loggingService.info('Subscription plan updated', { planId });
    }
  }

  /**
   * Check if the current token is expired
   * @returns {boolean} - True if token is expired
   * @private
   */
  isTokenExpired() {
    if (!this.token) return true;
    
    try {
      // In a real JWT implementation, we would decode the token and check its expiration
      // For this simple implementation, we'll assume tokens are valid for 24 hours
      const tokenData = this.parseToken(this.token);
      return tokenData.exp < Date.now();
    } catch (error) {
      return true;
    }
  }

  /**
   * Generate a token for a user
   * @param {Object} user - User object
   * @returns {string} - JWT token
   * @private
   */
  generateToken(user) {
    // In a real implementation, this would generate a proper JWT
    // For now, we'll create a simple token with expiration
    const tokenData = {
      sub: user.id,
      username: user.username,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    
    return btoa(JSON.stringify(tokenData));
  }

  /**
   * Parse a token
   * @param {string} token - Token to parse
   * @returns {Object} - Token data
   * @private
   */
  parseToken(token) {
    try {
      return JSON.parse(atob(token));
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Track API request usage
   * @returns {boolean} - True if request is allowed, false if limit reached
   */
  trackApiRequest() {
    // Increment request count
    this.usageStats.requestsToday++;
    this.saveUsageStatsToStorage();
    
    // Check if user has reached their limit
    const allowed = this.checkRequestLimit();
    
    if (!allowed && this.loggingService) {
      this.loggingService.warn('API request limit reached', {
        user: this.currentUser?.username,
        plan: this.getCurrentSubscriptionPlan(),
        requestsToday: this.usageStats.requestsToday
      });
    }
    
    return allowed;
  }

  /**
   * Check if the user has reached their request limit
   * @returns {boolean} - True if under limit, false if limit reached
   */
  checkRequestLimit() {
    const plan = this.getCurrentSubscriptionPlan();
    const limits = this.getSubscriptionLimits(plan);
    
    // -1 means unlimited
    if (limits.requestsPerDay === -1) return true;
    
    return this.usageStats.requestsToday <= limits.requestsPerDay;
  }

  /**
   * Check if the user has reached their session time limit
   * @returns {boolean} - True if under limit, false if limit reached
   */
  checkSessionTimeLimit() {
    const plan = this.getCurrentSubscriptionPlan();
    const limits = this.getSubscriptionLimits(plan);
    
    // -1 means unlimited
    if (limits.sessionDurationMinutes === -1) return true;
    
    if (!this.usageStats.sessionStartTime) return true;
    
    const sessionDuration = (new Date() - this.usageStats.sessionStartTime) / (1000 * 60); // in minutes
    return sessionDuration <= limits.sessionDurationMinutes;
  }

  /**
   * Get subscription limits for a plan
   * @param {string} planId - Subscription plan ID
   * @returns {Object} - Limits object
   */
  getSubscriptionLimits(planId) {
    const plans = this.configService.get('subscription.plans', []);
    const plan = plans.find(p => p.id === planId) || plans[0]; // Default to first plan if not found
    
    return plan.limits || {
      requestsPerDay: 50,
      sessionDurationMinutes: 15,
      maxStoredConversations: 5
    };
  }

  /**
   * Track stored conversation
   * @returns {boolean} - True if storage is allowed, false if limit reached
   */
  trackStoredConversation() {
    this.usageStats.storedConversations++;
    this.saveUsageStatsToStorage();
    
    // Check if user has reached their limit
    const allowed = this.checkStorageLimit();
    
    if (!allowed && this.loggingService) {
      this.loggingService.warn('Conversation storage limit reached', {
        user: this.currentUser?.username,
        plan: this.getCurrentSubscriptionPlan(),
        storedConversations: this.usageStats.storedConversations
      });
    }
    
    return allowed;
  }

  /**
   * Check if the user has reached their storage limit
   * @returns {boolean} - True if under limit, false if limit reached
   */
  checkStorageLimit() {
    const plan = this.getCurrentSubscriptionPlan();
    const limits = this.getSubscriptionLimits(plan);
    
    return this.usageStats.storedConversations <= limits.maxStoredConversations;
  }

  /**
   * Get the remaining requests for today
   * @returns {number} - Remaining requests
   */
  getRemainingRequests() {
    const plan = this.getCurrentSubscriptionPlan();
    const limits = this.getSubscriptionLimits(plan);
    
    if (limits.requestsPerDay === -1) return -1; // unlimited
    
    return Math.max(0, limits.requestsPerDay - this.usageStats.requestsToday);
  }

  /**
   * Get the remaining session time
   * @returns {number} - Remaining minutes
   */
  getRemainingSessionTime() {
    const plan = this.getCurrentSubscriptionPlan();
    const limits = this.getSubscriptionLimits(plan);
    
    if (limits.sessionDurationMinutes === -1) return -1; // unlimited
    
    if (!this.usageStats.sessionStartTime) return limits.sessionDurationMinutes;
    
    const sessionDuration = (new Date() - this.usageStats.sessionStartTime) / (1000 * 60); // in minutes
    return Math.max(0, limits.sessionDurationMinutes - sessionDuration);
  }
}

// Export a singleton instance
export const authService = new AuthService();

// Export default for dependency injection
export default AuthService;