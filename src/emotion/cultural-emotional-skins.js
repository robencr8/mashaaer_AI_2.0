/**
 * Mashaaer Enhanced Project
 * Cultural Emotional Skins Module
 *
 * This module provides cultural adaptation for emotional expressions,
 * adjusting not only language but emotional etiquette per culture.
 */

// Cultural profiles with emotional etiquette rules
const culturalProfiles = {
  // Gulf Arabic: more formal, respectful expressions
  gulfArabic: {
    id: 'gulf',
    name: 'الخليجي',
    formalityLevel: 'high',
    emotionalExpression: 'moderate',
    respectMarkers: true,
    honorifics: true,
    directness: 'moderate',
    emotionalModifiers: {
      joy: 1.0,      // Standard expression
      sadness: 0.7,  // Somewhat restrained
      anger: 0.5,    // More restrained
      excitement: 0.8 // Slightly restrained
    },
    greetings: [
      'السلام عليكم',
      'هلا والله',
      'مرحبا بك'
    ],
    farewells: [
      'مع السلامة',
      'الله يحفظك',
      'في أمان الله'
    ],
    respectPhrases: [
      'حفظك الله',
      'الله يعزك',
      'بارك الله فيك'
    ],
    uiGestures: {
      greeting: 'slight_bow',
      agreement: 'hand_to_chest',
      farewell: 'hand_wave'
    }
  },
  
  // Egyptian Arabic: more humor and informal warmth
  egyptianArabic: {
    id: 'egyptian',
    name: 'المصري',
    formalityLevel: 'low',
    emotionalExpression: 'high',
    respectMarkers: false,
    honorifics: false,
    directness: 'high',
    emotionalModifiers: {
      joy: 1.2,      // Enhanced expression
      sadness: 0.9,  // Slightly restrained
      anger: 0.8,    // Somewhat restrained
      excitement: 1.3 // Enhanced expression
    },
    greetings: [
      'أهلاً بيك',
      'إزيك',
      'عامل إيه'
    ],
    farewells: [
      'مع السلامة',
      'خلي بالك من نفسك',
      'هشوفك بعدين'
    ],
    humorPhrases: [
      'بجد؟ ده أنت فنان!',
      'يا سلام عليك',
      'حلوة دي'
    ],
    uiGestures: {
      greeting: 'enthusiastic_wave',
      agreement: 'thumbs_up',
      farewell: 'big_smile'
    }
  },
  
  // Jordanian/Levantine: balanced politeness and emotion
  levantineArabic: {
    id: 'levantine',
    name: 'الشامي',
    formalityLevel: 'medium',
    emotionalExpression: 'moderate',
    respectMarkers: true,
    honorifics: false,
    directness: 'moderate',
    emotionalModifiers: {
      joy: 1.1,      // Slightly enhanced
      sadness: 0.8,  // Somewhat restrained
      anger: 0.7,    // More restrained
      excitement: 1.0 // Standard expression
    },
    greetings: [
      'مرحبا',
      'كيفك',
      'شلونك'
    ],
    farewells: [
      'مع السلامة',
      'الله معك',
      'بتشوفك'
    ],
    politePhrases: [
      'تكرم',
      'يسلمو',
      'الله يخليك'
    ],
    uiGestures: {
      greeting: 'warm_smile',
      agreement: 'gentle_nod',
      farewell: 'hand_to_heart'
    }
  },
  
  // English (Western): Direct but kind
  westernEnglish: {
    id: 'western',
    name: 'Western English',
    formalityLevel: 'low',
    emotionalExpression: 'moderate',
    respectMarkers: false,
    honorifics: false,
    directness: 'high',
    emotionalModifiers: {
      joy: 1.0,      // Standard expression
      sadness: 1.0,  // Standard expression
      anger: 0.9,    // Slightly restrained
      excitement: 1.0 // Standard expression
    },
    greetings: [
      'Hello',
      'Hi there',
      'Hey'
    ],
    farewells: [
      'Goodbye',
      'Take care',
      'See you later'
    ],
    casualPhrases: [
      'No problem',
      'Sure thing',
      'Sounds good'
    ],
    uiGestures: {
      greeting: 'wave',
      agreement: 'nod',
      farewell: 'smile'
    }
  },
  
  // Asian (e.g. Urdu, Hindi): More nuanced, indirect expression
  southAsian: {
    id: 'southAsian',
    name: 'South Asian',
    formalityLevel: 'high',
    emotionalExpression: 'low',
    respectMarkers: true,
    honorifics: true,
    directness: 'low',
    emotionalModifiers: {
      joy: 0.8,      // Restrained
      sadness: 0.6,  // More restrained
      anger: 0.4,    // Highly restrained
      excitement: 0.7 // Restrained
    },
    greetings: [
      'Namaste',
      'Assalamu alaikum',
      'Adaab'
    ],
    farewells: [
      'Khuda hafiz',
      'Phir milenge',
      'Alvida'
    ],
    respectPhrases: [
      'Aap ki meherbani',
      'Bahut shukriya',
      'Aapka ehsaan'
    ],
    uiGestures: {
      greeting: 'namaste_hands',
      agreement: 'respectful_nod',
      farewell: 'slight_bow'
    }
  }
};

/**
 * Cultural Emotional Skins Manager
 * Manages cultural adaptation of emotional expressions
 */
class CulturalEmotionalSkins {
  constructor() {
    this.currentCulture = 'gulfArabic'; // Default culture
    this.profiles = culturalProfiles;
    this.userPreferences = {
      adaptationLevel: 'full', // 'none', 'minimal', 'moderate', 'full'
      preferredCulture: null,
      overrides: {}
    };
  }
  
  /**
   * Set the current cultural skin
   * @param {string} cultureId - The ID of the culture to set
   * @returns {boolean} - Whether the culture was set successfully
   */
  setCulture(cultureId) {
    if (this.profiles[cultureId]) {
      this.currentCulture = cultureId;
      console.log(`Cultural skin set to: ${this.profiles[cultureId].name}`);
      return true;
    }
    
    console.warn(`Unknown cultural skin: ${cultureId}`);
    return false;
  }
  
  /**
   * Get the current cultural profile
   * @returns {Object} - The current cultural profile
   */
  getCurrentProfile() {
    return this.profiles[this.currentCulture];
  }
  
  /**
   * Get all available cultural profiles
   * @returns {Object} - All available cultural profiles
   */
  getAvailableProfiles() {
    return Object.keys(this.profiles).map(key => ({
      id: key,
      name: this.profiles[key].name
    }));
  }
  
  /**
   * Set user preferences for cultural adaptation
   * @param {Object} preferences - User preferences
   */
  setUserPreferences(preferences) {
    if (preferences.adaptationLevel) {
      this.userPreferences.adaptationLevel = preferences.adaptationLevel;
    }
    
    if (preferences.preferredCulture) {
      this.userPreferences.preferredCulture = preferences.preferredCulture;
      // Automatically switch to preferred culture if specified
      if (this.profiles[preferences.preferredCulture]) {
        this.currentCulture = preferences.preferredCulture;
      }
    }
    
    if (preferences.overrides) {
      this.userPreferences.overrides = {
        ...this.userPreferences.overrides,
        ...preferences.overrides
      };
    }
  }
  
  /**
   * Adapt an emotional expression based on cultural context
   * @param {string} text - The text to adapt
   * @param {string} emotion - The emotion being expressed
   * @param {number} intensity - The original intensity of the emotion (0-1)
   * @returns {Object} - The adapted expression with text and modified intensity
   */
  adaptExpression(text, emotion, intensity = 0.5) {
    const profile = this.profiles[this.currentCulture];
    if (!profile) {
      return { text, intensity };
    }
    
    // Skip adaptation if set to none
    if (this.userPreferences.adaptationLevel === 'none') {
      return { text, intensity };
    }
    
    // Apply emotional modifiers based on culture
    let modifiedIntensity = intensity;
    if (profile.emotionalModifiers[emotion]) {
      modifiedIntensity = intensity * profile.emotionalModifiers[emotion];
      // Ensure intensity stays within bounds
      modifiedIntensity = Math.max(0, Math.min(1, modifiedIntensity));
    }
    
    // Apply minimal adaptations (just intensity)
    if (this.userPreferences.adaptationLevel === 'minimal') {
      return { text, intensity: modifiedIntensity };
    }
    
    // Apply moderate adaptations (intensity + greetings/farewells)
    let adaptedText = text;
    
    // Replace generic greetings with cultural ones
    const genericGreetings = ['hello', 'hi', 'greetings', 'مرحبا', 'أهلا', 'السلام عليكم'];
    const startsWithGreeting = genericGreetings.some(greeting => 
      text.toLowerCase().startsWith(greeting)
    );
    
    if (startsWithGreeting && profile.greetings && profile.greetings.length > 0) {
      const culturalGreeting = profile.greetings[Math.floor(Math.random() * profile.greetings.length)];
      adaptedText = adaptedText.replace(/^(hello|hi|greetings|مرحبا|أهلا|السلام عليكم)/i, culturalGreeting);
    }
    
    // Replace generic farewells with cultural ones
    const genericFarewells = ['goodbye', 'bye', 'farewell', 'مع السلامة', 'وداعا'];
    const endsWithFarewell = genericFarewells.some(farewell => 
      text.toLowerCase().endsWith(farewell)
    );
    
    if (endsWithFarewell && profile.farewells && profile.farewells.length > 0) {
      const culturalFarewell = profile.farewells[Math.floor(Math.random() * profile.farewells.length)];
      adaptedText = adaptedText.replace(/(goodbye|bye|farewell|مع السلامة|وداعا)$/i, culturalFarewell);
    }
    
    // For full adaptation, add cultural markers and adjust formality
    if (this.userPreferences.adaptationLevel === 'full') {
      // Add respect markers for cultures that use them
      if (profile.respectMarkers && profile.respectPhrases && profile.respectPhrases.length > 0) {
        // Add a respect phrase with 30% probability if not already present
        const hasRespectPhrase = profile.respectPhrases.some(phrase => adaptedText.includes(phrase));
        if (!hasRespectPhrase && Math.random() < 0.3) {
          const respectPhrase = profile.respectPhrases[Math.floor(Math.random() * profile.respectPhrases.length)];
          adaptedText = `${respectPhrase}، ${adaptedText}`;
        }
      }
      
      // Add humor for cultures that use it
      if (emotion === 'joy' && profile.humorPhrases && profile.humorPhrases.length > 0) {
        // Add a humor phrase with 20% probability if emotion is joy
        if (Math.random() < 0.2) {
          const humorPhrase = profile.humorPhrases[Math.floor(Math.random() * profile.humorPhrases.length)];
          adaptedText = `${adaptedText} ${humorPhrase}`;
        }
      }
    }
    
    return { 
      text: adaptedText, 
      intensity: modifiedIntensity,
      uiGesture: this.getAppropriateGesture(emotion)
    };
  }
  
  /**
   * Get an appropriate UI gesture based on emotion and cultural context
   * @param {string} emotion - The emotion being expressed
   * @returns {string} - The appropriate UI gesture
   */
  getAppropriateGesture(emotion) {
    const profile = this.profiles[this.currentCulture];
    if (!profile || !profile.uiGestures) {
      return 'neutral';
    }
    
    // Map emotions to gesture types
    let gestureType;
    switch (emotion) {
      case 'joy':
      case 'happiness':
      case 'excited':
        return profile.uiGestures.greeting || 'smile';
      case 'agreement':
      case 'approval':
        return profile.uiGestures.agreement || 'nod';
      case 'sadness':
      case 'farewell':
        return profile.uiGestures.farewell || 'wave';
      default:
        return 'neutral';
    }
  }
  
  /**
   * Detect the likely cultural context from text
   * @param {string} text - The text to analyze
   * @returns {string} - The detected cultural context ID
   */
  detectCulturalContext(text) {
    // Simple detection based on language patterns
    // In a real implementation, this would use more sophisticated NLP
    
    // Check for Gulf Arabic patterns
    if (/هلا والله|مشكور|يعطيك العافية|الله يسلمك/.test(text)) {
      return 'gulfArabic';
    }
    
    // Check for Egyptian Arabic patterns
    if (/إزيك|إزاي|عامل إيه|بجد/.test(text)) {
      return 'egyptianArabic';
    }
    
    // Check for Levantine patterns
    if (/كيفك|شلونك|يسلمو|منيح/.test(text)) {
      return 'levantineArabic';
    }
    
    // Check for English patterns
    if (/hello|thanks|please|sorry/.test(text)) {
      return 'westernEnglish';
    }
    
    // Check for South Asian patterns
    if (/namaste|shukriya|aap|jee/.test(text)) {
      return 'southAsian';
    }
    
    // Default to current culture if no match
    return this.currentCulture;
  }
}

// Create singleton instance
const culturalSkins = new CulturalEmotionalSkins();

export default culturalSkins;