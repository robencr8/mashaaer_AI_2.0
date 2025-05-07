/**
 * Mashaaer Enhanced Project Configuration
 * 
 * This file contains the configuration for the Mashaaer Enhanced Project.
 * It is loaded by the ConfigManager using cosmiconfig.
 */

module.exports = {
  // Theme configuration
  theme: {
    accentColor: 'warm',
    animationSpeed: 'normal',
    starDensity: 'high',
    starShape: 'star',
  },

  // Assistant configuration
  assistant: {
    defaultDialect: 'khaliji',
    defaultTone: 'cheerful',
    defaultVoiceProfile: 'GULF_FEMALE_ARIA',
  },

  // Emotion detection configuration
  emotion: {
    detectionEnabled: true,
    timelineEnabled: true,
    culturalContextEnabled: true,
    // Advanced emotion detection settings
    advanced: {
      sensitivityLevel: 'high',
      contextAwareness: true,
      dialectSpecificPatterns: true,
    }
  },

  // Integration configuration
  integration: {
    paypal: {
      enabled: true,
      sandboxMode: false, // Production mode
      clientId: process.env.PAYPAL_CLIENT_ID || 'PAYPAL_CLIENT_ID_NOT_SET',
      currency: 'USD',
    },
    whatsapp: {
      enabled: true,
      qrCodeRefreshInterval: 30000,
      autoReconnect: true,
    },
    telegram: {
      enabled: true,
      botToken: process.env.TELEGRAM_BOT_TOKEN || 'TELEGRAM_BOT_TOKEN_NOT_SET',
    },
  },

  // Subscription configuration
  subscription: {
    trialPeriodDays: 14,
    referralBonusDays: 7,
    plans: [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        features: ['basic-emotion-detection', 'basic-voice'],
        limits: {
          requestsPerDay: 50,
          sessionDurationMinutes: 15,
          maxStoredConversations: 5
        }
      },
      {
        id: 'basic',
        name: 'Basic',
        price: 9.99,
        features: ['emotion-detection', 'voice-customization'],
        limits: {
          requestsPerDay: 200,
          sessionDurationMinutes: 60,
          maxStoredConversations: 20
        }
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 19.99,
        features: ['emotion-detection', 'voice-customization', 'dialect-support', 'integrations'],
        limits: {
          requestsPerDay: -1, // unlimited
          sessionDurationMinutes: -1, // unlimited
          maxStoredConversations: 100
        }
      }
    ]
  },

  // System configuration
  system: {
    debugMode: false,
    logLevel: 'info',
    performanceMonitoring: true,
    errorReporting: true,
    // Remote logging configuration for production environment
    remoteLogging: {
      enabled: true,
      endpoint: 'https://logging.mashaaer-enhanced.com/api/logs',
      batchSize: 20,
      flushInterval: 10000, // 10 seconds
    },
  },

  // Analytics configuration
  analytics: {
    googleAnalyticsId: 'G-XXXXXXXXXX', // Replace with actual GA ID in production
    trackingEnabled: true,
    anonymizeIp: true,
    sessionLogsEnabled: true,
    feedbackTracking: true,
    performanceTracking: true
  },

  // Alpha testing configuration
  alpha: {
    enabled: true,
    features: [
      {
        id: 'advanced-emotion-detection',
        name: 'Advanced Emotion Detection',
        enabled: true,
        description: 'Enhanced emotion detection with improved accuracy and dialect support'
      },
      {
        id: 'memory-indexer',
        name: 'Memory Indexer',
        enabled: true,
        description: 'Advanced memory indexing and retrieval capabilities'
      },
      {
        id: 'voice-personality-v2',
        name: 'Voice Personality V2',
        enabled: true,
        description: 'Next generation voice personality with improved emotion response'
      }
    ],
    feedbackEnabled: true,
    telemetryEnabled: true,
    expirationDate: '2025-12-31'
  }
};
