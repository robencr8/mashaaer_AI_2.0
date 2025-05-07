/**
 * Memory Service
 * 
 * This service encapsulates the functionality for storing and retrieving user and assistant messages,
 * emotions, and other data. It replaces the direct memory functionality in the application.
 */

import { saveMessage, getChatHistory } from '../../utils/session-storage.js';
import { addEpisodicMemory } from '../../utils/memory-engine.js';

export class MemoryService {
  constructor() {
    this.isInitialized = false;
    this.configService = null;
    this.memoryTimeline = [];
    this.emotions = [];
    this.maxEpisodicMemories = 100;
    this.consolidationInterval = 24 * 60 * 60 * 1000; // 24 hours
    this.lastConsolidation = Date.now();
  }

  /**
   * Initialize the memory service
   * @param {ConfigService} configService - Config service instance
   * @returns {MemoryService} - This instance for chaining
   */
  initialize(configService) {
    if (this.isInitialized) return this;

    this.configService = configService;
    
    // Get configuration values
    this.maxEpisodicMemories = configService.get('memory.maxEpisodicMemories', 100);
    this.consolidationInterval = configService.get('memory.consolidationInterval', 24 * 60 * 60 * 1000);
    
    // Load chat history from storage
    this.loadChatHistory();
    
    this.isInitialized = true;
    console.log("✅ Memory service initialized");
    return this;
  }

  /**
   * Load chat history from storage
   * @private
   */
  loadChatHistory() {
    const chatHistory = getChatHistory();
    
    // Convert chat history to memory timeline
    this.memoryTimeline = chatHistory.map((message, index) => ({
      id: `msg_${Date.now() - (chatHistory.length - index) * 1000}`,
      messageId: `msg_${Date.now() - (chatHistory.length - index) * 1000}`,
      message: message.text,
      emotion: message.emotion || 'neutral',
      timestamp: message.timestamp || Date.now() - (chatHistory.length - index) * 1000,
      type: message.role
    }));
    
    console.log(`Loaded ${this.memoryTimeline.length} messages from chat history`);
  }

  /**
   * Store a user message
   * @param {string} message - User message
   * @param {Object} emotion - Detected emotion
   */
  storeUserMessage(message, emotion) {
    // Create message object
    const messageObj = {
      id: `msg_${Date.now()}`,
      messageId: `msg_${Date.now()}`,
      message,
      emotion: emotion.type || 'neutral',
      emotionIntensity: emotion.confidence || 0,
      timestamp: Date.now(),
      type: 'user'
    };
    
    // Add to memory timeline
    this.memoryTimeline.push(messageObj);
    
    // Save to session storage
    saveMessage('user', message, emotion);
    
    // Add to episodic memory
    addEpisodicMemory({ message, emotion });
    
    // Add to emotions array
    this.storeEmotion({
      emotion: emotion.type || 'neutral',
      intensity: emotion.confidence || 0,
      timestamp: new Date().toISOString()
    });
    
    // Check if consolidation is needed
    this.checkConsolidation();
  }

  /**
   * Store an assistant response
   * @param {string} message - Assistant message
   * @param {string} emotion - Assistant emotion
   * @param {string} model - Model used for generation
   */
  storeAssistantResponse(message, emotion, model) {
    // Create message object
    const messageObj = {
      id: `resp_${Date.now()}`,
      messageId: `resp_${Date.now()}`,
      message,
      emotion: emotion || 'neutral',
      timestamp: Date.now(),
      type: 'assistant',
      model
    };
    
    // Add to memory timeline
    this.memoryTimeline.push(messageObj);
    
    // Save to session storage
    saveMessage('assistant', message, { type: emotion || 'neutral', confidence: 1 });
    
    // Check if consolidation is needed
    this.checkConsolidation();
  }

  /**
   * Store an emotion
   * @param {Object} emotion - Emotion object
   */
  storeEmotion(emotion) {
    // Add to emotions array
    this.emotions.push(emotion);
    
    // Limit the size of the emotions array
    if (this.emotions.length > this.maxEpisodicMemories) {
      this.emotions.shift();
    }
  }

  /**
   * Check if memory consolidation is needed
   * @private
   */
  checkConsolidation() {
    const now = Date.now();
    if (now - this.lastConsolidation > this.consolidationInterval) {
      this.consolidateMemories();
      this.lastConsolidation = now;
    }
  }

  /**
   * Consolidate memories
   * @private
   */
  consolidateMemories() {
    console.log('Consolidating memories...');
    
    // Limit the size of the memory timeline
    if (this.memoryTimeline.length > this.maxEpisodicMemories) {
      this.memoryTimeline = this.memoryTimeline.slice(-this.maxEpisodicMemories);
    }
    
    // Additional consolidation logic would go here
    // For example, summarizing older memories, identifying patterns, etc.
  }

  /**
   * Get the memory timeline
   * @returns {Array} - Memory timeline
   */
  getMemoryTimeline() {
    return [...this.memoryTimeline];
  }

  /**
   * Get the emotions array
   * @returns {Array} - Emotions array
   */
  getEmotions() {
    return [...this.emotions];
  }

  /**
   * Get context summary
   * @returns {Object} - Context summary
   */
  getContextSummary() {
    // Get the last emotion
    const lastEmotion = this.emotions.length > 0 ? 
      this.emotions[this.emotions.length - 1].emotion : 'neutral';
    
    // Get the dominant emotion
    const emotionCounts = {};
    this.emotions.forEach(e => {
      emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + 1;
    });
    
    let dominantEmotion = 'neutral';
    let maxCount = 0;
    
    Object.entries(emotionCounts).forEach(([emotion, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantEmotion = emotion;
      }
    });
    
    return {
      lastEmotion,
      dominantEmotion,
      totalEntries: this.emotions.length
    };
  }

  /**
   * Get emotional mood summary
   * @returns {string} - Emotional mood summary
   */
  getEmotionalMoodSummary() {
    const summary = this.getContextSummary();
    
    if (this.emotions.length === 0) {
      return 'لا مزاج واضح بعد';
    }
    
    // Create a simple mood summary based on the dominant emotion
    const moodMap = {
      happy: 'مزاج إيجابي',
      sad: 'مزاج حزين',
      angry: 'مزاج غاضب',
      confident: 'مزاج واثق',
      neutral: 'مزاج محايد'
    };
    
    return moodMap[summary.dominantEmotion] || 'مزاج متنوع';
  }

  /**
   * Get emotional trend
   * @returns {Array} - Emotional trend
   */
  getEmotionalTrend() {
    if (this.emotions.length < 2) {
      return [];
    }
    
    // Group emotions by type
    const emotionGroups = {};
    this.emotions.forEach(e => {
      if (!emotionGroups[e.emotion]) {
        emotionGroups[e.emotion] = [];
      }
      emotionGroups[e.emotion].push(e);
    });
    
    // Calculate trend for each emotion type
    const trends = Object.entries(emotionGroups).map(([emotion, entries]) => {
      // Simple trend: increasing, decreasing, or stable
      if (entries.length < 2) {
        return { emotion, trend: 'stable' };
      }
      
      const first = entries[0].intensity;
      const last = entries[entries.length - 1].intensity;
      
      if (last > first * 1.2) {
        return { emotion, trend: 'increasing' };
      } else if (last < first * 0.8) {
        return { emotion, trend: 'decreasing' };
      } else {
        return { emotion, trend: 'stable' };
      }
    });
    
    return trends;
  }

  /**
   * Find a node by ID or message ID
   * @param {string} id - Node ID or message ID
   * @returns {Object|null} - Found node or null
   */
  findNodeById(id) {
    return this.memoryTimeline.find(node => node.id === id || node.messageId === id) || null;
  }

  /**
   * Clear all memories
   */
  clearMemories() {
    this.memoryTimeline = [];
    this.emotions = [];
    
    // Clear session storage
    localStorage.removeItem('chatHistory');
    
    console.log('All memories cleared');
  }
}