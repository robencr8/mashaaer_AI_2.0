/**
 * Configuration manager for Mashaaer Enhanced Project
 * Frontend-friendly configuration system with support for environment variables
 */
class ConfigManager {
  constructor() {
    this.config = null;
    this.isInitialized = false;
    this.envPrefix = 'MASHAAER_';
  }

  /**
   * Initialize the configuration manager
   * Loads configuration from environment variables and a predefined object
   * @returns {Promise<Object>} The loaded configuration
   */
  async initialize() {
    try {
      // Start with default configuration
      const defaultConfig = this.getDefaultConfig();

      // Load environment variables
      const envConfig = this.loadEnvironmentVariables();

      // Merge configurations (environment variables take precedence)
      this.config = this.mergeConfigs(defaultConfig, envConfig);

      this.isInitialized = true;
      console.log('Configuration loaded successfully');
      return this.config;
    } catch (error) {
      console.error('Error loading configuration:', error);
      this.config = this.getDefaultConfig();
      this.isInitialized = true;
      return this.config;
    }
  }

  /**
   * Load configuration from environment variables
   * @returns {Object} Configuration from environment variables
   */
  loadEnvironmentVariables() {
    const envConfig = {};

    // In a browser environment, we can access environment variables through process.env
    // These are typically set during the build process
    if (typeof process !== 'undefined' && process.env) {
      Object.keys(process.env).forEach(key => {
        // Only process environment variables with the correct prefix
        if (key.startsWith(this.envPrefix)) {
          // Remove prefix and convert to lowercase
          const configKey = key.replace(this.envPrefix, '').toLowerCase();

          // Convert dot notation (e.g., SYSTEM_LOG_LEVEL) to nested objects
          this.setNestedValue(envConfig, configKey.replace(/_/g, '.'), process.env[key]);
        }
      });
    }

    return envConfig;
  }

  /**
   * Set a nested value in an object using dot notation
   * @param {Object} obj - The object to set the value in
   * @param {string} path - The path to the value (dot notation)
   * @param {*} value - The value to set
   */
  setNestedValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }

    // Set the value at the final key
    current[keys[keys.length - 1]] = this.parseValue(value);
  }

  /**
   * Parse a string value to the appropriate type
   * @param {string} value - The value to parse
   * @returns {*} The parsed value
   */
  parseValue(value) {
    // Try to parse as JSON
    try {
      return JSON.parse(value);
    } catch (e) {
      // If it's not valid JSON, return as is
      return value;
    }
  }

  /**
   * Merge multiple configuration objects
   * @param {...Object} configs - Configuration objects to merge
   * @returns {Object} Merged configuration
   */
  mergeConfigs(...configs) {
    return configs.reduce((result, config) => {
      return this.deepMerge(result, config);
    }, {});
  }

  /**
   * Deep merge two objects
   * @param {Object} target - Target object
   * @param {Object} source - Source object
   * @returns {Object} Merged object
   */
  deepMerge(target, source) {
    const output = { ...target };

    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (this.isObject(source[key])) {
          if (!(key in target)) {
            output[key] = source[key];
          } else {
            output[key] = this.deepMerge(target[key], source[key]);
          }
        } else {
          output[key] = source[key];
        }
      });
    }

    return output;
  }

  /**
   * Check if a value is an object
   * @param {*} item - The value to check
   * @returns {boolean} True if the value is an object
   */
  isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  /**
   * Initialize the configuration manager synchronously
   * @returns {Object} The loaded configuration
   */
  initializeSync() {
    try {
      this.config = this.getDefaultConfig();
      this.isInitialized = true;
      console.log('Configuration loaded successfully (sync)');
      return this.config;
    } catch (error) {
      console.error('Error loading configuration:', error);
      this.config = this.getDefaultConfig();
      this.isInitialized = true;
      return this.config;
    }
  }

  /**
   * Get the default configuration
   * @returns {Object} The default configuration
   */
  getDefaultConfig() {
    return {
      theme: {
        accentColor: 'warm',
        animationSpeed: 'normal',
        starDensity: 'high',
        starShape: 'star',
      },

      assistant: {
        defaultDialect: 'khaliji',
        defaultTone: 'cheerful',
        defaultVoiceProfile: 'GULF_FEMALE_ARIA',
      },

      emotion: {
        detectionEnabled: true,
        timelineEnabled: true,
        culturalContextEnabled: true,
        advanced: {
          sensitivityLevel: 'high',
          contextAwareness: true,
          dialectSpecificPatterns: true,
        }
      },

      integration: {
        paypal: {
          enabled: true,
          sandboxMode: true,
          clientId: 'your-paypal-client-id',
          currency: 'USD',
        },
        whatsapp: {
          enabled: true,
          qrCodeRefreshInterval: 30000,
          autoReconnect: true,
        },
        telegram: {
          enabled: true,
          botToken: 'your-telegram-bot-token',
        },
      },

      subscription: {
        trialPeriodDays: 14,
        referralBonusDays: 7,
        plans: [
          {
            id: 'basic',
            name: 'Basic',
            price: 9.99,
            features: ['emotion-detection', 'voice-customization'],
          },
          {
            id: 'premium',
            name: 'Premium',
            price: 19.99,
            features: ['emotion-detection', 'voice-customization', 'dialect-support', 'integrations'],
          }
        ]
      },

      system: {
        debugMode: false,
        logLevel: 'info',
        performanceMonitoring: true,
        errorReporting: true,
      }
    };
  }

  /**
   * Get the current configuration
   * @returns {Object} The current configuration
   */
  getConfig() {
    if (!this.isInitialized) {
      console.warn('Configuration not initialized, returning default config');
      return this.getDefaultConfig();
    }
    return this.config;
  }

  /**
   * Get a specific configuration value
   * @param {string} key The configuration key (dot notation supported)
   * @param {*} defaultValue The default value to return if the key is not found
   * @returns {*} The configuration value
   */
  get(key, defaultValue = null) {
    if (!this.isInitialized) {
      console.warn('Configuration not initialized, returning default value');
      return defaultValue;
    }

    const keys = key.split('.');
    let value = this.config;

    for (const k of keys) {
      if (value === undefined || value === null || typeof value !== 'object') {
        return defaultValue;
      }
      value = value[k];
    }

    return value !== undefined ? value : defaultValue;
  }
}

// Create and export a singleton instance
const configManager = new ConfigManager();

export default configManager;
