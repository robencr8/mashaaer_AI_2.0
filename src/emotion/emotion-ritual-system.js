/**
 * Mashaaer Enhanced Project
 * Emotion Ritual System
 *
 * This module provides a system for creating and triggering emotional rituals,
 * which are predefined sequences of actions and responses for specific emotional states.
 */

import synestheticFeedback from './synesthetic-feedback.js';
import culturalSkins from './cultural-emotional-skins.js';
import { addSemanticMemory, getSemanticMemory } from '../utils/memory-engine.js';

// Ritual trigger types
const TRIGGER_TYPES = {
  PHRASE: 'phrase',           // Triggered by specific phrases
  EMOTION: 'emotion',         // Triggered by detected emotions
  TIME: 'time',               // Triggered at specific times
  COMBINED: 'combined'        // Triggered by a combination of factors
};

// Ritual action types
const ACTION_TYPES = {
  AFFIRMATION: 'affirmation',       // Play affirmations
  BREATHING: 'breathing',           // Guide through breathing exercises
  MUSIC: 'music',                   // Play background music
  LIGHTING: 'lighting',             // Change lighting (if smart devices connected)
  VOICE_TONE: 'voice_tone',         // Change voice tone
  UI_CHANGE: 'ui_change',           // Change UI appearance
  DISABLE_FEATURES: 'disable',      // Disable certain features
  ENABLE_FEATURES: 'enable',        // Enable certain features
  SUGGEST_ACTIVITY: 'suggest',      // Suggest an activity
  MEDITATION: 'meditation'          // Guide through meditation
};

// Default rituals for common emotional states
const DEFAULT_RITUALS = {
  // "I feel off today" ritual
  feeling_off: {
    id: 'feeling_off',
    name: 'طقوس الشعور بالتعب',
    description: 'مجموعة من الإجراءات للمساعدة عندما تشعر بأنك لست على ما يرام',
    triggers: [
      { type: TRIGGER_TYPES.PHRASE, value: 'أشعر بتعب اليوم' },
      { type: TRIGGER_TYPES.PHRASE, value: 'لست على ما يرام' },
      { type: TRIGGER_TYPES.PHRASE, value: 'أشعر بالسوء' },
      { type: TRIGGER_TYPES.EMOTION, value: 'sad', intensity: 0.7 }
    ],
    actions: [
      { 
        type: ACTION_TYPES.AFFIRMATION, 
        content: [
          'أنت أقوى مما تعتقد',
          'كل يوم هو فرصة جديدة',
          'أنت تتحسن كل يوم'
        ],
        settings: { voice: 'gentle', speed: 0.9 }
      },
      { 
        type: ACTION_TYPES.VOICE_TONE, 
        settings: { tone: 'gentle', pitch: 0.9, speed: 0.9 }
      },
      { 
        type: ACTION_TYPES.UI_CHANGE, 
        settings: { colors: ['#8be9fd', '#6272a4', '#f8f8f2'], brightness: 0.8 }
      }
    ],
    userFeedback: [],
    usageCount: 0,
    lastUsed: null,
    created: Date.now(),
    isDefault: true
  },

  // Anger cooldown ritual
  anger_cooldown: {
    id: 'anger_cooldown',
    name: 'طقوس تهدئة الغضب',
    description: 'سلسلة من الإجراءات للمساعدة في تهدئة مشاعر الغضب',
    triggers: [
      { type: TRIGGER_TYPES.EMOTION, value: 'anger', intensity: 0.6 },
      { type: TRIGGER_TYPES.PHRASE, value: 'أنا غاضب' },
      { type: TRIGGER_TYPES.PHRASE, value: 'هذا يغضبني' }
    ],
    actions: [
      { 
        type: ACTION_TYPES.BREATHING, 
        content: 'تنفس ببطء... 4 ثوان شهيق... 4 ثوان احتفاظ... 6 ثوان زفير...',
        settings: { duration: 30, pace: 'slow' }
      },
      { 
        type: ACTION_TYPES.VOICE_TONE, 
        settings: { tone: 'calm', pitch: 0.9, speed: 0.8 }
      }
    ],
    userFeedback: [],
    usageCount: 0,
    lastUsed: null,
    created: Date.now(),
    isDefault: true
  },

  // Breathing exercise ritual
  breathing_exercise: {
    id: 'breathing_exercise',
    name: 'تمارين تنفس للاسترخاء',
    description: 'تمارين تنفس عميق للمساعدة في تقليل القلق والتوتر',
    triggers: [
      { type: TRIGGER_TYPES.EMOTION, value: 'anxious', intensity: 0.5 },
      { type: TRIGGER_TYPES.PHRASE, value: 'أشعر بالقلق' },
      { type: TRIGGER_TYPES.PHRASE, value: 'أحتاج للاسترخاء' }
    ],
    actions: [
      { 
        type: ACTION_TYPES.BREATHING, 
        content: 'تنفس ببطء... 4 ثوان شهيق... 4 ثوان احتفاظ... 6 ثوان زفير... كرر هذا النمط لمدة دقيقتين',
        settings: { duration: 120, pace: 'slow' }
      },
      { 
        type: ACTION_TYPES.VOICE_TONE, 
        settings: { tone: 'gentle', pitch: 0.9, speed: 0.8 }
      },
      { 
        type: ACTION_TYPES.UI_CHANGE, 
        settings: { colors: ['#8be9fd', '#6272a4', '#f8f8f2'], brightness: 0.7 }
      }
    ],
    userFeedback: [],
    usageCount: 0,
    lastUsed: null,
    created: Date.now(),
    isDefault: true
  },

  // Meditation ritual
  meditation: {
    id: 'meditation',
    name: 'جلسة تأمل قصيرة',
    description: 'جلسة تأمل قصيرة للمساعدة في تهدئة العقل وتحسين التركيز',
    triggers: [
      { type: TRIGGER_TYPES.EMOTION, value: 'stressed', intensity: 0.5 },
      { type: TRIGGER_TYPES.PHRASE, value: 'أحتاج للتأمل' },
      { type: TRIGGER_TYPES.PHRASE, value: 'أشعر بالتوتر' }
    ],
    actions: [
      { 
        type: ACTION_TYPES.MEDITATION, 
        content: 'اجلس في وضع مريح، أغلق عينيك، وركز على تنفسك. لاحظ كل شهيق وزفير دون محاولة تغييره. عندما تتشتت أفكارك، أعد تركيزك بلطف إلى التنفس.',
        settings: { duration: 300, background: 'gentle_nature' }
      },
      { 
        type: ACTION_TYPES.VOICE_TONE, 
        settings: { tone: 'soothing', pitch: 0.8, speed: 0.7 }
      },
      { 
        type: ACTION_TYPES.UI_CHANGE, 
        settings: { colors: ['#bd93f9', '#6272a4', '#f8f8f2'], brightness: 0.6 }
      }
    ],
    userFeedback: [],
    usageCount: 0,
    lastUsed: null,
    created: Date.now(),
    isDefault: true
  },

  // Physical activity ritual
  physical_activity: {
    id: 'physical_activity',
    name: 'نشاط بدني خفيف',
    description: 'اقتراحات لأنشطة بدنية خفيفة لتحسين المزاج وتقليل التوتر',
    triggers: [
      { type: TRIGGER_TYPES.EMOTION, value: 'sad', intensity: 0.5 },
      { type: TRIGGER_TYPES.PHRASE, value: 'أشعر بالخمول' },
      { type: TRIGGER_TYPES.PHRASE, value: 'أحتاج للحركة' }
    ],
    actions: [
      { 
        type: ACTION_TYPES.SUGGEST_ACTIVITY, 
        content: [
          'المشي لمدة 15 دقيقة في الهواء الطلق',
          'تمارين تمدد خفيفة لمدة 10 دقائق',
          'صعود ونزول السلالم لمدة 5 دقائق',
          'رقصة سريعة على أغنيتك المفضلة'
        ],
        settings: { intensity: 'light', duration: 15 }
      },
      { 
        type: ACTION_TYPES.VOICE_TONE, 
        settings: { tone: 'energetic', pitch: 1.0, speed: 1.0 }
      }
    ],
    userFeedback: [],
    usageCount: 0,
    lastUsed: null,
    created: Date.now(),
    isDefault: true
  },

  // Gratitude practice ritual
  gratitude_practice: {
    id: 'gratitude_practice',
    name: 'ممارسة الامتنان',
    description: 'تمرين للتركيز على الأشياء الإيجابية في حياتك وتعزيز مشاعر السعادة',
    triggers: [
      { type: TRIGGER_TYPES.EMOTION, value: 'happy', intensity: 0.6 },
      { type: TRIGGER_TYPES.PHRASE, value: 'أنا ممتن' },
      { type: TRIGGER_TYPES.PHRASE, value: 'أشعر بالامتنان' }
    ],
    actions: [
      { 
        type: ACTION_TYPES.SUGGEST_ACTIVITY, 
        content: 'فكر في ثلاثة أشياء تشعر بالامتنان لها اليوم. يمكن أن تكون أشياء بسيطة مثل وجبة لذيذة أو ابتسامة من شخص عزيز أو لحظة هادئة قضيتها مع نفسك.',
        settings: { duration: 5 }
      },
      { 
        type: ACTION_TYPES.VOICE_TONE, 
        settings: { tone: 'warm', pitch: 1.0, speed: 0.9 }
      },
      { 
        type: ACTION_TYPES.UI_CHANGE, 
        settings: { colors: ['#50fa7b', '#f1fa8c', '#f8f8f2'], brightness: 1.0 }
      }
    ],
    userFeedback: [],
    usageCount: 0,
    lastUsed: null,
    created: Date.now(),
    isDefault: true
  }
};

/**
 * Emotion Ritual System
 * Manages emotional rituals for different states
 */
class EmotionRitualSystem {
  constructor() {
    this.rituals = {};
    this.activeRitual = null;
    this.ritualHistory = [];
    this.initialized = false;
    this.timeOfDay = this.getCurrentTimeOfDay();
    this.cooldownPeriods = {}; // To prevent rituals from triggering too frequently
  }

  /**
   * Initialize the emotion ritual system
   */
  initialize() {
    if (this.initialized) return;

    // Load existing rituals from semantic memory
    const savedRituals = getSemanticMemory('emotionRituals');
    if (savedRituals) {
      this.rituals = savedRituals;
    } else {
      // Initialize with default rituals
      this.rituals = { ...DEFAULT_RITUALS };
      this.saveRituals();
    }

    // Load ritual history
    const savedHistory = getSemanticMemory('ritualHistory');
    if (savedHistory) {
      this.ritualHistory = savedHistory;
    }

    this.initialized = true;
    console.log('✅ Emotion Ritual System initialized');
  }

  /**
   * Get the current time of day
   * @returns {string} - The current time of day ('morning', 'afternoon', 'evening', 'night')
   */
  getCurrentTimeOfDay() {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return 'morning';
    } else if (hour >= 12 && hour < 17) {
      return 'afternoon';
    } else if (hour >= 17 && hour < 22) {
      return 'evening';
    } else {
      return 'night';
    }
  }

  /**
   * Save rituals to semantic memory
   */
  saveRituals() {
    addSemanticMemory('emotionRituals', this.rituals);
  }

  /**
   * Save ritual history to semantic memory
   */
  saveRitualHistory() {
    addSemanticMemory('ritualHistory', this.ritualHistory);
  }

  /**
   * Create a new ritual
   * @param {Object} ritual - The ritual to create
   * @returns {string} - The ID of the created ritual
   */
  createRitual(ritual) {
    if (!ritual.name || !ritual.triggers || !ritual.actions) {
      console.warn('Invalid ritual: missing required fields');
      return null;
    }

    // Generate a unique ID for the ritual
    const ritualId = ritual.id || `ritual_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Create the ritual
    this.rituals[ritualId] = {
      id: ritualId,
      name: ritual.name,
      description: ritual.description || '',
      triggers: ritual.triggers || [],
      actions: ritual.actions || [],
      userFeedback: [],
      usageCount: 0,
      lastUsed: null,
      created: Date.now(),
      isDefault: false
    };

    // Save to semantic memory
    this.saveRituals();

    console.log(`Created ritual: ${ritualId}`);
    return ritualId;
  }

  /**
   * Check if a message triggers any rituals
   * @param {string} message - The message to check
   * @param {string} emotion - The detected emotion
   * @param {number} intensity - The intensity of the emotion
   * @returns {Object|null} - The triggered ritual, or null if none triggered
   */
  checkForTriggeredRituals(message, emotion, intensity = 0.5) {
    if (!message && !emotion) return null;

    // Normalize message and emotion
    const normalizedMessage = message ? message.toLowerCase() : '';
    const normalizedEmotion = emotion ? emotion.toLowerCase() : '';

    // Check each ritual for triggers
    for (const ritualId in this.rituals) {
      const ritual = this.rituals[ritualId];

      // Skip if this ritual is in cooldown
      if (this.isRitualInCooldown(ritualId)) {
        continue;
      }

      // Check each trigger
      for (const trigger of ritual.triggers) {
        let isTriggered = false;

        switch (trigger.type) {
          case TRIGGER_TYPES.PHRASE:
            isTriggered = normalizedMessage.includes(trigger.value.toLowerCase());
            break;

          case TRIGGER_TYPES.EMOTION:
            isTriggered = normalizedEmotion === trigger.value.toLowerCase() && 
                         intensity >= (trigger.intensity || 0.5);
            break;

          case TRIGGER_TYPES.TIME:
            isTriggered = this.timeOfDay === trigger.value;
            break;
        }

        if (isTriggered) {
          console.log(`Ritual triggered: ${ritual.name}`);
          return ritual;
        }
      }
    }

    return null;
  }

  /**
   * Check if a ritual is in cooldown
   * @param {string} ritualId - The ID of the ritual to check
   * @returns {boolean} - Whether the ritual is in cooldown
   */
  isRitualInCooldown(ritualId) {
    if (!this.cooldownPeriods[ritualId]) {
      return false;
    }

    const cooldownUntil = this.cooldownPeriods[ritualId];
    return Date.now() < cooldownUntil;
  }

  /**
   * Set a cooldown period for a ritual
   * @param {string} ritualId - The ID of the ritual
   * @param {number} durationMs - The cooldown duration in milliseconds
   */
  setRitualCooldown(ritualId, durationMs = 3600000) { // Default: 1 hour
    this.cooldownPeriods[ritualId] = Date.now() + durationMs;
  }

  /**
   * Trigger a ritual
   * @param {Object} ritual - The ritual to trigger
   * @returns {boolean} - Whether the ritual was triggered successfully
   */
  triggerRitual(ritual) {
    if (!ritual) return false;

    // Set as active ritual
    this.activeRitual = ritual;

    // Update usage stats
    ritual.usageCount += 1;
    ritual.lastUsed = Date.now();

    // Add to history
    this.ritualHistory.push({
      ritualId: ritual.id,
      name: ritual.name,
      timestamp: Date.now()
    });

    // Keep history at a reasonable size
    if (this.ritualHistory.length > 50) {
      this.ritualHistory.shift();
    }

    // Save changes
    this.saveRituals();
    this.saveRitualHistory();

    // Set cooldown
    this.setRitualCooldown(ritual.id);

    // Execute ritual actions
    this.executeRitualActions(ritual);

    return true;
  }

  /**
   * Execute ritual actions
   * @param {Object} ritual - The ritual whose actions to execute
   */
  executeRitualActions(ritual) {
    if (!ritual || !ritual.actions) return;

    console.log(`Executing ritual actions for: ${ritual.name}`);

    // Execute each action
    ritual.actions.forEach(action => {
      switch (action.type) {
        case ACTION_TYPES.AFFIRMATION:
          this.executeAffirmationAction(action);
          break;

        case ACTION_TYPES.BREATHING:
          this.executeBreathingAction(action);
          break;

        case ACTION_TYPES.VOICE_TONE:
          this.executeVoiceToneAction(action);
          break;

        case ACTION_TYPES.UI_CHANGE:
          this.executeUIChangeAction(action);
          break;

        case ACTION_TYPES.MEDITATION:
          this.executeMeditationAction(action);
          break;

        case ACTION_TYPES.SUGGEST_ACTIVITY:
          this.executeSuggestActivityAction(action);
          break;
      }
    });
  }

  /**
   * Execute affirmation action
   * @param {Object} action - The action to execute
   */
  executeAffirmationAction(action) {
    if (!action.content || !Array.isArray(action.content)) return;

    console.log('Executing affirmation action');

    // Choose a random affirmation
    const affirmation = action.content[Math.floor(Math.random() * action.content.length)];
    console.log(`Affirmation: ${affirmation}`);

    // In a real implementation, this would display the affirmation to the user
  }

  /**
   * Execute breathing action
   * @param {Object} action - The action to execute
   */
  executeBreathingAction(action) {
    console.log('Executing breathing action');
    console.log(`Breathing instructions: ${action.content}`);

    // In a real implementation, this would guide the user through a breathing exercise
  }

  /**
   * Execute voice tone action
   * @param {Object} action - The action to execute
   */
  executeVoiceToneAction(action) {
    console.log(`Executing voice tone action: ${action.settings.tone}`);

    // Apply voice settings to synesthetic feedback
    if (synestheticFeedback) {
      // Map tone to emotion
      let emotion = 'neutral';
      switch (action.settings.tone) {
        case 'gentle':
        case 'soothing':
          emotion = 'calm';
          break;
        case 'cheerful':
        case 'energetic':
          emotion = 'joy';
          break;
        case 'firm':
          emotion = 'anger';
          break;
      }

      // Set emotion in synesthetic feedback
      synestheticFeedback.setEmotion(emotion, 0.7);
    }
  }

  /**
   * Execute UI change action
   * @param {Object} action - The action to execute
   */
  executeUIChangeAction(action) {
    console.log('Executing UI change action');

    // Apply UI changes through synesthetic feedback
    if (synestheticFeedback && action.settings) {
      // Create a custom mapping based on the settings
      const customMapping = {
        visual: {
          colors: action.settings.colors || ['#f8f8f2', '#6272a4', '#8be9fd'],
          animation: action.settings.animation || 'subtle_pulse',
          intensity: action.settings.intensity || 0.5,
          blur: action.settings.blur || 0,
          brightness: action.settings.brightness || 1.0
        }
      };

      // Create a custom emotion with this mapping
      synestheticFeedback.createCustomMapping('ritual_ui', customMapping);

      // Apply the custom mapping
      synestheticFeedback.setEmotion('ritual_ui', 0.8);
    }
  }

  /**
   * Execute meditation action
   * @param {Object} action - The action to execute
   */
  executeMeditationAction(action) {
    console.log('Executing meditation action');
    console.log(`Meditation instructions: ${action.content}`);

    // Create a meditation overlay
    const meditationOverlay = document.createElement('div');
    meditationOverlay.id = 'meditation-overlay';
    meditationOverlay.style.position = 'fixed';
    meditationOverlay.style.top = '0';
    meditationOverlay.style.left = '0';
    meditationOverlay.style.width = '100%';
    meditationOverlay.style.height = '100%';
    meditationOverlay.style.backgroundColor = 'rgba(40, 42, 54, 0.95)';
    meditationOverlay.style.zIndex = '9999';
    meditationOverlay.style.display = 'flex';
    meditationOverlay.style.flexDirection = 'column';
    meditationOverlay.style.alignItems = 'center';
    meditationOverlay.style.justifyContent = 'center';
    meditationOverlay.style.padding = '20px';
    meditationOverlay.style.boxSizing = 'border-box';
    meditationOverlay.style.color = '#f8f8f2';
    meditationOverlay.style.fontFamily = 'Arial, sans-serif';
    meditationOverlay.style.textAlign = 'center';
    meditationOverlay.style.direction = 'rtl';

    // Add title
    const title = document.createElement('h2');
    title.textContent = '✨ جلسة تأمل ✨';
    title.style.color = '#bd93f9';
    title.style.marginBottom = '20px';
    title.style.textShadow = '0 0 10px rgba(189, 147, 249, 0.5)';
    meditationOverlay.appendChild(title);

    // Add instructions
    const instructions = document.createElement('p');
    instructions.textContent = action.content;
    instructions.style.fontSize = '18px';
    instructions.style.lineHeight = '1.6';
    instructions.style.maxWidth = '600px';
    instructions.style.margin = '0 auto 30px auto';
    meditationOverlay.appendChild(instructions);

    // Add timer
    const duration = action.settings?.duration || 300; // Default 5 minutes
    const timerDisplay = document.createElement('div');
    timerDisplay.style.fontSize = '48px';
    timerDisplay.style.fontWeight = 'bold';
    timerDisplay.style.margin = '20px 0';
    timerDisplay.style.color = '#f1fa8c';
    meditationOverlay.appendChild(timerDisplay);

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'إنهاء التأمل';
    closeButton.style.backgroundColor = '#ff5555';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.padding = '10px 20px';
    closeButton.style.fontSize = '16px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.marginTop = '30px';
    closeButton.onclick = () => {
      meditationOverlay.remove();
      clearInterval(timerInterval);
    };
    meditationOverlay.appendChild(closeButton);

    // Add to document
    document.body.appendChild(meditationOverlay);

    // Start timer
    let secondsLeft = duration;
    const updateTimer = () => {
      const minutes = Math.floor(secondsLeft / 60);
      const seconds = secondsLeft % 60;
      timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    updateTimer();
    const timerInterval = setInterval(() => {
      secondsLeft--;
      updateTimer();

      if (secondsLeft <= 0) {
        clearInterval(timerInterval);
        // Add completion message
        timerDisplay.textContent = 'اكتمل! ✨';

        // Auto-close after 5 seconds
        setTimeout(() => {
          meditationOverlay.remove();
        }, 5000);
      }
    }, 1000);
  }

  /**
   * Execute suggest activity action
   * @param {Object} action - The action to execute
   */
  executeSuggestActivityAction(action) {
    console.log('Executing suggest activity action');

    // Handle both array and string content
    let activities = action.content;
    if (!Array.isArray(activities)) {
      activities = [activities];
    }

    // Choose a random activity if multiple are provided
    const activity = activities[Math.floor(Math.random() * activities.length)];
    console.log(`Suggested activity: ${activity}`);

    // Create activity suggestion overlay
    const activityOverlay = document.createElement('div');
    activityOverlay.id = 'activity-suggestion-overlay';
    activityOverlay.style.position = 'fixed';
    activityOverlay.style.top = '50%';
    activityOverlay.style.left = '50%';
    activityOverlay.style.transform = 'translate(-50%, -50%)';
    activityOverlay.style.backgroundColor = 'rgba(68, 71, 90, 0.95)';
    activityOverlay.style.borderRadius = '15px';
    activityOverlay.style.padding = '30px';
    activityOverlay.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.5)';
    activityOverlay.style.zIndex = '9999';
    activityOverlay.style.maxWidth = '500px';
    activityOverlay.style.width = '90%';
    activityOverlay.style.textAlign = 'center';
    activityOverlay.style.direction = 'rtl';
    activityOverlay.style.color = '#f8f8f2';

    // Add emoji
    const emoji = document.createElement('div');
    emoji.textContent = '🚶‍♂️';
    emoji.style.fontSize = '48px';
    emoji.style.marginBottom = '15px';
    activityOverlay.appendChild(emoji);

    // Add title
    const title = document.createElement('h3');
    title.textContent = 'نشاط مقترح';
    title.style.color = '#50fa7b';
    title.style.marginBottom = '15px';
    title.style.fontSize = '22px';
    activityOverlay.appendChild(title);

    // Add activity description
    const description = document.createElement('p');
    description.textContent = activity;
    description.style.fontSize = '18px';
    description.style.lineHeight = '1.5';
    description.style.marginBottom = '25px';
    activityOverlay.appendChild(description);

    // Add buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.justifyContent = 'center';
    buttonsContainer.style.gap = '15px';

    // Add try now button
    const tryButton = document.createElement('button');
    tryButton.textContent = 'جرب الآن';
    tryButton.style.backgroundColor = '#50fa7b';
    tryButton.style.color = '#282a36';
    tryButton.style.border = 'none';
    tryButton.style.borderRadius = '5px';
    tryButton.style.padding = '10px 20px';
    tryButton.style.cursor = 'pointer';
    tryButton.style.fontWeight = 'bold';
    tryButton.onclick = () => {
      activityOverlay.remove();
      alert('رائع! نتمنى لك نشاطاً ممتعاً ومفيداً.');
    };
    buttonsContainer.appendChild(tryButton);

    // Add remind later button
    const remindButton = document.createElement('button');
    remindButton.textContent = 'ذكرني لاحقاً';
    remindButton.style.backgroundColor = '#6272a4';
    remindButton.style.color = 'white';
    remindButton.style.border = 'none';
    remindButton.style.borderRadius = '5px';
    remindButton.style.padding = '10px 20px';
    remindButton.style.cursor = 'pointer';
    remindButton.onclick = () => {
      activityOverlay.remove();
      alert('سنذكرك بهذا النشاط لاحقاً.');
    };
    buttonsContainer.appendChild(remindButton);

    // Add dismiss button
    const dismissButton = document.createElement('button');
    dismissButton.textContent = 'تجاهل';
    dismissButton.style.backgroundColor = 'transparent';
    dismissButton.style.color = '#ff5555';
    dismissButton.style.border = '1px solid #ff5555';
    dismissButton.style.borderRadius = '5px';
    dismissButton.style.padding = '10px 20px';
    dismissButton.style.cursor = 'pointer';
    dismissButton.onclick = () => {
      activityOverlay.remove();
    };
    buttonsContainer.appendChild(dismissButton);

    activityOverlay.appendChild(buttonsContainer);

    // Add to document
    document.body.appendChild(activityOverlay);
  }
}

// Create singleton instance
const emotionRitualSystem = new EmotionRitualSystem();

// Initialize on import
emotionRitualSystem.initialize();

export default emotionRitualSystem;
export { TRIGGER_TYPES, ACTION_TYPES };
