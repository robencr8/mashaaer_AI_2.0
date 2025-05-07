/**
 * Mashaaer Enhanced Project
 * Emotion Intelligence Module
 *
 * This module provides advanced emotional intelligence capabilities:
 * - Context Engine: Tracks user input and emotions, maintains context history
 * - Personality Engine: Manages different response styles/tones
 * - Emotional Memory: Captures and analyzes emotional trends
 */

// 🧠 Context Engine (الوعي السياقي)
export class ContextEngine {
  constructor() {
    this.contextHistory = [];
    this.currentEmotion = 'neutral';
    this.previousTopic = null;
  }

  updateContext(input, emotion) {
    this.contextHistory.push({ input, emotion, time: new Date().toISOString() });
    this.currentEmotion = emotion;
  }

  getLastEmotion() {
    return this.contextHistory.length > 0
      ? this.contextHistory[this.contextHistory.length - 1].emotion
      : 'neutral';
  }

  getSummary() {
    const emotions = this.contextHistory.map(e => e.emotion);
    const dominant = emotions.sort((a,b) =>
      emotions.filter(v => v === a).length - emotions.filter(v => v === b).length
    ).pop();
    return {
      lastEmotion: this.getLastEmotion(),
      dominantEmotion: dominant || 'neutral',
      totalEntries: this.contextHistory.length
    };
  }
}

// 🌟 Adaptive Personality Engine (الشخصية المتطورة)
export class PersonalityEngine {
  constructor() {
    this.mode = 'friendly'; // Default mode
    this.previousMode = null; // Track previous mode for blending
    this.blendedModes = null; // Track blended modes
    this.blendRatio = 0.5; // Default blend ratio
    this.userPersona = null; // Store user persona from user-style-engine
    this.customPersonas = {}; // Store custom user-trained personas

    // Standard personality traits
    this.traits = {
      friendly: {
        prefix: '😊 صديقي، ',
        style: 'بأسلوب خفيف وبسيط',
        emotionalTone: 'warm',
        responseLength: 'medium',
        questionFrequency: 'moderate'
      },
      formal: {
        prefix: 'حضرتك، ',
        style: 'بلغة رسمية محترمة',
        emotionalTone: 'neutral',
        responseLength: 'medium',
        questionFrequency: 'low'
      },
      poetic: {
        prefix: 'يا رفيق الروح، ',
        style: 'بنبرة شاعرية حساسة',
        emotionalTone: 'reflective',
        responseLength: 'long',
        questionFrequency: 'low'
      },
      deep: {
        prefix: '🤔 تأمل معي، ',
        style: 'بأسلوب فلسفي عميق',
        emotionalTone: 'thoughtful',
        responseLength: 'long',
        questionFrequency: 'high'
      },
      coach: {
        prefix: '💪 ',
        style: 'بأسلوب تحفيزي وحازم',
        emotionalTone: 'energetic',
        responseLength: 'short',
        questionFrequency: 'high'
      },
      mirror: {
        prefix: '',
        style: 'بأسلوب يعكس أسلوبك',
        emotionalTone: 'mirrored',
        responseLength: 'mirrored',
        questionFrequency: 'mirrored'
      },
      empath: {
        prefix: '🫂 ',
        style: 'بأسلوب متعاطف وداعم',
        emotionalTone: 'compassionate',
        responseLength: 'medium',
        questionFrequency: 'moderate'
      }
    };
  }

  /**
   * Set the personality mode
   * @param {string} mode - The personality mode to set
   * @returns {boolean} - Whether the mode was set successfully
   */
  setMode(mode) {
    // Handle special command format: /switch mode
    if (mode.startsWith('/switch ')) {
      mode = mode.replace('/switch ', '');
    }

    // Handle blend mode format: /blend mode1 + mode2
    if (mode.startsWith('/blend ')) {
      return this.setBlendedMode(mode);
    }

    // Save previous mode before changing
    this.previousMode = this.mode;

    // Reset blended modes
    this.blendedModes = null;

    // Check if mode exists in standard traits or custom personas
    if (this.traits[mode]) {
      this.mode = mode;
      console.log(`Personality mode set to: ${mode}`);
      return true;
    } else if (this.customPersonas[mode]) {
      this.mode = mode;
      console.log(`Custom personality mode set to: ${mode}`);
      return true;
    }

    console.warn(`Unknown personality mode: ${mode}`);
    return false;
  }

  /**
   * Set a blended personality mode
   * @param {string} blendCommand - The blend command (e.g., "/blend poet + empath")
   * @returns {boolean} - Whether the blended mode was set successfully
   */
  setBlendedMode(blendCommand) {
    // Parse the blend command
    const blendParts = blendCommand.replace('/blend ', '').split('+').map(part => part.trim());

    if (blendParts.length !== 2) {
      console.warn('Blend command must have exactly two personality modes');
      return false;
    }

    const [mode1, mode2] = blendParts;

    // Check if both modes exist
    if (!this.traits[mode1] && !this.customPersonas[mode1]) {
      console.warn(`Unknown personality mode: ${mode1}`);
      return false;
    }

    if (!this.traits[mode2] && !this.customPersonas[mode2]) {
      console.warn(`Unknown personality mode: ${mode2}`);
      return false;
    }

    // Set blended modes
    this.blendedModes = [mode1, mode2];
    this.previousMode = this.mode;
    this.mode = 'blended';

    console.log(`Personality mode set to blended: ${mode1} + ${mode2}`);
    return true;
  }

  /**
   * Create a custom persona based on input samples
   * @param {string} name - The name of the custom persona
   * @param {Object} config - Configuration for the custom persona
   * @returns {boolean} - Whether the persona was created successfully
   */
  createCustomPersona(name, config) {
    if (!name || typeof name !== 'string') {
      console.warn('Invalid persona name');
      return false;
    }

    // Create a new custom persona
    this.customPersonas[name] = {
      prefix: config.prefix || '',
      style: config.style || `بأسلوب ${name}`,
      emotionalTone: config.emotionalTone || 'neutral',
      responseLength: config.responseLength || 'medium',
      questionFrequency: config.questionFrequency || 'moderate',
      samples: config.samples || [],
      created: Date.now(),
      lastUsed: null
    };

    console.log(`Custom persona created: ${name}`);
    return true;
  }

  /**
   * Add a sample to a custom persona
   * @param {string} personaName - The name of the custom persona
   * @param {string} sample - The sample text
   * @returns {boolean} - Whether the sample was added successfully
   */
  addPersonaSample(personaName, sample) {
    if (!this.customPersonas[personaName]) {
      console.warn(`Custom persona not found: ${personaName}`);
      return false;
    }

    this.customPersonas[personaName].samples.push({
      text: sample,
      added: Date.now()
    });

    console.log(`Sample added to persona: ${personaName}`);
    return true;
  }

  /**
   * Get all available personality modes
   * @returns {Object} - All available personality modes
   */
  getAvailableModes() {
    const standardModes = Object.keys(this.traits);
    const customModes = Object.keys(this.customPersonas);

    return {
      standard: standardModes,
      custom: customModes,
      current: this.mode,
      blended: this.blendedModes
    };
  }

  /**
   * Apply the current personality tone to a response
   * @param {string} response - The response to format
   * @returns {string} - The formatted response
   */
  applyTone(response) {
    // Handle blended mode
    if (this.mode === 'blended' && this.blendedModes && this.blendedModes.length === 2) {
      return this.applyBlendedTone(response, this.blendedModes[0], this.blendedModes[1]);
    }

    // Get the trait object (either from standard traits or custom personas)
    const trait = this.traits[this.mode] || this.customPersonas[this.mode] || this.traits.friendly;

    // Handle mirror mode specially
    if (this.mode === 'mirror' && this.userPersona) {
      return this.applyMirrorTone(response);
    }

    // Format the response with the trait's prefix and style
    let formattedResponse = `${trait.prefix}${response}`;

    // Add style indicator for debugging (can be removed in production)
    if (process.env.NODE_ENV === 'development') {
      formattedResponse += ` (${trait.style})`;
    }

    // Add a question at the end based on question frequency
    if (this.shouldAddQuestion(trait.questionFrequency)) {
      formattedResponse += ' هل ترغب أن أشرح أكثر؟';
    }

    // Update last used timestamp for custom personas
    if (this.customPersonas[this.mode]) {
      this.customPersonas[this.mode].lastUsed = Date.now();
    }

    return formattedResponse;
  }

  /**
   * Apply a blended tone from two personality modes
   * @param {string} response - The response to format
   * @param {string} mode1 - The first personality mode
   * @param {string} mode2 - The second personality mode
   * @returns {string} - The formatted response
   */
  applyBlendedTone(response, mode1, mode2) {
    // Get trait objects for both modes
    const trait1 = this.traits[mode1] || this.customPersonas[mode1] || this.traits.friendly;
    const trait2 = this.traits[mode2] || this.customPersonas[mode2] || this.traits.friendly;

    // Blend prefixes (use first mode's prefix)
    const prefix = trait1.prefix;

    // Format the response with blended style
    let formattedResponse = `${prefix}${response}`;

    // Add style indicator for debugging (can be removed in production)
    if (process.env.NODE_ENV === 'development') {
      formattedResponse += ` (مزيج من ${trait1.style} و ${trait2.style})`;
    }

    // Blend question frequency
    const blendedFrequency = this.blendTraitValues(
      trait1.questionFrequency, 
      trait2.questionFrequency
    );

    // Add a question based on blended frequency
    if (this.shouldAddQuestion(blendedFrequency)) {
      formattedResponse += ' هل ترغب أن أشرح أكثر؟';
    }

    return formattedResponse;
  }

  /**
   * Apply a mirrored tone based on user persona
   * @param {string} response - The response to format
   * @returns {string} - The formatted response
   */
  applyMirrorTone(response) {
    // If no user persona is available, use friendly mode as fallback
    if (!this.userPersona) {
      return this.traits.friendly.prefix + response;
    }

    // Mirror the user's style
    let formattedResponse = response;

    // Mirror question frequency
    if (this.userPersona.questionFrequency === 'high') {
      formattedResponse += ' ما رأيك؟';
    }

    return formattedResponse;
  }

  /**
   * Blend two trait values
   * @param {string|number} value1 - The first trait value
   * @param {string|number} value2 - The second trait value
   * @returns {string|number} - The blended trait value
   */
  blendTraitValues(value1, value2) {
    // Handle special case for 'mirrored'
    if (value1 === 'mirrored' || value2 === 'mirrored') {
      return this.userPersona ? 'mirrored' : 'moderate';
    }

    // Handle numeric values
    if (typeof value1 === 'number' && typeof value2 === 'number') {
      return value1 * this.blendRatio + value2 * (1 - this.blendRatio);
    }

    // Handle string values for question frequency
    const frequencyMap = {
      'low': 0.2,
      'moderate': 0.5,
      'high': 0.8
    };

    if (frequencyMap[value1] !== undefined && frequencyMap[value2] !== undefined) {
      const blendedValue = frequencyMap[value1] * this.blendRatio + 
                          frequencyMap[value2] * (1 - this.blendRatio);

      // Convert back to string
      if (blendedValue < 0.35) return 'low';
      if (blendedValue < 0.65) return 'moderate';
      return 'high';
    }

    // Default to first value if blending isn't possible
    return value1;
  }

  /**
   * Determine if a question should be added based on frequency
   * @param {string} frequency - The question frequency ('low', 'moderate', 'high', or 'mirrored')
   * @returns {boolean} - Whether a question should be added
   */
  shouldAddQuestion(frequency) {
    if (frequency === 'mirrored' && this.userPersona) {
      // Mirror the user's question frequency
      frequency = this.userPersona.questionFrequency || 'moderate';
    }

    // Probability based on frequency
    const probability = {
      'low': 0.2,
      'moderate': 0.5,
      'high': 0.8
    }[frequency] || 0.5;

    return Math.random() < probability;
  }
}

// 🧬 Emotional Memory (ذاكرة عاطفية)
export class EmotionalMemory {
  constructor() {
    this.snapshots = [];
    this.userPersona = null; // Store user persona from user-style-engine
  }

  capture(input, emotion) {
    this.snapshots.push({ input, emotion, time: new Date().toISOString() });
  }

  getLastSnapshot() {
    return this.snapshots.at(-1);
  }

  getEmotionalTrend() {
    const stats = this.snapshots.reduce((acc, e) => {
      acc[e.emotion] = (acc[e.emotion] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(stats).sort((a, b) => b[1] - a[1]);
  }

  summarizeMood() {
    const trend = this.getEmotionalTrend();
    return trend.length ? `أغلب مشاعرك كانت: ${trend[0][0]}` : 'لا مزاج واضح بعد';
  }
}
