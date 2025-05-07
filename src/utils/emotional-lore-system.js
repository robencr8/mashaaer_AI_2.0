/**
 * Mashaaer Enhanced Project
 * Emotional Lore System (Narrative Memory)
 *
 * This module provides a narrative-based memory system that remembers
 * significant emotional events and can surface them during conversations.
 */

import { addSemanticMemory, getSemanticMemory } from './memory-engine.js';

// Emotional event types
const EVENT_TYPES = {
  EMOTIONAL_DISCLOSURE: 'emotional_disclosure',
  BREAKTHROUGH: 'breakthrough',
  CHALLENGE: 'challenge',
  ACHIEVEMENT: 'achievement',
  REFLECTION: 'reflection',
  FORGIVENESS: 'forgiveness',
  GRATITUDE: 'gratitude',
  FEAR: 'fear',
  JOY: 'joy',
  SADNESS: 'sadness',
  ANGER: 'anger',
  SURPRISE: 'surprise'
};

// Emotional intensity levels
const INTENSITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  EXTREME: 'extreme'
};

/**
 * Emotional Lore System
 * Manages narrative memories of emotional events
 */
class EmotionalLoreSystem {
  constructor() {
    this.narrativeMemories = [];
    this.initialized = false;
    this.emotionalThemes = {};
    this.lastRecalledMemoryId = null;
    this.recallFrequency = {
      // How often to recall memories of each type (higher = more frequent)
      [EVENT_TYPES.EMOTIONAL_DISCLOSURE]: 0.8,
      [EVENT_TYPES.BREAKTHROUGH]: 0.7,
      [EVENT_TYPES.CHALLENGE]: 0.6,
      [EVENT_TYPES.ACHIEVEMENT]: 0.7,
      [EVENT_TYPES.REFLECTION]: 0.5,
      [EVENT_TYPES.FORGIVENESS]: 0.6,
      [EVENT_TYPES.GRATITUDE]: 0.5,
      [EVENT_TYPES.FEAR]: 0.7,
      [EVENT_TYPES.JOY]: 0.5,
      [EVENT_TYPES.SADNESS]: 0.7,
      [EVENT_TYPES.ANGER]: 0.6,
      [EVENT_TYPES.SURPRISE]: 0.4
    };
  }
  
  /**
   * Initialize the emotional lore system
   */
  initialize() {
    if (this.initialized) return;
    
    // Load existing memories from semantic memory
    const savedMemories = getSemanticMemory('narrativeMemories');
    if (savedMemories) {
      this.narrativeMemories = savedMemories;
      this.rebuildEmotionalThemes();
    }
    
    this.initialized = true;
    console.log('✅ Emotional Lore System initialized');
  }
  
  /**
   * Create a new narrative memory
   * @param {Object} memory - The memory to create
   * @returns {string} - The ID of the created memory
   */
  createMemory(memory) {
    if (!memory.message || !memory.type) {
      console.warn('Invalid memory: missing required fields');
      return null;
    }
    
    // Generate a unique ID for the memory
    const memoryId = `mem_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    // Create the narrative memory
    const narrativeMemory = {
      id: memoryId,
      type: memory.type,
      message: memory.message,
      emotion: memory.emotion || 'neutral',
      intensity: memory.intensity || INTENSITY_LEVELS.MEDIUM,
      timestamp: memory.timestamp || Date.now(),
      keywords: memory.keywords || this.extractKeywords(memory.message),
      narrativeDescription: this.generateNarrativeDescription(memory),
      recallCount: 0,
      lastRecalled: null,
      relatedMemories: [],
      userFeedback: null
    };
    
    // Add to memories
    this.narrativeMemories.push(narrativeMemory);
    
    // Update emotional themes
    this.updateEmotionalThemes(narrativeMemory);
    
    // Save to semantic memory
    this.saveMemories();
    
    console.log(`Created narrative memory: ${memoryId}`);
    return memoryId;
  }
  
  /**
   * Generate a narrative description for a memory
   * @param {Object} memory - The memory to describe
   * @returns {string} - A narrative description
   */
  generateNarrativeDescription(memory) {
    const timePhrase = this.getTimePhrase(memory.timestamp || Date.now());
    
    // Generate different descriptions based on event type
    switch (memory.type) {
      case EVENT_TYPES.EMOTIONAL_DISCLOSURE:
        return `ذلك الوقت ${timePhrase} عندما فتحت قلبك وتحدثت عن ${memory.emotion || 'مشاعرك'}`;
      case EVENT_TYPES.BREAKTHROUGH:
        return `لحظة الاختراق ${timePhrase} عندما حققت تقدمًا كبيرًا`;
      case EVENT_TYPES.CHALLENGE:
        return `التحدي الذي واجهته ${timePhrase}`;
      case EVENT_TYPES.ACHIEVEMENT:
        return `إنجازك ${timePhrase} الذي كنت فخورًا به`;
      case EVENT_TYPES.REFLECTION:
        return `تأملك العميق ${timePhrase}`;
      case EVENT_TYPES.FORGIVENESS:
        return `اللحظة ${timePhrase} عندما سامحت نفسك`;
      case EVENT_TYPES.GRATITUDE:
        return `عندما عبرت عن امتنانك ${timePhrase}`;
      case EVENT_TYPES.FEAR:
        return `عندما تحدثت عن خوفك ${timePhrase}`;
      case EVENT_TYPES.JOY:
        return `لحظة السعادة التي شاركتها ${timePhrase}`;
      case EVENT_TYPES.SADNESS:
        return `عندما شعرت بالحزن ${timePhrase}`;
      case EVENT_TYPES.ANGER:
        return `عندما عبرت عن غضبك ${timePhrase}`;
      case EVENT_TYPES.SURPRISE:
        return `لحظة المفاجأة ${timePhrase}`;
      default:
        return `ذلك الوقت ${timePhrase} عندما تحدثنا`;
    }
  }
  
  /**
   * Get a human-readable time phrase for a timestamp
   * @param {number} timestamp - The timestamp
   * @returns {string} - A human-readable time phrase
   */
  getTimePhrase(timestamp) {
    const now = Date.now();
    const diffMs = now - timestamp;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'اليوم';
    } else if (diffDays === 1) {
      return 'بالأمس';
    } else if (diffDays < 7) {
      return `منذ ${diffDays} أيام`;
    } else if (diffDays < 30) {
      const diffWeeks = Math.floor(diffDays / 7);
      return `منذ ${diffWeeks} ${diffWeeks === 1 ? 'أسبوع' : 'أسابيع'}`;
    } else if (diffDays < 365) {
      const diffMonths = Math.floor(diffDays / 30);
      return `منذ ${diffMonths} ${diffMonths === 1 ? 'شهر' : 'أشهر'}`;
    } else {
      const diffYears = Math.floor(diffDays / 365);
      return `منذ ${diffYears} ${diffYears === 1 ? 'سنة' : 'سنوات'}`;
    }
  }
  
  /**
   * Extract keywords from a message
   * @param {string} message - The message to extract keywords from
   * @returns {Array} - Array of keywords
   */
  extractKeywords(message) {
    // Simple keyword extraction (in a real implementation, use NLP)
    const stopWords = ['و', 'أو', 'في', 'على', 'من', 'إلى', 'عن', 'مع', 'هذا', 'هذه', 'ذلك', 'تلك', 'هناك', 'هنا'];
    
    return message
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word))
      .slice(0, 10); // Limit to 10 keywords
  }
  
  /**
   * Update emotional themes based on a memory
   * @param {Object} memory - The memory to process
   */
  updateEmotionalThemes(memory) {
    // Extract emotion from memory
    const emotion = memory.emotion || 'neutral';
    
    // Update theme count
    this.emotionalThemes[emotion] = (this.emotionalThemes[emotion] || 0) + 1;
    
    // Update keywords for this emotion
    if (!this.emotionalThemes[`${emotion}_keywords`]) {
      this.emotionalThemes[`${emotion}_keywords`] = {};
    }
    
    // Count keyword occurrences for this emotion
    memory.keywords.forEach(keyword => {
      this.emotionalThemes[`${emotion}_keywords`][keyword] = 
        (this.emotionalThemes[`${emotion}_keywords`][keyword] || 0) + 1;
    });
  }
  
  /**
   * Rebuild emotional themes from all memories
   */
  rebuildEmotionalThemes() {
    this.emotionalThemes = {};
    
    this.narrativeMemories.forEach(memory => {
      this.updateEmotionalThemes(memory);
    });
  }
  
  /**
   * Save memories to semantic memory
   */
  saveMemories() {
    addSemanticMemory('narrativeMemories', this.narrativeMemories);
  }
  
  /**
   * Find memories related to a message
   * @param {string} message - The message to find related memories for
   * @param {string} emotion - The current emotion
   * @param {number} limit - Maximum number of memories to return
   * @returns {Array} - Array of related memories
   */
  findRelatedMemories(message, emotion = null, limit = 3) {
    if (!message || this.narrativeMemories.length === 0) {
      return [];
    }
    
    // Extract keywords from the message
    const keywords = this.extractKeywords(message);
    
    // Score each memory based on keyword overlap and emotional relevance
    const scoredMemories = this.narrativeMemories.map(memory => {
      // Calculate keyword overlap
      const keywordOverlap = memory.keywords.filter(k => keywords.includes(k)).length;
      
      // Calculate emotional relevance
      const emotionalRelevance = emotion && memory.emotion === emotion ? 2 : 0;
      
      // Calculate recency factor (more recent = higher score)
      const ageInDays = (Date.now() - memory.timestamp) / (1000 * 60 * 60 * 24);
      const recencyFactor = Math.max(0, 1 - (ageInDays / 365)); // Decay over a year
      
      // Calculate recall factor (less frequently recalled = higher score)
      const recallFactor = Math.max(0, 1 - (memory.recallCount / 10)); // Decay after 10 recalls
      
      // Calculate type relevance (some types are more relevant in certain contexts)
      const typeRelevance = this.recallFrequency[memory.type] || 0.5;
      
      // Calculate final score
      const score = (keywordOverlap * 2) + emotionalRelevance + (recencyFactor * 3) + 
                    (recallFactor * 2) + (typeRelevance * 2);
      
      return { memory, score };
    });
    
    // Sort by score and take the top 'limit' memories
    return scoredMemories
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.memory);
  }
  
  /**
   * Recall a memory based on current context
   * @param {string} message - The current message
   * @param {string} emotion - The current emotion
   * @returns {Object} - A recalled memory, or null if none found
   */
  recallMemory(message, emotion = null) {
    // Find related memories
    const relatedMemories = this.findRelatedMemories(message, emotion, 5);
    
    if (relatedMemories.length === 0) {
      return null;
    }
    
    // Choose a memory to recall (with some randomness)
    const randomFactor = Math.random();
    const chosenIndex = Math.min(
      Math.floor(randomFactor * randomFactor * relatedMemories.length),
      relatedMemories.length - 1
    );
    
    const memory = relatedMemories[chosenIndex];
    
    // Don't recall the same memory twice in a row
    if (memory.id === this.lastRecalledMemoryId) {
      // Try the next memory if available
      const nextIndex = (chosenIndex + 1) % relatedMemories.length;
      if (nextIndex !== chosenIndex) {
        memory = relatedMemories[nextIndex];
      }
    }
    
    // Update recall stats
    memory.recallCount += 1;
    memory.lastRecalled = Date.now();
    this.lastRecalledMemoryId = memory.id;
    
    // Save changes
    this.saveMemories();
    
    return memory;
  }
  
  /**
   * Generate a recall prompt for a memory
   * @param {Object} memory - The memory to generate a prompt for
   * @returns {string} - A recall prompt
   */
  generateRecallPrompt(memory) {
    if (!memory) return null;
    
    const promptTemplates = [
      `أتذكر ${memory.narrativeDescription}. هل تود أن أذكرك بكيفية تجاوزك لذلك؟`,
      `${memory.narrativeDescription}... هل تفكر في ذلك الآن؟`,
      `يذكرني هذا بـ ${memory.narrativeDescription}. هل ترى التشابه؟`,
      `لقد مررت بهذا من قبل ${memory.narrativeDescription}. هل تريد أن نتحدث عن ذلك؟`
    ];
    
    // Choose a random prompt template
    const template = promptTemplates[Math.floor(Math.random() * promptTemplates.length)];
    
    return template;
  }
  
  /**
   * Add user feedback to a memory
   * @param {string} memoryId - The ID of the memory
   * @param {Object} feedback - The feedback to add
   * @returns {boolean} - Whether the feedback was added successfully
   */
  addFeedbackToMemory(memoryId, feedback) {
    const memory = this.narrativeMemories.find(m => m.id === memoryId);
    if (!memory) {
      console.warn(`Memory not found: ${memoryId}`);
      return false;
    }
    
    memory.userFeedback = {
      ...feedback,
      timestamp: Date.now()
    };
    
    // Save changes
    this.saveMemories();
    
    return true;
  }
  
  /**
   * Get all memories of a specific type
   * @param {string} type - The type of memories to get
   * @returns {Array} - Array of memories of the specified type
   */
  getMemoriesByType(type) {
    return this.narrativeMemories.filter(memory => memory.type === type);
  }
  
  /**
   * Get all memories related to a specific emotion
   * @param {string} emotion - The emotion to filter by
   * @returns {Array} - Array of memories with the specified emotion
   */
  getMemoriesByEmotion(emotion) {
    return this.narrativeMemories.filter(memory => memory.emotion === emotion);
  }
  
  /**
   * Get emotional themes
   * @returns {Object} - Emotional themes
   */
  getEmotionalThemes() {
    return this.emotionalThemes;
  }
  
  /**
   * Detect the type of emotional event from a message
   * @param {string} message - The message to analyze
   * @param {string} emotion - The detected emotion
   * @returns {string} - The detected event type
   */
  detectEventType(message, emotion) {
    // Simple rule-based detection (in a real implementation, use NLP)
    const lowerMessage = message.toLowerCase();
    
    // Check for emotional disclosure
    if (/أشعر|مشاعر|عاطفة|قلق|خوف|حزن|سعادة|غضب/.test(lowerMessage)) {
      return EVENT_TYPES.EMOTIONAL_DISCLOSURE;
    }
    
    // Check for breakthrough
    if (/اكتشفت|فهمت|أدركت|وجدت الحل|نجحت أخيرًا|تغلبت|تجاوزت/.test(lowerMessage)) {
      return EVENT_TYPES.BREAKTHROUGH;
    }
    
    // Check for challenge
    if (/صعب|تحدي|مشكلة|عقبة|صعوبة|يصعب علي|أواجه/.test(lowerMessage)) {
      return EVENT_TYPES.CHALLENGE;
    }
    
    // Check for achievement
    if (/نجحت|أنجزت|حققت|إنجاز|فخور|سعيد بـ/.test(lowerMessage)) {
      return EVENT_TYPES.ACHIEVEMENT;
    }
    
    // Check for reflection
    if (/أفكر|أتأمل|أتساءل|ربما|أعتقد أن|يبدو لي|أتصور/.test(lowerMessage)) {
      return EVENT_TYPES.REFLECTION;
    }
    
    // Check for forgiveness
    if (/سامحت|غفرت|تجاوزت عن|قبلت|تصالحت|تسامح/.test(lowerMessage)) {
      return EVENT_TYPES.FORGIVENESS;
    }
    
    // Check for gratitude
    if (/شكرًا|ممتن|أقدر|أشكر|شاكر|امتنان/.test(lowerMessage)) {
      return EVENT_TYPES.GRATITUDE;
    }
    
    // Default to emotion-based type if available
    if (emotion) {
      switch (emotion) {
        case 'fear': return EVENT_TYPES.FEAR;
        case 'joy': case 'happy': return EVENT_TYPES.JOY;
        case 'sad': case 'sadness': return EVENT_TYPES.SADNESS;
        case 'anger': case 'angry': return EVENT_TYPES.ANGER;
        case 'surprise': return EVENT_TYPES.SURPRISE;
      }
    }
    
    // Default to emotional disclosure if no specific type detected
    return EVENT_TYPES.EMOTIONAL_DISCLOSURE;
  }
}

// Create singleton instance
const emotionalLoreSystem = new EmotionalLoreSystem();

// Initialize on import
emotionalLoreSystem.initialize();

export default emotionalLoreSystem;
export { EVENT_TYPES, INTENSITY_LEVELS };