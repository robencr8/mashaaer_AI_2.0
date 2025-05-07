/**
 * Emotion Service
 * 
 * This service encapsulates the functionality for emotion detection and tracking.
 * It replaces the EnhancedEmotionDetection class and related modules.
 */

export class EmotionService {
  constructor() {
    this.isInitialized = false;
    this.configService = null;
    this.memoryService = null;
    this.emotionCategories = {};
    this.emotionThreshold = 0.65;
    this.subscriptionLevel = 'free';
    this.culturalContext = 'standard';
    this.listeners = [];
  }

  /**
   * Initialize the emotion service
   * @param {ConfigService} configService - Config service instance
   * @param {MemoryService} memoryService - Memory service instance
   * @returns {EmotionService} - This instance for chaining
   */
  initialize(configService, memoryService) {
    if (this.isInitialized) return this;

    this.configService = configService;
    this.memoryService = memoryService;

    // Get configuration values
    this.subscriptionLevel = configService.get('subscription.plans', []).length > 0 ? 
      configService.get('subscription.plans', [])[1]?.id || 'premium' : 'premium';

    this.culturalContext = configService.get('emotion.culturalContext', 'standard');
    this.emotionThreshold = configService.get('emotion.threshold', 0.65);

    // Setup emotion categories
    this.setupEmotionCategories();

    this.isInitialized = true;
    console.log("✅ Emotion service initialized");
    return this;
  }

  /**
   * Setup emotion categories
   * @private
   */
  setupEmotionCategories() {
    this.emotionCategories = {
      happy: {
        keywords: {
          standard: ['happy', 'excited', 'joy', 'amazing'],
          arabic: ['سعيد', 'مبسوط', 'فرحان', 'منشرح'],
          levantine: ['مبسوط', 'فرحان'],
          gulf: ['مستانس', 'فرحان'],
          maghrebi: ['زين', 'مزيان']
        },
        responses: {
          standard: ["I'm glad you're happy!", "Keep smiling!"],
          arabic: ["يسعدني أنك سعيد!", "ابتسم دائمًا!"]
        },
        color: '#50fa7b',
        emoji: '😊',
        intensity: 0
      },
      sad: {
        keywords: {
          standard: ['sad', 'upset', 'unhappy'],
          arabic: ['حزين', 'مكتئب', 'زعلان'],
          levantine: ['زعلان', 'متضايق'],
          gulf: ['زعلان', 'مكتئب'],
          maghrebi: ['حزين', 'متضايق']
        },
        responses: {
          standard: ["I'm here for you.", "It's okay to feel sad."],
          arabic: ["أنا هنا للمساعدة.", "لا بأس أن تشعر بالحزن."]
        },
        color: '#6272a4',
        emoji: '😢',
        intensity: 0
      },
      confident: {
        keywords: {
          standard: ['confident', 'sure', 'positive', 'convinced'],
          arabic: ['واثق', 'متأكد', 'مطمئن'],
          levantine: ['واثق', 'أكيد'],
          gulf: ['واثق', 'متأكد'],
          maghrebi: ['واثق', 'مقتنع']
        },
        responses: {
          standard: ["I love your confidence!", "Being confident is great!"],
          arabic: ["أحب ثقتك بنفسك!", "إنه رائع أن تكون واثقًا!"]
        },
        color: '#00ced1',
        emoji: '💪',
        intensity: 0
      },
      neutral: {
        keywords: {
          standard: ['neutral', 'normal', 'okay'],
          arabic: ['عادي', 'طبيعي', 'محايد'],
          levantine: ['عادي', 'طبيعي'],
          gulf: ['عادي', 'طبيعي'],
          maghrebi: ['عادي', 'طبيعي']
        },
        responses: {
          standard: ["I understand.", "I see."],
          arabic: ["أفهم.", "أرى."]
        },
        color: '#9370db',
        emoji: '😐',
        intensity: 0
      }
    };
  }

  /**
   * Detect emotion from text
   * @param {string} text - Text to detect emotion from
   * @returns {Object} - Detected emotion with type and confidence
   */
  detectEmotionFromText(text) {
    if (!text) {
      return { type: 'neutral', confidence: 0 };
    }

    console.log(`Detecting emotion from text: ${text}`);

    // Simple emotion detection based on keywords
    for (const [emotion, data] of Object.entries(this.emotionCategories)) {
      const keywords = data.keywords[this.culturalContext] || data.keywords.arabic || [];
      const foundKeyword = keywords.find(keyword => 
        text.toLowerCase().includes(keyword.toLowerCase())
      );

      if (foundKeyword) {
        const confidence = Math.random() * 0.5 + 0.5; // Random confidence between 0.5 and 1.0

        // Notify listeners about the emotion update
        this.notifyEmotionUpdate(emotion, confidence);

        return { type: emotion, confidence };
      }
    }

    // Default to neutral if no emotion is detected
    const defaultEmotion = { type: 'neutral', confidence: 0.5 };

    // Notify listeners about the emotion update
    this.notifyEmotionUpdate(defaultEmotion.type, defaultEmotion.confidence);

    return defaultEmotion;
  }

  /**
   * Add a listener for emotion updates
   * @param {Function} listener - Listener function
   */
  addEmotionListener(listener) {
    this.listeners.push(listener);
  }

  /**
   * Remove a listener for emotion updates
   * @param {Function} listener - Listener function to remove
   */
  removeEmotionListener(listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  /**
   * Notify all listeners about an emotion update
   * @param {string} emotion - Emotion type
   * @param {number} intensity - Emotion intensity
   * @private
   */
  notifyEmotionUpdate(emotion, intensity) {
    const update = {
      emotion,
      intensity,
      timestamp: new Date().toISOString()
    };

    this.listeners.forEach(listener => {
      try {
        listener(update);
      } catch (error) {
        console.error('Error in emotion listener:', error);
      }
    });

    // Store the emotion in memory if memory service is available
    if (this.memoryService) {
      this.memoryService.storeEmotion(update);
    }
  }

  /**
   * Get emotion color for a given emotion
   * @param {string} emotion - Emotion type
   * @returns {string} - Color for the emotion
   */
  getEmotionColor(emotion) {
    return this.emotionCategories[emotion]?.color || '#9370db';
  }

  /**
   * Get emotion emoji for a given emotion
   * @param {string} emotion - Emotion type
   * @returns {string} - Emoji for the emotion
   */
  getEmotionEmoji(emotion) {
    return this.emotionCategories[emotion]?.emoji || '😐';
  }

  /**
   * Check if a feature is accessible based on subscription level
   * @param {string} feature - Feature name
   * @returns {boolean} - Whether the feature is accessible
   */
  canAccessFeature(feature) {
    const featureAccess = {
      basicEmotionDetection: ['free', 'basic', 'premium'],
      advancedEmotionDetection: ['basic', 'premium'],
      facialEmotionDetection: ['premium'],
      emotionTimeline: ['basic', 'premium']
    };
    return featureAccess[feature]?.includes(this.subscriptionLevel) || false;
  }
}
