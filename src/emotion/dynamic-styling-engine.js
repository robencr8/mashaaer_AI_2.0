/**
 * Mashaaer Enhanced Project
 * Dynamic Styling Engine
 *
 * This module provides dynamic styling capabilities based on:
 * - Language detection
 * - Emotional context
 * - User preferences
 * - Cultural context
 * 
 * Features:
 * - Adaptive Emotion Engine: Adjusts response style based on user's emotional state
 * - Silent Awareness Mode: Detects inactivity and shows awareness messages
 * - Contextual Personality Adjustment: Adjusts tone based on conversation context
 * - Emotional Memory: Remembers sensitive topics to avoid
 * - Honest Moment Prompts: Periodically asks emotional questions
 */

export class DynamicStylingEngine {
  constructor() {
    this.currentStyle = {
      fontFamily: 'Cairo',
      fontSize: '1rem',
      direction: 'rtl',
      emojis: true,
      tone: 'friendly',
      language: 'ar'
    };

    // For Adaptive Emotion Engine
    this.emotionMappings = {
      sad: { tone: 'deep', fontSize: '0.95rem', speed: 'slow' },
      happy: { tone: 'friendly', fontSize: '1.2rem', speed: 'normal' },
      anxious: { tone: 'calm', fontSize: '1rem', speed: 'slow' },
      neutral: { tone: 'friendly', fontSize: '1rem', speed: 'normal' },
      confident: { tone: 'friendly', fontSize: '1.1rem', speed: 'normal' }
    };

    // For Silent Awareness Mode
    this.silenceTimer = null;
    this.silenceTimeout = 45000; // 45 seconds

    // For Emotional Memory
    this.avoidTopics = [];

    // For Honest Moment Prompts
    this.honestMomentTimer = null;
    this.honestMomentTimeout = 300000; // 5 minutes
    this.honestMomentPrompts = [
      "شو الشي اللي تعبك اليوم بصمت؟",
      "مين اشتقتله وما حكيت؟",
      "لو في شي بخاطرك... أنا سامعك حتى لو ما حكيته.",
      "أحيانًا الكلام الصادق هو أصعب شيء... شو بتحب تقول اليوم؟",
      "شو أكثر شي بيخليك تبتسم من قلبك؟"
    ];

    // For Self-Regulation Prompts
    this.selfRegulationTimer = null;
    this.selfRegulationTimeout = 180000; // 3 minutes
    this.lastEmotionState = 'neutral';
    this.emotionThreshold = 3; // Number of consecutive negative emotions to trigger
    this.negativeEmotionCount = 0;

    // Self-regulation prompts by emotion type
    this.selfRegulationPrompts = {
      sad: [
        "أتفهم شعورك بالحزن. هل تود أن تأخذ نفساً عميقاً معي؟ شهيق... زفير...",
        "عندما نشعر بالحزن، يمكن أن يساعدنا التفكير بذكرى جميلة. هل يمكنك مشاركتي بذكرى سعيدة؟",
        "الحزن جزء طبيعي من الحياة. ماذا يساعدك عادة عندما تشعر هكذا؟",
        "لنحاول تمرين بسيط: اذكر ثلاثة أشياء تشعر بالامتنان لها رغم الحزن الذي تشعر به الآن"
      ],
      angry: [
        "أشعر أنك قد تكون غاضباً. هل تريد أن نعد معاً حتى 10 ببطء لتهدئة الأفكار؟",
        "الغضب طاقة قوية. ما رأيك أن نحولها لشيء إيجابي؟ ما هو الشيء الذي يمكنك فعله الآن ليساعدك؟",
        "عندما نغضب، أجسادنا تتوتر. جرب أن ترخي كتفيك وتأخذ نفساً عميقاً. هل تشعر بالفرق؟",
        "الغضب غالباً يخفي مشاعر أخرى تحته. هل يمكنك التفكير بما قد يكون وراء غضبك؟"
      ],
      anxious: [
        "أشعر بقليل من التوتر في كلماتك. دعنا نتنفس معاً: خذ نفساً عميقاً لمدة 4 ثوانٍ، احبسه لـ 4، ثم أخرجه لـ 6 ثوانٍ",
        "عندما نشعر بالقلق، يساعدنا التركيز على اللحظة الحالية. ما هي 3 أشياء يمكنك رؤيتها حولك الآن؟",
        "القلق يجعلنا نفكر في المستقبل. دعنا نعود للحظة الحالية: ما الذي تستطيع سماعه الآن من حولك؟",
        "جرب هذا التمرين: اضغط بقدميك على الأرض واشعر بالاتصال بها. كيف تشعر الآن؟"
      ],
      neutral: [
        "كيف تشعر في هذه اللحظة؟ خذ وقتك للتفكير قبل الإجابة",
        "هل جربت التأمل من قبل؟ يمكننا أن نجرب تمريناً بسيطاً معاً إذا أردت",
        "الوعي بمشاعرنا يساعدنا على فهمها. هل تستطيع وصف شعورك الحالي بكلمة واحدة؟",
        "التنفس العميق يساعد على الاسترخاء. جرب أن تأخذ 3 أنفاس عميقة ببطء"
      ]
    };
  }

  detectLanguage(text) {
    if (/^[a-zA-Z0-9\s.,!?]+$/.test(text)) return 'en';
    if (/\p{Script=Arabic}/u.test(text)) return 'ar';
    return 'auto';
  }

  /**
   * Adjusts styling based on text, tone, and emotion
   * Part of the Adaptive Emotion Engine feature
   */
  adjust({ text = '', tone = 'friendly', emotion = 'neutral' }) {
    const lang = this.detectLanguage(text);

    // Apply emotion-based adjustments (Adaptive Emotion Engine)
    const emotionSettings = this.emotionMappings[emotion] || this.emotionMappings.neutral;

    // If emotion is sad, override tone to be deep/calm
    if (emotion === 'sad' && tone !== 'deep') {
      tone = emotionSettings.tone;
    }

    // If emotion is happy, make tone more friendly/cheerful
    if (emotion === 'happy' && tone === 'formal') {
      tone = emotionSettings.tone;
    }

    const fontFamily = lang === 'en'
      ? 'Segoe UI'
      : tone === 'poetic'
        ? 'Playfair Display'
        : 'Cairo';

    const fontSize = emotionSettings.fontSize || 
      (emotion === 'happy'
        ? '1.2rem'
        : emotion === 'sad'
          ? '0.95rem'
          : '1rem');

    const emojis = ['friendly', 'poetic'].includes(tone);
    const direction = lang === 'en' ? 'ltr' : 'rtl';

    this.currentStyle = { 
      fontFamily, 
      fontSize, 
      direction, 
      emojis, 
      tone, 
      language: lang,
      speed: emotionSettings.speed || 'normal'
    };

    return this.currentStyle;
  }

  applyToElement(el, response) {
    const style = this.currentStyle;
    el.style.fontFamily = style.fontFamily;
    el.style.fontSize = style.fontSize;
    el.style.direction = style.direction;
    el.style.textAlign = style.direction === 'rtl' ? 'right' : 'left';
    el.textContent = style.emojis ? this.addEmoji(response, style.tone) : response;
  }

  addEmoji(text, tone) {
    const emojis = {
      friendly: ' 😊',
      poetic: ' 🌙',
      sad: ' 💧',
      happy: ' 🎉',
      deep: ' 🤔'
    };
    return text + (emojis[tone] || '');
  }

  /**
   * Initializes the Silent Awareness Mode
   * Detects user inactivity and shows awareness messages
   * @param {Function} showMessageCallback - Function to display messages to the user
   */
  initSilentAwarenessMode(showMessageCallback) {
    if (typeof document === 'undefined') return; // Skip in non-browser environments

    // Clear any existing timer
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
    }

    // Function to reset the timer
    const resetSilenceTimer = () => {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = setTimeout(() => {
        const awarenessMessages = [
          "أنا هنا لو احتجتني 💛",
          "أنا معك حتى لو سكتّ شوي… إن شاء الله كل شي بخير؟",
          "خذ وقتك، أنا موجود متى ما احتجتني",
          "أحيانًا السكوت أبلغ من الكلام... أنا هنا عندما تريد التحدث"
        ];

        const randomMessage = awarenessMessages[Math.floor(Math.random() * awarenessMessages.length)];
        if (showMessageCallback && typeof showMessageCallback === 'function') {
          showMessageCallback(randomMessage);
        }
      }, this.silenceTimeout);
    };

    // Add event listeners for user activity
    document.addEventListener('keydown', resetSilenceTimer);
    document.addEventListener('mousedown', resetSilenceTimer);
    document.addEventListener('touchstart', resetSilenceTimer);

    // Initial timer start
    resetSilenceTimer();

    console.log('Silent Awareness Mode initialized');

    // Return a cleanup function
    return () => {
      clearTimeout(this.silenceTimer);
      document.removeEventListener('keydown', resetSilenceTimer);
      document.removeEventListener('mousedown', resetSilenceTimer);
      document.removeEventListener('touchstart', resetSilenceTimer);
    };
  }

  /**
   * Adjusts personality based on conversation context
   * Uses the context engine to determine the dominant emotion in the conversation
   * @returns {string} The adjusted personality mode
   */
  adjustPersonalityByContext() {
    // Get context summary from the context engine
    if (!window.mashaaerComponents?.contextEngine) {
      console.warn('Context engine not available for personality adjustment');
      return 'friendly'; // Default tone
    }

    const contextSummary = window.mashaaerComponents.contextEngine.getSummary();
    const dominantEmotion = contextSummary.dominantEmotion;

    // Map dominant emotions to personality modes
    const emotionToPersonality = {
      sad: 'deep',
      happy: 'friendly',
      anxious: 'calm',
      neutral: 'friendly',
      confident: 'friendly',
      angry: 'formal'
    };

    // Get the appropriate personality mode based on dominant emotion
    const personalityMode = emotionToPersonality[dominantEmotion] || 'friendly';

    // Apply the personality mode if personality engine is available
    if (window.mashaaerComponents?.personalityEngine) {
      window.mashaaerComponents.personalityEngine.setMode(personalityMode);
      console.log(`Adjusted personality to ${personalityMode} based on dominant emotion: ${dominantEmotion}`);
    }

    return personalityMode;
  }

  /**
   * Analyzes the conversation context and adjusts styling accordingly
   * Part of the Contextual Personality Adjustment feature
   * @param {Object} options - Options for context adjustment
   * @returns {Object} The adjusted style
   */
  adjustByContext(options = {}) {
    // Get the personality mode based on context
    const personalityMode = this.adjustPersonalityByContext();

    // Map personality modes to tones for styling
    const personalityToTone = {
      friendly: 'friendly',
      formal: 'formal',
      poetic: 'poetic',
      deep: 'deep'
    };

    // Get the tone based on personality mode
    const tone = personalityToTone[personalityMode] || 'friendly';

    // Adjust styling based on the determined tone
    return this.adjust({ 
      ...options, 
      tone 
    });
  }

  /**
   * Captures emotional memory of potentially painful events
   * Part of the Emotional Memory of Painful Events feature
   * @param {string} input - User input text
   * @param {string} emotion - Detected emotion
   */
  captureEmotionalMemory(input, emotion) {
    // Only process if emotional memory component is available
    if (!window.mashaaerComponents?.emotionalMemory) {
      console.warn('Emotional memory component not available');
      return;
    }

    // Capture the input and emotion in emotional memory
    window.mashaaerComponents.emotionalMemory.capture(input, emotion);

    // Check if this is a negative emotion that might indicate a painful topic
    const negativeEmotions = ['sad', 'angry', 'anxious'];
    if (negativeEmotions.includes(emotion)) {
      this.identifyPainfulTopics(input);
    }
  }

  /**
   * Identifies potentially painful topics from user input
   * @param {string} input - User input text
   */
  identifyPainfulTopics(input) {
    // Common sensitive topic keywords (could be expanded)
    const sensitiveTopics = {
      'سيارة': ['سيارتي', 'سيارة', 'حادث'],
      'وفاة': ['توفى', 'مات', 'وفاة', 'فقدت'],
      'مرض': ['مريض', 'مرض', 'مستشفى', 'علاج'],
      'طلاق': ['طلاق', 'انفصال', 'انفصلت'],
      'خسارة': ['خسرت', 'فقدت', 'ضاع', 'ضيعت']
    };

    // Check if input contains any sensitive topics
    for (const [topic, keywords] of Object.entries(sensitiveTopics)) {
      if (keywords.some(keyword => input.includes(keyword))) {
        if (!this.avoidTopics.includes(topic)) {
          this.avoidTopics.push(topic);
          console.log(`Added sensitive topic to avoid: ${topic}`);
        }
      }
    }
  }

  /**
   * Checks if a response contains any topics that should be avoided
   * @param {string} response - The response to check
   * @returns {boolean} True if the response contains topics to avoid
   */
  containsTopicsToAvoid(response) {
    return this.avoidTopics.some(topic => {
      const keywords = {
        'سيارة': ['سيارتك', 'سيارة', 'قيادة'],
        'وفاة': ['فقدت', 'خسرت شخص'],
        'مرض': ['صحتك', 'مرض', 'علاج'],
        'طلاق': ['زواج', 'علاقة', 'شريك'],
        'خسارة': ['فقدت', 'خسرت']
      }[topic] || [];

      return keywords.some(keyword => response.includes(keyword));
    });
  }

  /**
   * Filters a response to remove any sensitive topics
   * @param {string} response - The response to filter
   * @returns {string} The filtered response
   */
  filterSensitiveTopics(response) {
    if (this.containsTopicsToAvoid(response)) {
      // If response contains sensitive topics, replace with a more general response
      return "أنا هنا للمساعدة بأي موضوع ترغب بالحديث عنه.";
    }
    return response;
  }

  /**
   * Initializes the Honest Moment Prompts feature
   * Periodically asks emotional questions to encourage deeper conversation
   * @param {Function} showMessageCallback - Function to display messages to the user
   */
  initHonestMomentPrompts(showMessageCallback) {
    if (typeof document === 'undefined') return; // Skip in non-browser environments

    // Clear any existing timer
    if (this.honestMomentTimer) {
      clearTimeout(this.honestMomentTimer);
    }

    // Function to show a random honest moment prompt
    const showHonestMomentPrompt = () => {
      // Get a random prompt from the list
      const randomPrompt = this.honestMomentPrompts[
        Math.floor(Math.random() * this.honestMomentPrompts.length)
      ];

      // Show the prompt if callback is provided
      if (showMessageCallback && typeof showMessageCallback === 'function') {
        showMessageCallback(randomPrompt);
      }

      // Schedule the next prompt
      this.honestMomentTimer = setTimeout(showHonestMomentPrompt, this.honestMomentTimeout);
    };

    // Start the timer
    this.honestMomentTimer = setTimeout(showHonestMomentPrompt, this.honestMomentTimeout);

    console.log('Honest Moment Prompts initialized');

    // Return a cleanup function
    return () => {
      clearTimeout(this.honestMomentTimer);
    };
  }

  /**
   * Adds a custom honest moment prompt
   * @param {string} prompt - The prompt to add
   */
  addHonestMomentPrompt(prompt) {
    if (prompt && typeof prompt === 'string' && !this.honestMomentPrompts.includes(prompt)) {
      this.honestMomentPrompts.push(prompt);
      console.log('Added custom honest moment prompt');
    }
  }

  /**
   * Monitors user's emotional state and triggers self-regulation prompts when needed
   * @param {string} emotion - Current emotion detected from user input
   * @param {Function} showMessageCallback - Function to display messages to the user
   */
  monitorEmotionalState(emotion, showMessageCallback) {
    // Define negative emotions that might need regulation
    const negativeEmotions = ['sad', 'angry', 'anxious'];

    // Check if this is a negative emotion
    if (negativeEmotions.includes(emotion)) {
      // If the same negative emotion persists, increment counter
      if (emotion === this.lastEmotionState) {
        this.negativeEmotionCount++;
      } else {
        // Reset counter if emotion changed but still negative
        this.negativeEmotionCount = 1;
      }

      // If negative emotions persist beyond threshold, show a self-regulation prompt
      if (this.negativeEmotionCount >= this.emotionThreshold) {
        this.showSelfRegulationPrompt(emotion, showMessageCallback);
        this.negativeEmotionCount = 0; // Reset after showing prompt
      }
    } else {
      // Reset counter if emotion is positive or neutral
      this.negativeEmotionCount = 0;
    }

    // Update last emotion state
    this.lastEmotionState = emotion;
  }

  /**
   * Shows a self-regulation prompt based on the detected emotion
   * @param {string} emotion - The emotion to show a prompt for
   * @param {Function} showMessageCallback - Function to display messages to the user
   */
  showSelfRegulationPrompt(emotion, showMessageCallback) {
    if (!showMessageCallback || typeof showMessageCallback !== 'function') return;

    // Get prompts for the specific emotion, or use neutral prompts as fallback
    const prompts = this.selfRegulationPrompts[emotion] || this.selfRegulationPrompts.neutral;

    // Select a random prompt
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

    // Show the prompt
    showMessageCallback(randomPrompt);

    console.log(`Showed self-regulation prompt for emotion: ${emotion}`);
  }

  /**
   * Initializes the Self-Regulation Prompts feature
   * @param {Function} showMessageCallback - Function to display messages to the user
   */
  initSelfRegulationPrompts(showMessageCallback) {
    if (typeof document === 'undefined') return; // Skip in non-browser environments

    // Clear any existing timer
    if (this.selfRegulationTimer) {
      clearTimeout(this.selfRegulationTimer);
    }

    // Set up periodic check for emotional state
    this.selfRegulationTimer = setInterval(() => {
      // Get the current emotional state from context engine if available
      if (window.mashaaerComponents?.contextEngine) {
        const emotion = window.mashaaerComponents.contextEngine.getLastEmotion();
        this.monitorEmotionalState(emotion, showMessageCallback);
      }
    }, this.selfRegulationTimeout);

    console.log('Self-Regulation Prompts initialized');

    // Return a cleanup function
    return () => {
      clearInterval(this.selfRegulationTimer);
    };
  }

  /**
   * Initializes all dynamic styling features
   * @param {Object} options - Initialization options
   * @param {Function} options.showMessageCallback - Function to display messages to the user
   */
  initializeAllFeatures(options = {}) {
    const { showMessageCallback } = options;

    // Initialize Silent Awareness Mode
    const cleanupSilentAwareness = this.initSilentAwarenessMode(showMessageCallback);

    // Initialize Honest Moment Prompts
    const cleanupHonestMoments = this.initHonestMomentPrompts(showMessageCallback);

    // Initialize Self-Regulation Prompts
    const cleanupSelfRegulation = this.initSelfRegulationPrompts(showMessageCallback);

    console.log('All DynamicStylingEngine features initialized');

    // Return a cleanup function for all features
    return () => {
      cleanupSilentAwareness();
      cleanupHonestMoments();
      cleanupSelfRegulation();
    };
  }
}

export default DynamicStylingEngine;
