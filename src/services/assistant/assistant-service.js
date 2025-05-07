/**
 * Assistant Service
 * 
 * This service encapsulates the functionality for the smart personal assistant.
 * It replaces the SmartPersonalAssistant class.
 */

export class AssistantService {
  constructor() {
    this.isInitialized = false;
    this.configService = null;
    this.apiService = null;
    this.emotionService = null;
    this.memoryService = null;
    this.voiceService = null;
    this.themeService = null;

    // User profile
    this.userProfile = {
      language: 'ar-SA',
      preferredDialect: 'khaliji',
      preferredTone: 'cheerful',
      preferredVoiceProfile: 'GULF_FEMALE_ARIA'
    };

    // System state
    this.messageCount = 0;
    this.failureCount = 0;
    this.systemState = {
      lastReflection: null,
      moodTrend: 'neutral',
      confidenceLevel: 0.8,
      systemLoad: 0.2
    };
  }

  /**
   * Get system adjustment for tone and pitch
   * @returns {Object} - System adjustment
   * @private
   */
  getSystemAdjustment() {
    // Get emotional context from memory service if available
    let dominantEmotion = 'neutral';
    let emotionalIntensity = 0.5;

    if (this.memoryService) {
      const context = this.memoryService.getContextSummary();
      dominantEmotion = context.dominantEmotion || 'neutral';
      emotionalIntensity = context.averageIntensity || 0.5;
    }

    // Map emotions to tones
    const emotionToTone = {
      happy: 'cheerful',
      sad: 'warm',
      angry: 'calm',
      surprised: 'curious',
      neutral: 'neutral',
      anxious: 'reassuring',
      confident: 'friendly'
    };

    // Calculate pitch based on emotional intensity
    const basePitch = 1.0;
    const pitchVariation = 0.3;
    const pitch = basePitch + (emotionalIntensity - 0.5) * pitchVariation;

    return {
      tone: emotionToTone[dominantEmotion] || 'neutral',
      pitch: Math.max(0.7, Math.min(1.3, pitch))
    };
  }

  /**
   * Reflect on internal state
   * @returns {Object} - Reflection result
   * @private
   */
  reflectInternalState() {
    if (!this.memoryService) {
      return null;
    }

    // Get emotional context
    const context = this.memoryService.getContextSummary();
    const emotionalTrend = this.memoryService.getEmotionalTrend();

    // Determine mood trend
    let moodTrend = 'neutral';
    if (emotionalTrend && emotionalTrend.length > 0) {
      moodTrend = emotionalTrend[0].trend || 'neutral';
    }

    // Store in system state
    this.systemState.moodTrend = moodTrend;

    // Generate reflection text
    let reflection = '';

    if (context.totalEntries < 5) {
      reflection = 'ما زلت أتعرف عليك، لكنني متحمس للمحادثة معك أكثر.';
    } else if (moodTrend === 'positive') {
      reflection = 'أشعر أن محادثتنا إيجابية ومفيدة. هذا يسعدني كثيراً.';
    } else if (moodTrend === 'negative') {
      reflection = 'أشعر أنك قد تكون متوتراً قليلاً. هل هناك شيء يمكنني مساعدتك به؟';
    } else {
      reflection = 'أستمتع بمحادثتنا وأتطلع إلى مساعدتك أكثر.';
    }

    // Store last reflection time
    this.systemState.lastReflection = new Date().toISOString();

    return {
      reflection,
      moodTrend,
      timestamp: this.systemState.lastReflection
    };
  }

  /**
   * Initialize the assistant service
   * @param {ConfigService} configService - Config service instance
   * @param {ApiService} apiService - API service instance
   * @param {EmotionService} emotionService - Emotion service instance
   * @param {MemoryService} memoryService - Memory service instance
   * @param {VoiceService} voiceService - Voice service instance
   * @param {ThemeService} themeService - Theme service instance
   * @returns {AssistantService} - This instance for chaining
   */
  initialize(
    configService,
    apiService,
    emotionService,
    memoryService,
    voiceService,
    themeService
  ) {
    if (this.isInitialized) return this;

    this.configService = configService;
    this.apiService = apiService;
    this.emotionService = emotionService;
    this.memoryService = memoryService;
    this.voiceService = voiceService;
    this.themeService = themeService;

    // Initialize user profile from config
    this.userProfile = {
      language: configService.get('assistant.language', 'ar-SA'),
      preferredDialect: configService.get('assistant.defaultDialect', 'khaliji'),
      preferredTone: configService.get('assistant.defaultTone', 'cheerful'),
      preferredVoiceProfile: configService.get('assistant.defaultVoiceProfile', 'GULF_FEMALE_ARIA')
    };

    this.isInitialized = true;
    console.log("✅ Assistant service initialized");
    return this;
  }

  /**
   * Set the user profile
   * @param {Object} profile - User profile
   */
  setUserProfile(profile) {
    this.userProfile = {
      ...this.userProfile,
      ...profile
    };
  }

  /**
   * Get the user profile
   * @returns {Object} - User profile
   */
  getUserProfile() {
    return { ...this.userProfile };
  }

  /**
   * Handle a user message
   * @param {string} message - User message
   * @param {boolean} isVoice - Whether the message is from voice input
   * @returns {Promise<Object>} - Response object
   */
  async handleUserMessage(message, isVoice = false) {
    this.messageCount++;

    // Detect emotion from the message
    const emotion = this.emotionService.detectEmotionFromText(message);

    // Store in memory
    this.memoryService.storeUserMessage(message, emotion);

    // Check for self-reflection trigger
    if (this.messageCount % 5 === 0 || (emotion && emotion.confidence > 0.75)) {
      await this.performSelfReflection(emotion);
    }

    // Get system adjustment for tone and pitch
    const { tone, pitch } = this.getSystemAdjustment();

    // Create user profile for API request
    const userProfile = {
      preferredTone: tone,
      preferredVoiceProfile: this.userProfile.preferredVoiceProfile,
      language: this.userProfile.language,
      emotionalState: emotion.type,
      emotionalIntensity: emotion.confidence
    };

    // Generate response using API service
    console.log('🚀 Sending request to API service');
    const apiResponse = await this.apiService.sendPrompt(message, userProfile);

    let responseText;
    let responseModel = 'default';

    if (apiResponse.success) {
      responseText = apiResponse.result || apiResponse.response;
      responseModel = apiResponse.metadata?.model || 'default';
      console.log(`✅ Response generated using model: ${responseModel}`);
    } else {
      // Fallback to simple response if API fails
      console.warn('⚠️ API service failed, using simple fallback response');
      responseText = `أنت قلت: ${message}`;
    }

    // Apply dynamic styling if available
    if (this.themeService) {
      responseText = this.themeService.applyDynamicStyling(responseText, emotion.type);
    }

    // Speak the response
    if (this.voiceService) {
      this.voiceService.speakReply(responseText, tone, this.userProfile.preferredVoiceProfile);
    }

    // Store in memory
    this.memoryService.storeAssistantResponse(responseText, tone, responseModel);

    return {
      text: responseText,
      emotion,
      tone,
      pitch,
      model: responseModel
    };
  }

  /**
   * Perform self-reflection
   * @param {Object} emotion - Detected emotion
   * @private
   */
  async performSelfReflection(emotion) {
    const reflection = this.reflectInternalState();
    if (reflection && reflection.reflection) {
      console.log('[Self-Reflection]', reflection.reflection);

      // Speak the reflection if voice service is available
      if (this.voiceService) {
        await this.voiceService.speakReply(
          reflection.reflection,
          reflection.moodTrend || 'neutral',
          this.userProfile.preferredVoiceProfile
        );
      }
    }
  }

  /**
   * Get context summary
   * @returns {Object} - Context summary
   */
  getContextSummary() {
    if (this.memoryService) {
      return this.memoryService.getContextSummary();
    }
    return { lastEmotion: 'neutral', dominantEmotion: 'neutral', totalEntries: 0 };
  }

  /**
   * Get emotional mood summary
   * @returns {string} - Emotional mood summary
   */
  getEmotionalMoodSummary() {
    if (this.memoryService) {
      return this.memoryService.getEmotionalMoodSummary();
    }
    return 'لا مزاج واضح بعد';
  }

  /**
   * Get emotional trend
   * @returns {Array} - Emotional trend
   */
  getEmotionalTrend() {
    if (this.memoryService) {
      return this.memoryService.getEmotionalTrend();
    }
    return [];
  }
}
