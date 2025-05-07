/**
 * Mashaaer Enhanced Project
 * Enhanced Memory Module
 *
 * This module extends the emotional memory capabilities with:
 * - Episodic Memory: Stores specific user interactions and experiences
 * - Semantic Memory: Stores general knowledge and facts about the user
 * - Memory Retrieval: Provides methods to retrieve relevant memories
 * - Memory Consolidation: Periodically consolidates memories for better recall
 */

export class EnhancedMemory {
  constructor() {
    this.episodicMemories = [];
    this.semanticMemories = {};
    this.lastConsolidation = new Date().toISOString();
    this.config = {
      storageKey: 'enhanced-memory-data',
      maxEpisodicMemories: 100,
      consolidationInterval: 24 * 60 * 60 * 1000, // 24 hours
    };
    this.isInitialized = false;
  }

  /**
   * Initialize the enhanced memory system
   * @param {Object} config - Configuration options
   */
  initialize(config = {}) {
    if (this.isInitialized) return this;

    this.config = { ...this.config, ...config };
    this.loadMemories();
    this.setupConsolidationTimer();
    
    this.isInitialized = true;
    console.log('Enhanced Memory system initialized');
    return this;
  }

  /**
   * Load memories from storage
   */
  loadMemories() {
    try {
      // Try to load from memoryDB first
      if (window.memoryDB) {
        const data = window.memoryDB.get(this.config.storageKey);
        if (data) {
          this.episodicMemories = data.episodicMemories || [];
          this.semanticMemories = data.semanticMemories || {};
          this.lastConsolidation = data.lastConsolidation || new Date().toISOString();
          return;
        }
      }

      // Fall back to localStorage
      const storedData = localStorage.getItem(this.config.storageKey);
      if (storedData) {
        const data = JSON.parse(storedData);
        this.episodicMemories = data.episodicMemories || [];
        this.semanticMemories = data.semanticMemories || {};
        this.lastConsolidation = data.lastConsolidation || new Date().toISOString();
      }
    } catch (error) {
      console.error('Error loading enhanced memories:', error);
      // Initialize with empty memories if loading fails
      this.episodicMemories = [];
      this.semanticMemories = {};
      this.lastConsolidation = new Date().toISOString();
    }
  }

  /**
   * Save memories to storage
   */
  saveMemories() {
    const data = {
      episodicMemories: this.episodicMemories,
      semanticMemories: this.semanticMemories,
      lastConsolidation: this.lastConsolidation
    };

    try {
      // Save to memoryDB if available
      if (window.memoryDB) {
        window.memoryDB.set(this.config.storageKey, data);
      }

      // Also save to localStorage as backup
      localStorage.setItem(this.config.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving enhanced memories:', error);
    }
  }

  /**
   * Set up a timer for periodic memory consolidation
   */
  setupConsolidationTimer() {
    // Skip in non-browser environments
    if (typeof window === 'undefined') return;

    // Check if consolidation is needed
    const lastConsolidationTime = new Date(this.lastConsolidation).getTime();
    const currentTime = new Date().getTime();
    
    if (currentTime - lastConsolidationTime >= this.config.consolidationInterval) {
      this.consolidateMemories();
    }

    // Set up timer for next consolidation
    setInterval(() => {
      this.consolidateMemories();
    }, this.config.consolidationInterval);
  }

  /**
   * Store an episodic memory (specific interaction or experience)
   * @param {Object} memory - The memory to store
   * @param {string} memory.input - User input
   * @param {string} memory.response - System response
   * @param {string} memory.emotion - Associated emotion
   * @param {Object} memory.context - Additional context
   */
  storeEpisodicMemory(memory) {
    if (!memory || !memory.input) return;

    const episodicMemory = {
      type: 'episodic',
      input: memory.input,
      response: memory.response || '',
      emotion: memory.emotion || 'neutral',
      context: memory.context || {},
      timestamp: new Date().toISOString(),
      importance: this.calculateImportance(memory),
      retrievalCount: 0
    };

    // Add to episodic memories
    this.episodicMemories.unshift(episodicMemory);

    // Limit the number of episodic memories
    if (this.episodicMemories.length > this.config.maxEpisodicMemories) {
      // Sort by importance before removing
      this.episodicMemories.sort((a, b) => b.importance - a.importance);
      this.episodicMemories = this.episodicMemories.slice(0, this.config.maxEpisodicMemories);
    }

    // Extract semantic information from the episodic memory
    this.extractSemanticInformation(episodicMemory);

    // Save memories
    this.saveMemories();
  }

  /**
   * Calculate the importance of a memory for retention
   * @param {Object} memory - The memory to evaluate
   * @returns {number} Importance score (0-1)
   */
  calculateImportance(memory) {
    let importance = 0.5; // Default importance

    // Emotional memories are more important
    if (memory.emotion && memory.emotion !== 'neutral') {
      const emotionImportance = {
        'happy': 0.7,
        'sad': 0.8,
        'angry': 0.8,
        'anxious': 0.7,
        'surprised': 0.6,
        'neutral': 0.5
      };
      importance = emotionImportance[memory.emotion] || importance;
    }

    // Longer interactions might be more important
    if (memory.input && memory.input.length > 100) {
      importance += 0.1;
    }

    // Recent memories are more important (will be adjusted during consolidation)
    importance += 0.2;

    return Math.min(importance, 1.0);
  }

  /**
   * Extract semantic information from episodic memories
   * @param {Object} episodicMemory - The episodic memory to extract from
   */
  extractSemanticInformation(episodicMemory) {
    // Simple extraction based on keywords
    const input = episodicMemory.input.toLowerCase();
    
    // Extract personal information
    if (input.includes('اسمي') || input.includes('my name is')) {
      const nameMatch = input.match(/اسمي\s+(\S+)/) || input.match(/my name is\s+(\S+)/);
      if (nameMatch && nameMatch[1]) {
        this.storeSemanticMemory('personalInfo', 'name', nameMatch[1]);
      }
    }
    
    // Extract preferences
    if (input.includes('أحب') || input.includes('i like')) {
      const likeMatch = input.match(/أحب\s+(.+)/) || input.match(/i like\s+(.+)/);
      if (likeMatch && likeMatch[1]) {
        this.storeSemanticMemory('preferences', 'likes', likeMatch[1]);
      }
    }
    
    if (input.includes('لا أحب') || input.includes('i don\'t like') || input.includes('i dislike')) {
      const dislikeMatch = input.match(/لا أحب\s+(.+)/) || input.match(/i don't like\s+(.+)/) || input.match(/i dislike\s+(.+)/);
      if (dislikeMatch && dislikeMatch[1]) {
        this.storeSemanticMemory('preferences', 'dislikes', dislikeMatch[1]);
      }
    }
    
    // Extract locations
    if (input.includes('أعيش في') || input.includes('i live in')) {
      const locationMatch = input.match(/أعيش في\s+(.+)/) || input.match(/i live in\s+(.+)/);
      if (locationMatch && locationMatch[1]) {
        this.storeSemanticMemory('personalInfo', 'location', locationMatch[1]);
      }
    }
  }

  /**
   * Store semantic memory (general knowledge about the user)
   * @param {string} category - Category of the information
   * @param {string} key - Key for the information
   * @param {any} value - Value to store
   */
  storeSemanticMemory(category, key, value) {
    if (!category || !key || value === undefined) return;

    // Initialize category if it doesn't exist
    if (!this.semanticMemories[category]) {
      this.semanticMemories[category] = {};
    }

    // Store the value
    this.semanticMemories[category][key] = {
      value,
      timestamp: new Date().toISOString(),
      confidence: 0.8, // Initial confidence
      sources: 1 // Number of sources confirming this information
    };

    // Save memories
    this.saveMemories();
  }

  /**
   * Retrieve episodic memories based on query
   * @param {Object} query - Query parameters
   * @param {string} query.text - Text to search for
   * @param {string} query.emotion - Emotion to filter by
   * @param {number} query.limit - Maximum number of results
   * @returns {Array} Matching episodic memories
   */
  retrieveEpisodicMemories(query = {}) {
    const { text, emotion, limit = 5 } = query;
    
    // Filter memories based on query
    let results = [...this.episodicMemories];
    
    if (text) {
      const searchText = text.toLowerCase();
      results = results.filter(memory => 
        memory.input.toLowerCase().includes(searchText) || 
        memory.response.toLowerCase().includes(searchText)
      );
    }
    
    if (emotion) {
      results = results.filter(memory => memory.emotion === emotion);
    }
    
    // Sort by timestamp (newest first)
    results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Limit results
    results = results.slice(0, limit);
    
    // Update retrieval count for returned memories
    results.forEach(result => {
      const memory = this.episodicMemories.find(m => m.timestamp === result.timestamp);
      if (memory) {
        memory.retrievalCount += 1;
        memory.importance += 0.1; // Increase importance when retrieved
        memory.importance = Math.min(memory.importance, 1.0);
      }
    });
    
    // Save after updating retrieval counts
    this.saveMemories();
    
    return results;
  }

  /**
   * Retrieve semantic memory
   * @param {string} category - Category to retrieve
   * @param {string} key - Specific key to retrieve (optional)
   * @returns {Object|null} The semantic memory
   */
  retrieveSemanticMemory(category, key = null) {
    if (!category) return null;
    
    // Return the entire category if no key is specified
    if (!key) {
      return this.semanticMemories[category] || null;
    }
    
    // Return the specific key
    return this.semanticMemories[category]?.[key] || null;
  }

  /**
   * Consolidate memories to improve recall and reduce storage
   */
  consolidateMemories() {
    console.log('Consolidating memories...');
    
    // Update importance based on age and retrieval count
    const currentTime = new Date().getTime();
    
    this.episodicMemories.forEach(memory => {
      const memoryTime = new Date(memory.timestamp).getTime();
      const ageInDays = (currentTime - memoryTime) / (24 * 60 * 60 * 1000);
      
      // Reduce importance based on age
      if (ageInDays > 30) {
        memory.importance -= 0.2;
      } else if (ageInDays > 7) {
        memory.importance -= 0.1;
      }
      
      // Increase importance based on retrieval count
      if (memory.retrievalCount > 5) {
        memory.importance += 0.3;
      } else if (memory.retrievalCount > 2) {
        memory.importance += 0.2;
      }
      
      // Ensure importance is within bounds
      memory.importance = Math.max(0.1, Math.min(memory.importance, 1.0));
    });
    
    // Remove low-importance memories if we're over the limit
    if (this.episodicMemories.length > this.config.maxEpisodicMemories) {
      this.episodicMemories.sort((a, b) => b.importance - a.importance);
      this.episodicMemories = this.episodicMemories.slice(0, this.config.maxEpisodicMemories);
    }
    
    // Update semantic memories confidence based on multiple sources
    Object.keys(this.semanticMemories).forEach(category => {
      Object.keys(this.semanticMemories[category]).forEach(key => {
        const memory = this.semanticMemories[category][key];
        if (memory.sources > 3) {
          memory.confidence = 0.95;
        } else if (memory.sources > 1) {
          memory.confidence = 0.9;
        }
      });
    });
    
    // Update last consolidation timestamp
    this.lastConsolidation = new Date().toISOString();
    
    // Save consolidated memories
    this.saveMemories();
    
    console.log('Memory consolidation complete');
  }

  /**
   * Get a summary of the user based on semantic memories
   * @returns {Object} User summary
   */
  getUserSummary() {
    const summary = {
      personalInfo: {},
      preferences: {
        likes: [],
        dislikes: []
      },
      emotionalTrends: this.getEmotionalTrends()
    };
    
    // Extract personal info
    if (this.semanticMemories.personalInfo) {
      Object.keys(this.semanticMemories.personalInfo).forEach(key => {
        summary.personalInfo[key] = this.semanticMemories.personalInfo[key].value;
      });
    }
    
    // Extract preferences
    if (this.semanticMemories.preferences) {
      if (this.semanticMemories.preferences.likes) {
        summary.preferences.likes.push(this.semanticMemories.preferences.likes.value);
      }
      if (this.semanticMemories.preferences.dislikes) {
        summary.preferences.dislikes.push(this.semanticMemories.preferences.dislikes.value);
      }
    }
    
    return summary;
  }

  /**
   * Get emotional trends from episodic memories
   * @returns {Object} Emotional trends
   */
  getEmotionalTrends() {
    const emotions = this.episodicMemories.map(memory => memory.emotion);
    const emotionCounts = emotions.reduce((acc, emotion) => {
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {});
    
    // Calculate percentages
    const total = emotions.length;
    const trends = {};
    
    Object.keys(emotionCounts).forEach(emotion => {
      trends[emotion] = (emotionCounts[emotion] / total) * 100;
    });
    
    return trends;
  }
}

export default EnhancedMemory;