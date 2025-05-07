/**
 * Alpha Service
 * 
 * This service manages alpha features for internal testing.
 * It provides methods to check if alpha testing is enabled,
 * check if specific alpha features are enabled, and get information
 * about alpha features.
 */

export class AlphaService {
  constructor() {
    this.isInitialized = false;
    this.alphaEnabled = false;
    this.alphaFeatures = [];
    this.feedbackEnabled = false;
    this.telemetryEnabled = false;
    this.expirationDate = null;
  }

  /**
   * Initialize the alpha service
   * @param {Object} configService - The config service
   * @param {Object} loggingService - The logging service (optional)
   */
  initialize(configService, loggingService = null) {
    if (this.isInitialized) {
      if (loggingService) {
        loggingService.warn('Alpha Service is already initialized');
      }
      return;
    }

    try {
      // Get alpha configuration from config service
      const alphaConfig = configService.get('alpha', {});
      
      // Set alpha properties
      this.alphaEnabled = alphaConfig.enabled || false;
      this.alphaFeatures = alphaConfig.features || [];
      this.feedbackEnabled = alphaConfig.feedbackEnabled || false;
      this.telemetryEnabled = alphaConfig.telemetryEnabled || false;
      
      // Parse expiration date if provided
      if (alphaConfig.expirationDate) {
        this.expirationDate = new Date(alphaConfig.expirationDate);
      }

      // Check if alpha testing has expired
      if (this.expirationDate && new Date() > this.expirationDate) {
        this.alphaEnabled = false;
        if (loggingService) {
          loggingService.warn('Alpha testing has expired');
        }
      }

      this.isInitialized = true;
      
      if (loggingService) {
        loggingService.info('Alpha Service initialized', {
          alphaEnabled: this.alphaEnabled,
          featuresCount: this.alphaFeatures.length,
          expirationDate: this.expirationDate ? this.expirationDate.toISOString() : 'none'
        });
      }
    } catch (error) {
      if (loggingService) {
        loggingService.error('Error initializing Alpha Service', error);
      }
      throw error;
    }
  }

  /**
   * Check if alpha testing is enabled
   * @returns {boolean} - True if alpha testing is enabled, false otherwise
   */
  isAlphaEnabled() {
    return this.alphaEnabled;
  }

  /**
   * Check if a specific alpha feature is enabled
   * @param {string} featureId - The ID of the feature to check
   * @returns {boolean} - True if the feature is enabled, false otherwise
   */
  isFeatureEnabled(featureId) {
    if (!this.alphaEnabled) {
      return false;
    }

    const feature = this.alphaFeatures.find(f => f.id === featureId);
    return feature ? feature.enabled : false;
  }

  /**
   * Get all alpha features
   * @returns {Array} - Array of alpha features
   */
  getAllFeatures() {
    return [...this.alphaFeatures];
  }

  /**
   * Get enabled alpha features
   * @returns {Array} - Array of enabled alpha features
   */
  getEnabledFeatures() {
    if (!this.alphaEnabled) {
      return [];
    }
    
    return this.alphaFeatures.filter(feature => feature.enabled);
  }

  /**
   * Get information about the alpha testing status
   * @returns {Object} - Object containing alpha testing information
   */
  getAlphaStatus() {
    return {
      enabled: this.alphaEnabled,
      featuresCount: this.alphaFeatures.length,
      enabledFeaturesCount: this.getEnabledFeatures().length,
      feedbackEnabled: this.feedbackEnabled,
      telemetryEnabled: this.telemetryEnabled,
      expirationDate: this.expirationDate ? this.expirationDate.toISOString() : null,
      hasExpired: this.expirationDate ? new Date() > this.expirationDate : false
    };
  }
}

export default AlphaService;