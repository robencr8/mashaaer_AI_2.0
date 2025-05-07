/**
 * Mashaaer Enhanced Project
 * Emotion Timeline Module
 *
 * This module provides enhanced emotion timeline tracking and visualization
 * with advanced features like:
 * - Multi-dimensional emotion tracking
 * - Cultural context awareness
 * - Subscription-aware feature access
 * - Advanced visualization options
 * - Emotion pattern recognition
 */

class EmotionTimeline {
  constructor() {
    this.timelineData = null;
    this.subscriptionLevel = 'free';
    this.culturalContext = 'neutral';
    this.isInitialized = false;
    this.emotionColors = {
      happy: '#50fa7b',
      sad: '#6272a4',
      angry: '#ff5555',
      surprised: '#ffb86c',
      neutral: '#9370db',
      anxious: '#bd93f9',
      confident: '#f1fa8c'
    };

    // Add event listener for timeline view
    document.addEventListener('viewEmotionTimeline', this.handleViewTimelineRequest.bind(this));
  }

  /**
   * Handle the request to view the timeline
   * @param {Event} event - The event triggering the timeline view
   */
  handleViewTimelineRequest(event) {
    console.log('Timeline view requested', event);
  }

  /**
   * Initialize the emotion timeline
   * @param {Object} config - Configuration options
   */
  initialize(config = {}) {
    if (this.isInitialized) return this;

    this.config = { ...this.config, ...config };

    if (config.subscriptionLevel) {
      this.setSubscriptionLevel(config.subscriptionLevel);
    }

    if (config.culturalContext) {
      this.setCulturalContext(config.culturalContext);
    }

    this.timelineData = this.loadTimelineData();
    this.initEventListeners();
    this.createRouteHandler();

    this.isInitialized = true;
    console.log('Enhanced Emotion Timeline initialized');
    return this;
  }

  /**
   * Set the subscription level
   * @param {string} level - Subscription level ('free', 'basic', 'premium')
   */
  setSubscriptionLevel(level) {
    const validLevels = ['free', 'basic', 'premium'];
    if (validLevels.includes(level)) {
      this.subscriptionLevel = level;
      console.log(`Subscription level set to: ${level}`);
      return true;
    }
    console.warn(`Unknown subscription level: ${level}`);
    return false;
  }

  /**
   * Set the cultural context
   * @param {string} context - Cultural context
   */
  setCulturalContext(context) {
    this.culturalContext = context;
    console.log(`Cultural context set to: ${context}`);
    return true;
  }

  /**
   * Check if a feature is accessible based on subscription level
   * @param {string} feature - Feature name
   * @returns {boolean} Whether the feature is accessible
   */
  canAccessFeature(feature) {
    const featureAccess = {
      basicTimeline: ['free', 'basic', 'premium'],
      extendedHistory: ['basic', 'premium'],
      advancedVisualization: ['basic', 'premium'],
      emotionPatternRecognition: ['premium'],
      emotionExport: ['premium'],
      customTimeRanges: ['premium']
    };

    if (!featureAccess[feature]) {
      console.warn(`Unknown feature: ${feature}`);
      return false;
    }

    return featureAccess[feature].includes(this.subscriptionLevel);
  }

  /**
   * Load timeline data from storage
   * @returns {Object} Timeline data
   */
  loadTimelineData() {
    if (window.memoryDB) {
      const data = window.memoryDB.get(this.config.storageKey);
      if (data) {
        return this.validateTimelineData(data);
      }
    }

    const storedData = localStorage.getItem(this.config.storageKey);
    if (storedData) {
      try {
        return this.validateTimelineData(JSON.parse(storedData));
      } catch (e) {
        console.error('Error parsing emotion timeline data:', e);
        return this.createInitialTimelineData();
      }
    }

    return this.createInitialTimelineData();
  }

  /**
   * Validate timeline data structure and fix if necessary
   * @param {Object} data - Timeline data to validate
   * @returns {Object} Validated timeline data
   */
  validateTimelineData(data) {
    if (!data || typeof data !== 'object') {
      return this.createInitialTimelineData();
    }

    if (!Array.isArray(data.entries)) {
      data.entries = [];
    }

    if (!data.stats || typeof data.stats !== 'object') {
      data.stats = {
        mostFrequent: null,
        averageIntensity: 0,
        emotionCounts: {}
      };
    }

    if (!Array.isArray(data.patterns)) {
      data.patterns = [];
    }

    if (!data.lastUpdated) {
      data.lastUpdated = new Date().toISOString();
    }

    return data;
  }

  /**
   * Create initial timeline data structure
   * @returns {Object} Initial timeline data
   */
  createInitialTimelineData() {
    return {
      entries: [],
      stats: {
        mostFrequent: null,
        averageIntensity: 0,
        emotionCounts: {},
        emotionsByDay: {},
        emotionsByHour: {}
      },
      patterns: [],
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Save timeline data to storage
   */
  saveTimelineData() {
    this.timelineData.lastUpdated = new Date().toISOString();

    try {
      localStorage.setItem(this.config.storageKey, JSON.stringify(this.timelineData));
    } catch (e) {
      console.error('Error saving emotion timeline data to localStorage:', e);
    }

    if (window.memoryDB) {
      window.memoryDB.set(this.config.storageKey, this.timelineData);
    }

    this.syncWithServer();
  }

  /**
   * Sync timeline data with the server
   */
  syncWithServer() {
    if (!this.config.apiEndpoint || !this.canAccessFeature('emotionExport')) return;

    const syncData = {
      entries: this.timelineData.entries.slice(-50),
      stats: this.timelineData.stats,
      lastUpdated: this.timelineData.lastUpdated,
      culturalContext: this.culturalContext
    };

    fetch(this.config.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(syncData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Emotion timeline synced with server:', data);
    })
    .catch(error => {
      console.error('Error syncing emotion timeline with server:', error);
    });
  }

  /**
   * Initialize event listeners
   */
  initEventListeners() {
    document.addEventListener('emotionUpdate', this.handleEmotionUpdate.bind(this));
    document.addEventListener('viewEmotionTimeline', this.handleViewTimelineRequest.bind(this));
  }

  /**
   * Handle emotion update events
   * @param {Event} event - Event containing emotion updates
   */
  handleEmotionUpdate(event) {
    const { emotion, intensity } = event.detail;

    this.timelineData.entries.push({
      emotion,
      intensity,
      timestamp: new Date().toISOString()
    });

    this.updateStats(emotion, intensity);
    this.saveTimelineData();
    console.log(`Emotion update: ${emotion} (${intensity})`);
  }

  /**
   * Update timeline stats
   * @param {string} emotion - Emotion being updated
   * @param {number} intensity - Intensity of the emotion
   */
  updateStats(emotion, intensity) {
    const stats = this.timelineData.stats;

    if (!stats.emotionCounts[emotion]) {
      stats.emotionCounts[emotion] = 0;
    }
    stats.emotionCounts[emotion] += 1;

    const totalEntries = this.timelineData.entries.length;
    stats.averageIntensity = (stats.averageIntensity * (totalEntries - 1) + intensity) / totalEntries;

    stats.mostFrequent = Object.keys(stats.emotionCounts).reduce((a, b) =>
      stats.emotionCounts[a] > stats.emotionCounts[b] ? a : b
    );
  }

  /**
   * Create route handler for /emotions
   */
  createRouteHandler() {
    if (window.router) {
      window.router.registerRoute('/emotions', () => {
        this.handleViewTimelineRequest();
      });
    }
  }
}

export default EmotionTimeline;