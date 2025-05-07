/**
 * System Bootstrap Service
 * 
 * This service is responsible for bootstrapping the entire system, including both
 * frontend and backend components. It provides a centralized way to initialize
 * all services and ensure they're properly connected.
 */

import { ConfigService } from '../config/config-service.js';
import { LoggingService } from '../logging/logging-service.js';
import { ErrorService } from '../error/error-service.js';
import { StateManagementService } from '../state/state-management-service.js';
import { ApiService } from '../api/api-service.js';
import { MemoryService } from '../memory/memory-service.js';
import { EmotionService } from '../emotion/emotion-service.js';
import { ThemeService } from '../theme/theme-service.js';
import { VoiceService } from '../voice/voice-service.js';
import { AssistantService } from '../assistant/assistant-service.js';
import { AlphaService } from '../alpha/alpha-service.js';
import { AuthService } from '../auth/auth-service.js';
import { AnalyticsService } from '../analytics/analytics-service.js';

/**
 * SystemBootstrapService class
 * Responsible for bootstrapping the entire system
 */
export class SystemBootstrapService {
  constructor() {
    this.services = {};
    this.isInitialized = false;
    this.initializationStatus = {
      config: false,
      logging: false,
      error: false,
      stateManagement: false,
      api: false,
      memory: false,
      emotion: false,
      theme: false,
      voice: false,
      assistant: false,
      alpha: false,
      auth: false,
      analytics: false,
      backend: false
    };
  }

  /**
   * Initialize the system bootstrap service
   * @param {Object} config - Configuration object
   * @returns {Promise<Object>} - Object containing all initialized services
   */
  async initialize(config = {}) {
    if (this.isInitialized) {
      console.warn('System Bootstrap Service is already initialized');
      return this.services;
    }

    try {
      // Check backend connectivity
      await this.checkBackendConnectivity();
      this.initializationStatus.backend = true;

      // Initialize all frontend services
      const services = await this.initializeFrontendServices(config);
      this.services = services;
      this.isInitialized = true;

      return services;
    } catch (error) {
      console.error('Error initializing System Bootstrap Service:', error);
      throw error;
    }
  }

  /**
   * Check backend connectivity with retries
   * @param {number} maxRetries - Maximum number of retry attempts
   * @param {number} retryDelay - Delay between retries in milliseconds
   * @returns {Promise<boolean>} - True if backend is connected, false otherwise
   */
  async checkBackendConnectivity(maxRetries = 3, retryDelay = 2000) {
    let retries = 0;
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

    while (retries <= maxRetries) {
      try {
        console.log(`Attempting to connect to backend at ${backendUrl} (Attempt ${retries + 1}/${maxRetries + 1})...`);
        const response = await fetch(`${backendUrl}/api/metrics`);

        if (response.ok) {
          console.log('✅ Backend connectivity check successful');
          return true;
        }

        throw new Error(`Backend connectivity check failed: ${response.status} ${response.statusText}`);
      } catch (error) {
        retries++;

        if (retries <= maxRetries) {
          console.warn(`Backend connectivity check failed (Attempt ${retries}/${maxRetries + 1}):`, error);
          console.log(`Retrying in ${retryDelay/1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        } else {
          console.warn('⚠️ All backend connectivity attempts failed:', error);
          console.warn('Continuing with frontend initialization in offline mode. Voice and advanced features may be limited.');

          // Check if we're in development mode
          if (process.env.NODE_ENV === 'development' || process.env.REACT_APP_OFFLINE_MODE === 'true') {
            console.log('Development mode detected - enabling offline fallbacks for better development experience');
          }

          return false;
        }
      }
    }

    return false;
  }

  /**
   * Initialize all frontend services
   * @param {Object} config - Configuration object
   * @returns {Promise<Object>} - Object containing all initialized services
   */
  async initializeFrontendServices(config = {}) {
    // Initialize config service first
    const configService = new ConfigService();
    await configService.initialize(config.config || {});
    this.initializationStatus.config = true;

    // Initialize logging service (depends on config)
    const loggingService = new LoggingService();
    loggingService.initialize(configService);
    this.initializationStatus.logging = true;

    // Initialize error service (depends on config and logging)
    const errorService = new ErrorService();
    errorService.initialize(configService, loggingService);
    this.initializationStatus.error = true;

    // Initialize state management service (depends on config, logging, and error)
    const stateManagementService = new StateManagementService();
    stateManagementService.initialize(configService, loggingService, errorService);
    this.initializationStatus.stateManagement = true;

    // Initialize API service
    const apiService = new ApiService();
    apiService.initialize(configService);
    loggingService.logServiceInit('API Service');
    this.initializationStatus.api = true;

    // Initialize memory service
    const memoryService = new MemoryService();
    memoryService.initialize(configService);
    loggingService.logServiceInit('Memory Service');
    this.initializationStatus.memory = true;

    // Initialize emotion service
    const emotionService = new EmotionService();
    emotionService.initialize(configService, memoryService);
    loggingService.logServiceInit('Emotion Service');
    this.initializationStatus.emotion = true;

    // Initialize theme service
    const themeService = new ThemeService();
    themeService.initialize(configService, emotionService);
    loggingService.logServiceInit('Theme Service');
    this.initializationStatus.theme = true;

    // Initialize voice service
    const voiceService = new VoiceService();
    voiceService.initialize(configService, emotionService);
    loggingService.logServiceInit('Voice Service');
    this.initializationStatus.voice = true;

    // Initialize assistant service (depends on all other services)
    const assistantService = new AssistantService();
    assistantService.initialize(
      configService,
      apiService,
      emotionService,
      memoryService,
      voiceService,
      themeService
    );
    loggingService.logServiceInit('Assistant Service');
    this.initializationStatus.assistant = true;

    // Initialize alpha service
    const alphaService = new AlphaService();
    alphaService.initialize(configService, loggingService);
    loggingService.logServiceInit('Alpha Service');
    this.initializationStatus.alpha = true;

    // Initialize auth service
    const authService = new AuthService();
    authService.initialize(configService, loggingService, errorService);
    loggingService.logServiceInit('Auth Service');
    this.initializationStatus.auth = true;

    // Initialize analytics service
    const analyticsService = new AnalyticsService();
    analyticsService.initialize(configService, loggingService);
    loggingService.logServiceInit('Analytics Service');
    this.initializationStatus.analytics = true;

    // Return all services
    return {
      configService,
      loggingService,
      errorService,
      stateManagementService,
      apiService,
      memoryService,
      emotionService,
      themeService,
      voiceService,
      assistantService,
      alphaService,
      authService,
      analyticsService,
      bootstrapService: this
    };
  }

  /**
   * Get the initialization status of all services
   * @returns {Object} - Object containing the initialization status of all services
   */
  getInitializationStatus() {
    return { ...this.initializationStatus };
  }

  /**
   * Check if all services are initialized
   * @returns {boolean} - True if all services are initialized, false otherwise
   */
  isFullyInitialized() {
    return Object.values(this.initializationStatus).every(status => status === true);
  }

  /**
   * Get a report of the system status
   * @returns {Object} - Object containing system status information
   */
  getSystemStatusReport() {
    const status = this.getInitializationStatus();
    const fullyInitialized = this.isFullyInitialized();

    return {
      timestamp: new Date().toISOString(),
      fullyInitialized,
      servicesStatus: status,
      servicesCount: {
        total: Object.keys(status).length,
        initialized: Object.values(status).filter(s => s === true).length,
        failed: Object.values(status).filter(s => s === false).length
      }
    };
  }
}

// Export a singleton instance
export const systemBootstrapService = new SystemBootstrapService();

// Export default for dependency injection
export default SystemBootstrapService;
