/**
 * Config Service
 * 
 * This service encapsulates the functionality for managing configuration settings.
 * It replaces the direct configuration management in the application.
 */

import configManager from '../../config/config.js';

export class ConfigService {
  constructor() {
    this.isInitialized = false;
    this.config = {};
    this.defaultConfig = {
      assistant: {
        language: 'ar-SA',
        defaultDialect: 'khaliji',
        defaultTone: 'cheerful',
        defaultVoiceProfile: 'GULF_FEMALE_ARIA'
      },
      emotion: {
        detectionEnabled: true,
        culturalContextEnabled: true,
        timelineEnabled: true,
        threshold: 0.65,
        culturalContext: 'standard',
        advanced: {
          sensitivityLevel: 'medium',
          contextAwareness: true,
          dialectSpecificPatterns: true
        }
      },
      voice: {
        enabled: true,
        useElevenLabs: false,
        elevenlabsApiKey: ''
      },
      api: {
        useFlaskBackend: true,
        useMultiengine: true
      },
      memory: {
        maxEpisodicMemories: 100,
        consolidationInterval: 24 * 60 * 60 * 1000 // 24 hours
      },
      system: {
        debugMode: false,
        logLevel: 'info',
        performanceMonitoring: true,
        errorReporting: true
      },
      theme: {
        accentColor: '#9370db',
        darkMode: false,
        fontScale: 1.0,
        animationsEnabled: true
      },
      subscription: {
        plans: [
          { id: 'free', name: 'Free', features: ['basicEmotionDetection'] },
          { id: 'premium', name: 'Premium', features: ['basicEmotionDetection', 'advancedEmotionDetection', 'facialEmotionDetection', 'emotionTimeline'] }
        ]
      }
    };
  }

  /**
   * Initialize the config service
   * @param {Object} initialConfig - Initial configuration
   * @returns {Promise<ConfigService>} - This instance for chaining
   */
  async initialize(initialConfig = {}) {
    if (this.isInitialized) return this;

    try {
      // Initialize the config manager
      await configManager.initialize();
      
      // Merge default config with config from manager and initial config
      this.config = this.mergeConfigs(
        this.defaultConfig,
        configManager.getAll(),
        initialConfig
      );
      
      this.isInitialized = true;
      console.log("✅ Config service initialized");
      return this;
    } catch (error) {
      console.error("Error initializing config service:", error);
      // Fall back to default config merged with initial config
      this.config = this.mergeConfigs(this.defaultConfig, initialConfig);
      this.isInitialized = true;
      return this;
    }
  }

  /**
   * Merge multiple config objects
   * @param {...Object} configs - Config objects to merge
   * @returns {Object} - Merged config
   * @private
   */
  mergeConfigs(...configs) {
    return configs.reduce((merged, config) => {
      return this.deepMerge(merged, config);
    }, {});
  }

  /**
   * Deep merge two objects
   * @param {Object} target - Target object
   * @param {Object} source - Source object
   * @returns {Object} - Merged object
   * @private
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
   * @param {*} item - Value to check
   * @returns {boolean} - Whether the value is an object
   * @private
   */
  isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  /**
   * Get a configuration value
   * @param {string} path - Configuration path (e.g., 'assistant.language')
   * @param {*} defaultValue - Default value if path is not found
   * @returns {*} - Configuration value
   */
  get(path, defaultValue) {
    const parts = path.split('.');
    let current = this.config;
    
    for (const part of parts) {
      if (current === undefined || current === null || typeof current !== 'object') {
        return defaultValue;
      }
      current = current[part];
    }
    
    return current !== undefined ? current : defaultValue;
  }

  /**
   * Set a configuration value
   * @param {string} path - Configuration path (e.g., 'assistant.language')
   * @param {*} value - Value to set
   */
  set(path, value) {
    const parts = path.split('.');
    const lastPart = parts.pop();
    let current = this.config;
    
    for (const part of parts) {
      if (current[part] === undefined || current[part] === null || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part];
    }
    
    current[lastPart] = value;
    
    // Save to config manager
    try {
      configManager.set(path, value);
    } catch (error) {
      console.error(`Error saving config value for ${path}:`, error);
    }
  }

  /**
   * Get all configuration
   * @returns {Object} - All configuration
   */
  getAll() {
    return { ...this.config };
  }

  /**
   * Reset configuration to defaults
   */
  resetToDefaults() {
    this.config = { ...this.defaultConfig };
    
    // Save to config manager
    try {
      configManager.resetToDefaults();
    } catch (error) {
      console.error('Error resetting config to defaults:', error);
    }
  }

  /**
   * Save configuration
   * @returns {Promise<boolean>} - Whether the save was successful
   */
  async save() {
    try {
      await configManager.saveAll(this.config);
      return true;
    } catch (error) {
      console.error('Error saving config:', error);
      return false;
    }
  }
}