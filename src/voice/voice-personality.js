/**
 * Mashaaer Enhanced Project
 * Voice Personality Module
 * 
 * This module provides enhanced voice assistant personality customization with:
 * - Cultural and dialect-aware personality profiles
 * - Advanced tone and style customization
 * - Subscription-aware feature access
 * - Personalized response patterns
 * - Emotion-responsive behavior
 */

class VoicePersonality {
  constructor() {
    this.config = {
      storageKey: 'enhanced_voice_personality_settings',
      apiEndpoint: '/api/voice_logic/enhanced',
      defaultDialect: 'standard'
    };
    
    this.settings = null;
    this.subscriptionLevel = 'free';
    this.culturalContext = 'neutral';
    this.isInitialized = false;
    
    // Personality presets with cultural variations
    this.personalityPresets = {
      cosmic: {
        standard: {
          tone: 'mystical',
          formality: 'balanced',
          verbosity: 'poetic',
          humor: 'subtle',
          responsePatterns: [
            "The cosmos whispers that {response}",
            "The stars reveal {response}",
            "In the grand tapestry of existence, {response}",
            "The universe guides us to understand that {response}"
          ]
        },
        arabic: {
          tone: 'mystical',
          formality: 'respectful',
          verbosity: 'poetic',
          humor: 'subtle',
          responsePatterns: [
            "تهمس لنا النجوم أن {response}",
            "يكشف الكون أن {response}",
            "في نسيج الوجود الكبير، {response}",
            "يرشدنا الفضاء لفهم أن {response}"
          ]
        }
      },
      friendly: {
        standard: {
          tone: 'warm',
          formality: 'casual',
          verbosity: 'conversational',
          humor: 'moderate',
          responsePatterns: [
            "I think {response}",
            "From what I can tell, {response}",
            "It seems that {response}",
            "I'd say {response}"
          ]
        },
        arabic: {
          tone: 'warm',
          formality: 'casual',
          verbosity: 'conversational',
          humor: 'moderate',
          responsePatterns: [
            "أعتقد أن {response}",
            "من وجهة نظري، {response}",
            "يبدو أن {response}",
            "أقول إن {response}"
          ]
        }
      },
      professional: {
        standard: {
          tone: 'respectful',
          formality: 'formal',
          verbosity: 'concise',
          humor: 'minimal',
          responsePatterns: [
            "I would like to inform you that {response}",
            "Please note that {response}",
            "I'm pleased to advise that {response}",
            "Allow me to explain: {response}"
          ]
        },
        arabic: {
          tone: 'respectful',
          formality: 'formal',
          verbosity: 'concise',
          humor: 'minimal',
          responsePatterns: [
            "أود إعلامك بأن {response}",
            "يرجى ملاحظة أن {response}",
            "يسرني أن أخبرك بأن {response}",
            "اسمح لي أن أوضح: {response}"
          ]
        }
      },
      playful: {
        standard: {
          tone: 'energetic',
          formality: 'casual',
          verbosity: 'chatty',
          humor: 'high',
          responsePatterns: [
            "Oh! {response}",
            "Guess what? {response}",
            "Fun fact: {response}",
            "Awesome! {response}"
          ]
        },
        arabic: {
          tone: 'energetic',
          formality: 'casual',
          verbosity: 'chatty',
          humor: 'high',
          responsePatterns: [
            "يا! {response}",
            "تخمن ماذا؟ {response}",
            "حقيقة ممتعة: {response}",
            "رائع! {response}"
          ]
        }
      },
      zen: {
        standard: {
          tone: 'calm',
          formality: 'balanced',
          verbosity: 'minimal',
          humor: 'subtle',
          responsePatterns: [
            "{response}",
            "Simply: {response}",
            "Consider that {response}",
            "Reflect on this: {response}"
          ]
        },
        arabic: {
          tone: 'calm',
          formality: 'balanced',
          verbosity: 'minimal',
          humor: 'subtle',
          responsePatterns: [
            "{response}",
            "ببساطة: {response}",
            "فكر في أن {response}",
            "تأمل في هذا: {response}"
          ]
        }
      },
      custom: {
        // Custom keeps current settings
      }
    };
    
    // Dialect-specific personality traits
    this.dialectTraits = {
      levantine: {
        responsePatterns: [
          "بصراحة، {response}",
          "يعني، {response}",
          "بالنسبة إلي، {response}"
        ],
        expressionStyle: 'expressive',
        commonPhrases: ['يا سلام', 'والله', 'يعني']
      },
      gulf: {
        responsePatterns: [
          "صراحة، {response}",
          "تدري، {response}",
          "أقولك، {response}"
        ],
        expressionStyle: 'direct',
        commonPhrases: ['يالله', 'إن شاء الله', 'ما شاء الله']
      },
      maghrebi: {
        responsePatterns: [
          "بصح، {response}",
          "شوف، {response}",
          "سمع، {response}"
        ],
        expressionStyle: 'rhythmic',
        commonPhrases: ['بزاف', 'لابس', 'واخا']
      },
      egyptian: {
        responsePatterns: [
          "بص، {response}",
          "يعني، {response}",
          "طب، {response}"
        ],
        expressionStyle: 'humorous',
        commonPhrases: ['خالص', 'أهو', 'طب']
      },
      AAVE: {
        responsePatterns: [
          "For real, {response}",
          "Listen, {response}",
          "Check it, {response}"
        ],
        expressionStyle: 'rhythmic',
        commonPhrases: ['for real', 'no cap', 'facts']
      },
      british: {
        responsePatterns: [
          "I'd say {response}",
          "Rather {response}",
          "Quite frankly, {response}"
        ],
        expressionStyle: 'reserved',
        commonPhrases: ['quite', 'rather', 'brilliant']
      }
    };
    
    // Emotion-responsive behavior patterns
    this.emotionResponses = {
      happy: {
        toneShift: 'upbeat',
        verbosityChange: 1.2, // More verbose
        humorChange: 1.3, // More humor
        responsePatterns: [
          "I'm glad to hear that! {response}",
          "That's wonderful! {response}",
          "Excellent! {response}"
        ]
      },
      sad: {
        toneShift: 'empathetic',
        verbosityChange: 0.9, // Less verbose
        humorChange: 0.5, // Less humor
        responsePatterns: [
          "I understand this is difficult. {response}",
          "I'm here for you. {response}",
          "Take your time. {response}"
        ]
      },
      angry: {
        toneShift: 'calming',
        verbosityChange: 0.8, // Less verbose
        humorChange: 0.3, // Much less humor
        responsePatterns: [
          "I understand your frustration. {response}",
          "Let's take a moment. {response}",
          "I hear you. {response}"
        ]
      },
      surprised: {
        toneShift: 'engaged',
        verbosityChange: 1.1, // Slightly more verbose
        humorChange: 1.2, // More humor
        responsePatterns: [
          "Wow! {response}",
          "That's surprising! {response}",
          "I didn't expect that! {response}"
        ]
      },
      anxious: {
        toneShift: 'reassuring',
        verbosityChange: 0.9, // Less verbose
        humorChange: 0.7, // Less humor
        responsePatterns: [
          "It's going to be okay. {response}",
          "Let's take this one step at a time. {response}",
          "I'm here to help. {response}"
        ]
      }
    };
  }

  /**
   * Initialize voice personality settings
   * @param {Object} config - Configuration options
   */
  initialize(config = {}) {
    if (this.isInitialized) return this;
    
    // Apply configuration
    this.config = { ...this.config, ...config };
    
    // Set subscription level if provided
    if (config.subscriptionLevel) {
      this.setSubscriptionLevel(config.subscriptionLevel);
    }
    
    // Set cultural context if provided
    if (config.culturalContext) {
      this.setCulturalContext(config.culturalContext);
    }
    
    // Load settings
    this.settings = this.loadSettings();
    
    // Initialize event listeners
    this.initEventListeners();
    
    // Create route handler for /settings/voice
    this.createRouteHandler();
    
    this.isInitialized = true;
    console.log('Enhanced Voice Personality initialized');
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
    
    // Update dialect-specific settings if applicable
    if (this.dialectTraits[context]) {
      this.applyDialectTraits(context);
    }
    
    return true;
  }

  /**
   * Apply dialect-specific traits to current settings
   * @param {string} dialect - Dialect to apply
   */
  applyDialectTraits(dialect) {
    if (!this.dialectTraits[dialect] || !this.canAccessFeature('dialectCustomization')) return;
    
    const traits = this.dialectTraits[dialect];
    
    // Store dialect-specific response patterns
    this.settings.dialectResponsePatterns = traits.responsePatterns;
    
    // Store expression style
    this.settings.expressionStyle = traits.expressionStyle;
    
    // Save settings
    this.saveSettings();
    
    console.log(`Applied ${dialect} dialect traits to voice personality`);
  }

  /**
   * Check if a feature is accessible based on subscription level
   * @param {string} feature - Feature name
   * @returns {boolean} Whether the feature is accessible
   */
  canAccessFeature(feature) {
    const featureAccess = {
      basicPersonality: ['free', 'basic', 'premium'],
      customPersonality: ['basic', 'premium'],
      emotionResponsive: ['basic', 'premium'],
      customResponses: ['premium'],
      dialectCustomization: ['premium'],
      advancedToneControl: ['premium']
    };
    
    if (!featureAccess[feature]) {
      console.warn(`Unknown feature: ${feature}`);
      return false;
    }
    
    return featureAccess[feature].includes(this.subscriptionLevel);
  }

  /**
   * Load settings from storage
   * @returns {Object} Voice personality settings
   */
  loadSettings() {
    // Try to load from memory.db first if available
    if (window.memoryDB) {
      const settings = window.memoryDB.get(this.config.storageKey);
      if (settings) {
        return this.validateSettings(settings);
      }
    }
    
    // Otherwise try localStorage
    const storedSettings = localStorage.getItem(this.config.storageKey);
    if (storedSettings) {
      try {
        return this.validateSettings(JSON.parse(storedSettings));
      } catch (e) {
        console.error('Error parsing voice personality settings:', e);
        return this.createDefaultSettings();
      }
    }
    
    // Create default settings if none exists
    return this.createDefaultSettings();
  }

  /**
   * Validate settings and fix if necessary
   * @param {Object} settings - Settings to validate
   * @returns {Object} Validated settings
   */
  validateSettings(settings) {
    // Check if settings has required properties
    if (!settings || typeof settings !== 'object') {
      return this.createDefaultSettings();
    }
    
    // Ensure required properties exist
    const defaultSettings = this.createDefaultSettings();
    
    return {
      ...defaultSettings,
      ...settings
    };
  }

  /**
   * Create default settings
   * @returns {Object} Default settings
   */
  createDefaultSettings() {
    return {
      personality: 'cosmic',
      tone: 'friendly',
      formality: 'casual',
      verbosity: 'balanced',
      humor: 'moderate',
      customResponses: {},
      emotionResponsive: true,
      dialectResponsePatterns: [],
      expressionStyle: 'standard',
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Save settings to storage
   */
  saveSettings() {
    // Update last updated timestamp
    this.settings.lastUpdated = new Date().toISOString();
    
    // Save to localStorage
    try {
      localStorage.setItem(this.config.storageKey, JSON.stringify(this.settings));
    } catch (e) {
      console.error('Error saving voice personality settings to localStorage:', e);
    }
    
    // Save to memory.db if available
    if (window.memoryDB) {
      window.memoryDB.set(this.config.storageKey, this.settings);
    }
    
    // Sync with API if available
    this.syncWithAPI();
    
    // Dispatch event
    document.dispatchEvent(new CustomEvent('voicePersonalityUpdated', {
      detail: this.settings
    }));
  }

  /**
   * Sync settings with API
   */
  syncWithAPI() {
    // Skip if API endpoint is not configured
    if (!this.config.apiEndpoint) return;
    
    // Prepare data for sync
    const syncData = {
      settings: this.settings,
      culturalContext: this.culturalContext,
      subscriptionLevel: this.subscriptionLevel
    };
    
    // Send data to server
    fetch(this.config.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(syncData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Voice personality settings synced with API:', data);
    })
    .catch(error => {
      console.error('Error syncing voice personality settings with API:', error);
    });
  }

  /**
   * Initialize event listeners
   */
  initEventListeners() {
    // Listen for personality selection
    document.addEventListener('personalitySelected', this.handlePersonalitySelection.bind(this));
    
    // Listen for settings updates
    document.addEventListener('voiceSettingsUpdated', this.handleSettingsUpdate.bind(this));
    
    // Listen for custom response updates
    document.addEventListener('customResponseUpdated', this.handleCustomResponseUpdate.bind(this));
    
    // Listen for settings view requests
    document.addEventListener('viewVoiceSettings', this.handleViewSettingsRequest.bind(this));
    
    // Listen for subscription changes
    document.addEventListener('subscriptionChanged', this.handleSubscriptionChanged.bind(this));
    
    // Listen for cultural context changes
    document.addEventListener('culturalContextChanged', this.handleCulturalContextChanged.bind(this));
    
    // Listen for emotion updates if feature is available
    if (this.canAccessFeature('emotionResponsive')) {
      document.addEventListener('emotionUpdate', this.handleEmotionUpdate.bind(this));
    }
  }

  /**
   * Handle personality selection
   * @param {Event} event - Personality selection event
   */
  handlePersonalitySelection(event) {
    const { personality } = event.detail;
    
    // Update settings
    this.settings.personality = personality;
    
    // Apply personality preset
    this.applyPersonalityPreset(personality);
    
    // Save settings
    this.saveSettings();
    
    console.log(`Voice personality set to: ${personality}`);
    
    // Show notification
    this.showNotification(`Voice personality set to: ${this.getPersonalityName(personality)}`);
  }

  /**
   * Apply personality preset
   * @param {string} personality - Personality preset name
   */
  applyPersonalityPreset(personality) {
    // If personality is custom, don't change settings
    if (personality === 'custom') {
      return;
    }
    
    // Get cultural context version if available
    let culturalContext = 'standard';
    if (this.culturalContext !== 'neutral' && 
        this.personalityPresets[personality] && 
        this.personalityPresets[personality][this.culturalContext]) {
      culturalContext = this.culturalContext;
    } else if (this.culturalContext !== 'neutral' && 
               this.personalityPresets[personality] && 
               this.personalityPresets[personality].arabic) {
      culturalContext = 'arabic';
    }
    
    // Apply preset
    const preset = this.personalityPresets[personality] && 
                   this.personalityPresets[personality][culturalContext];
    
    if (preset) {
      this.settings.tone = preset.tone;
      this.settings.formality = preset.formality;
      this.settings.verbosity = preset.verbosity;
      this.settings.humor = preset.humor;
      
      // Apply response patterns if available
      if (preset.responsePatterns) {
        this.settings.responsePatterns = preset.responsePatterns;
      }
    }
  }

  /**
   * Handle settings update
   * @param {Event} event - Settings update event
   */
  handleSettingsUpdate(event) {
    const { settings } = event.detail;
    
    // Update settings
    Object.assign(this.settings, settings);
    
    // If settings changed significantly, set personality to custom
    if (settings.tone || settings.formality || settings.verbosity || settings.humor) {
      this.settings.personality = 'custom';
    }
    
    // Save settings
    this.saveSettings();
    
    console.log('Voice personality settings updated:', settings);
    
    // Show notification
    this.showNotification('Voice personality settings updated');
  }

  /**
   * Handle custom response update
   * @param {Event} event - Custom response update event
   */
  handleCustomResponseUpdate(event) {
    // Check if feature is available
    if (!this.canAccessFeature('customResponses')) {
      this.showSubscriptionUpgradePrompt('custom responses');
      return;
    }
    
    const { trigger, response } = event.detail;
    
    // Update custom response
    if (response) {
      this.settings.customResponses[trigger] = response;
    } else {
      // If response is null or empty, remove the custom response
      delete this.settings.customResponses[trigger];
    }
    
    // Save settings
    this.saveSettings();
    
    console.log('Custom response updated for trigger:', trigger);
    
    // Show notification
    this.showNotification('Custom response updated');
  }

  /**
   * Handle view settings request
   * @param {Event} event - View settings request event
   */
  handleViewSettingsRequest(event) {
    // Show settings UI
    this.showSettingsUI();
  }

  /**
   * Handle subscription changed event
   * @param {Event} event - Subscription changed event
   */
  handleSubscriptionChanged(event) {
    const { level } = event.detail;
    this.setSubscriptionLevel(level);
    
    // Update UI if visible
    const settingsContainer = document.querySelector('.voice-personality-settings');
    if (settingsContainer) {
      this.updateSettingsUI();
    }
  }

  /**
   * Handle cultural context changed event
   * @param {Event} event - Cultural context changed event
   */
  handleCulturalContextChanged(event) {
    const { context } = event.detail;
    this.setCulturalContext(context);
    
    // Update UI if visible
    const settingsContainer = document.querySelector('.voice-personality-settings');
    if (settingsContainer) {
      this.updateSettingsUI();
    }
  }

  /**
   * Handle emotion update event
   * @param {Event} event - Emotion update event
   */
  handleEmotionUpdate(event) {
    if (!this.canAccessFeature('emotionResponsive') || !this.settings.emotionResponsive) return;
    
    const { emotion, intensity } = event.detail;
    
    // Skip if no emotion or neutral
    if (!emotion || emotion === 'neutral') return;
    
    // Apply emotion-responsive behavior
    this.applyEmotionResponsiveBehavior(emotion, intensity);
  }

  /**
   * Apply emotion-responsive behavior
   * @param {string} emotion - Detected emotion
   * @param {number} intensity - Emotion intensity (0-1)
   */
  applyEmotionResponsiveBehavior(emotion, intensity = 0.5) {
    // Skip if emotion response not defined
    if (!this.emotionResponses[emotion]) return;
    
    const response = this.emotionResponses[emotion];
    const scaledIntensity = Math.min(1, Math.max(0, intensity));
    
    // Store original settings if not already stored
    if (!this.originalSettings) {
      this.originalSettings = {
        tone: this.settings.tone,
        verbosity: this.settings.verbosity,
        humor: this.settings.humor,
        responsePatterns: this.settings.responsePatterns
      };
    }
    
    // Apply emotion-based adjustments
    this.settings.emotionToneShift = response.toneShift;
    
    // Scale adjustments based on intensity
    const verbosityChange = 1 + ((response.verbosityChange - 1) * scaledIntensity);
    const humorChange = 1 + ((response.humorChange - 1) * scaledIntensity);
    
    this.settings.emotionVerbosityMultiplier = verbosityChange;
    this.settings.emotionHumorMultiplier = humorChange;
    
    // Apply emotion-specific response patterns if intensity is high enough
    if (scaledIntensity > 0.5) {
      this.settings.emotionResponsePatterns = response.responsePatterns;
    }
    
    // Save settings
    this.saveSettings();
    
    console.log(`Applied emotion-responsive behavior for ${emotion} with intensity ${scaledIntensity}`);
    
    // Set timeout to revert to original settings
    clearTimeout(this.emotionResponseTimeout);
    this.emotionResponseTimeout = setTimeout(() => {
      this.revertFromEmotionResponse();
    }, 60000); // Revert after 1 minute
  }

  /**
   * Revert from emotion response
   */
  revertFromEmotionResponse() {
    // Skip if no original settings
    if (!this.originalSettings) return;
    
    // Remove emotion-specific settings
    delete this.settings.emotionToneShift;
    delete this.settings.emotionVerbosityMultiplier;
    delete this.settings.emotionHumorMultiplier;
    delete this.settings.emotionResponsePatterns;
    
    // Save settings
    this.saveSettings();
    
    // Clear original settings
    this.originalSettings = null;
    
    console.log('Reverted from emotion-responsive behavior');
  }

  /**
   * Create route handler for /settings/voice
   */
  createRouteHandler() {
    // Check if router is available
    if (!window.router) return;
    
    // Register route handler
    window.router.registerRoute('/settings/voice', () => {
      // Show settings UI
      this.showSettingsUI();
    });
  }

  /**
   * Show settings UI
   */
  showSettingsUI() {
    // Remove existing settings if it exists
    const existingSettings = document.querySelector('.voice-personality-settings');
    if (existingSettings) {
      existingSettings.remove();
    }
    
    // Create settings UI
    const settingsUI = this.createSettingsUI();
    
    // Add to document
    document.body.appendChild(settingsUI);
    
    // Show with animation
    setTimeout(() => {
      settingsUI.classList.add('visible');
    }, 10);
  }

  /**
   * Update settings UI
   */
  updateSettingsUI() {
    const settingsContainer = document.querySelector('.voice-personality-settings');
    if (!settingsContainer) return;
    
    // Remove existing content
    const content = settingsContainer.querySelector('.settings-content');
    if (content) {
      content.remove();
    }
    
    // Create new content
    const newContent = this.createSettingsContent();
    settingsContainer.appendChild(newContent);
    
    // Add event listeners
    this.addSettingsEventListeners(settingsContainer);
  }

  /**
   * Create settings UI
   * @returns {HTMLElement} Settings UI element
   */
  createSettingsUI() {
    const settingsContainer = document.createElement('div');
    settingsContainer.className = 'voice-personality-settings enhanced';
    
    // Add content
    settingsContainer.appendChild(this.createSettingsContent());
    
    // Add event listeners
    this.addSettingsEventListeners(settingsContainer);
    
    return settingsContainer;
  }

  /**
   * Create settings content
   * @returns {HTMLElement} Settings content element
   */
  createSettingsContent() {
    const contentContainer = document.createElement('div');
    contentContainer.className = 'settings-content';
    
    // Check feature access
    const canCustomize = this.canAccessFeature('customPersonality');
    const canUseCustomResponses = this.canAccessFeature('customResponses');
    const canUseDialectCustomization = this.canAccessFeature('dialectCustomization');
    const canUseAdvancedTone = this.canAccessFeature('advancedToneControl');
    const canUseEmotionResponsive = this.canAccessFeature('emotionResponsive');
    
    // Create content HTML
    contentContainer.innerHTML = `
      <div class="settings-header">
        <h2>Voice Personality Settings</h2>
        <div class="cultural-context-selector">
          <label for="cultural-context">Cultural Context:</label>
          <select id="cultural-context">
            <option value="neutral" ${this.culturalContext === 'neutral' ? 'selected' : ''}>Standard</option>
            <option value="levantine" ${this.culturalContext === 'levantine' ? 'selected' : ''}>Levantine Arabic</option>
            <option value="gulf" ${this.culturalContext === 'gulf' ? 'selected' : ''}>Gulf Arabic</option>
            <option value="maghrebi" ${this.culturalContext === 'maghrebi' ? 'selected' : ''}>Maghrebi Arabic</option>
            <option value="egyptian" ${this.culturalContext === 'egyptian' ? 'selected' : ''}>Egyptian Arabic</option>
            <option value="AAVE" ${this.culturalContext === 'AAVE' ? 'selected' : ''}>AAVE English</option>
            <option value="british" ${this.culturalContext === 'british' ? 'selected' : ''}>British English</option>
          </select>
        </div>
        <button class="close-btn">×</button>
      </div>
      
      <div class="settings-body">
        <div class="personality-selection">
          <h3>Personality</h3>
          <div class="personality-options">
            ${this.createPersonalityOptionsHTML()}
          </div>
        </div>
        
        <div class="personality-customization ${canCustomize ? '' : 'premium-locked'}">
          ${!canCustomize ? `
            <div class="premium-overlay">
              <div class="premium-lock-icon"></div>
              <p>Personality customization is available with Basic and Premium plans</p>
              <button class="view-plans-btn">View Plans</button>
            </div>
          ` : ''}
          
          <h3>Customize Personality</h3>
          
          <div class="customization-sliders">
            <div class="slider-group">
              <label>Tone</label>
              <div class="slider-container">
                <span class="slider-min-label">Formal</span>
                <input type="range" class="personality-slider" name="tone" min="0" max="100" value="${this.getToneValue()}" ${!canCustomize ? 'disabled' : ''}>
                <span class="slider-max-label">Friendly</span>
              </div>
            </div>
            
            <div class="slider-group">
              <label>Verbosity</label>
              <div class="slider-container">
                <span class="slider-min-label">Concise</span>
                <input type="range" class="personality-slider" name="verbosity" min="0" max="100" value="${this.getVerbosityValue()}" ${!canCustomize ? 'disabled' : ''}>
                <span class="slider-max-label">Detailed</span>
              </div>
            </div>
            
            <div class="slider-group">
              <label>Humor</label>
              <div class="slider-container">
                <span class="slider-min-label">Serious</span>
                <input type="range" class="personality-slider" name="humor" min="0" max="100" value="${this.getHumorValue()}" ${!canCustomize ? 'disabled' : ''}>
                <span class="slider-max-label">Playful</span>
              </div>
            </div>
            
            ${canUseAdvancedTone ? `
              <div class="slider-group advanced">
                <label>Expressiveness</label>
                <div class="slider-container">
                  <span class="slider-min-label">Reserved</span>
                  <input type="range" class="personality-slider" name="expressiveness" min="0" max="100" value="${this.getExpressivenessValue()}">
                  <span class="slider-max-label">Animated</span>
                </div>
              </div>
              
              <div class="slider-group advanced">
                <label>Empathy</label>
                <div class="slider-container">
                  <span class="slider-min-label">Neutral</span>
                  <input type="range" class="personality-slider" name="empathy" min="0" max="100" value="${this.getEmpathyValue()}">
                  <span class="slider-max-label">Compassionate</span>
                </div>
              </div>
            ` : ''}
          </div>
          
          ${canUseEmotionResponsive ? `
            <div class="emotion-responsive-toggle">
              <label for="emotion-responsive">Emotion-Responsive Behavior</label>
              <div class="toggle-switch">
                <input type="checkbox" id="emotion-responsive" ${this.settings.emotionResponsive ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </div>
              <div class="setting-description">
                <p>When enabled, the assistant will adapt its tone based on your emotional state</p>
              </div>
            </div>
          ` : ''}
          
          ${canUseDialectCustomization ? `
            <div class="dialect-customization">
              <h4>Dialect Customization</h4>
              <div class="dialect-options">
                <div class="dialect-option">
                  <label for="use-dialect-expressions">Use Dialect Expressions</label>
                  <div class="toggle-switch">
                    <input type="checkbox" id="use-dialect-expressions" ${this.settings.useDialectExpressions ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                  </div>
                </div>
                <div class="dialect-option">
                  <label for="dialect-intensity">Dialect Intensity</label>
                  <input type="range" id="dialect-intensity" min="0" max="100" value="${this.getDialectIntensityValue()}">
                </div>
              </div>
            </div>
          ` : ''}
        </div>
        
        <div class="custom-responses ${canUseCustomResponses ? '' : 'premium-locked'}">
          ${!canUseCustomResponses ? `
            <div class="premium-overlay">
              <div class="premium-lock-icon"></div>
              <p>Custom responses are available with Premium plans</p>
              <button class="view-plans-btn">View Plans</button>
            </div>
          ` : ''}
          
          <h3>Custom Responses</h3>
          <p>Create personalized responses for specific triggers</p>
          
          <div class="custom-responses-list">
            ${this.createCustomResponsesHTML()}
          </div>
          
          <div class="add-response-form">
            <input type="text" class="trigger-input" placeholder="When I say..." ${!canUseCustomResponses ? 'disabled' : ''}>
            <input type="text" class="response-input" placeholder="Assistant should say..." ${!canUseCustomResponses ? 'disabled' : ''}>
            <button class="add-response-btn" ${!canUseCustomResponses ? 'disabled' : ''}>Add</button>
          </div>
        </div>
        
        <div class="voice-preview">
          <h3>Preview</h3>
          <p>See how your assistant will respond</p>
          
          <div class="preview-container">
            <div class="preview-message">
              <div class="message-icon user"></div>
              <div class="message-text">Tell me about the stars</div>
            </div>
            
            <div class="preview-response">
              <div class="message-icon assistant"></div>
              <div class="message-text">${this.generatePreviewResponse()}</div>
            </div>
          </div>
          
          <button class="refresh-preview-btn">Refresh Preview</button>
        </div>
      </div>
      
      <div class="settings-footer">
        <button class="save-settings-btn">Save Settings</button>
        <button class="reset-defaults-btn">Reset to Defaults</button>
      </div>
    `;
    
    return contentContainer;
  }

  /**
   * Create personality options HTML
   * @returns {string} HTML for personality options
   */
  createPersonalityOptionsHTML() {
    const personalities = [
      { id: 'cosmic', name: 'Cosmic Guide', description: 'Mystical and inspiring' },
      { id: 'friendly', name: 'Friendly Assistant', description: 'Warm and approachable' },
      { id: 'professional', name: 'Professional Aide', description: 'Efficient and formal' },
      { id: 'playful', name: 'Playful Companion', description: 'Fun and energetic' },
      { id: 'zen', name: 'Zen Master', description: 'Calm and mindful' },
      { id: 'custom', name: 'Custom', description: 'Your personalized settings' }
    ];
    
    return personalities.map(personality => `
      <div class="personality-option ${this.settings.personality === personality.id ? 'selected' : ''}" data-personality="${personality.id}">
        <div class="personality-icon ${personality.id}"></div>
        <div class="personality-info">
          <h4>${personality.name}</h4>
          <p>${personality.description}</p>
        </div>
        <div class="personality-select-indicator"></div>
      </div>
    `).join('');
  }

  /**
   * Create custom responses HTML
   * @returns {string} HTML for custom responses
   */
  createCustomResponsesHTML() {
    const customResponses = this.settings.customResponses;
    
    // If no custom responses, show empty state
    if (!customResponses || Object.keys(customResponses).length === 0) {
      return `
        <div class="empty-responses">
          <p>No custom responses yet. Add your first one below.</p>
        </div>
      `;
    }
    
    // Create responses list
    return `
      <div class="responses-list">
        ${Object.entries(customResponses).map(([trigger, response]) => `
          <div class="response-item" data-trigger="${trigger}">
            <div class="response-content">
              <div class="response-trigger">
                <span class="trigger-label">When I say:</span>
                <span class="trigger-text">${trigger}</span>
              </div>
              <div class="response-text">
                <span class="response-label">Assistant says:</span>
                <span class="response-value">${response}</span>
              </div>
            </div>
            <div class="response-actions">
              <button class="edit-response-btn" data-trigger="${trigger}">Edit</button>
              <button class="delete-response-btn" data-trigger="${trigger}">Delete</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Add event listeners to settings UI
   * @param {HTMLElement} container - Settings container element
   */
  addSettingsEventListeners(container) {
    // Close button
    container.querySelector('.close-btn').addEventListener('click', () => {
      container.classList.remove('visible');
      setTimeout(() => {
        container.remove();
      }, 300);
    });
    
    // Cultural context selector
    const contextSelector = container.querySelector('#cultural-context');
    if (contextSelector) {
      contextSelector.addEventListener('change', (e) => {
        const context = e.target.value;
        document.dispatchEvent(new CustomEvent('culturalContextChanged', {
          detail: { context }
        }));
      });
    }
    
    // Personality options
    container.querySelectorAll('.personality-option').forEach(option => {
      option.addEventListener('click', () => {
        const personality = option.dataset.personality;
        
        // Update UI
        container.querySelectorAll('.personality-option').forEach(opt => {
          opt.classList.remove('selected');
        });
        option.classList.add('selected');
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('personalitySelected', {
          detail: { personality }
        }));
        
        // Update sliders
        if (personality !== 'custom') {
          this.updateSlidersForPersonality(container, personality);
        }
        
        // Update preview
        this.updatePreview(container);
      });
    });
    
    // Personality sliders
    container.querySelectorAll('.personality-slider').forEach(slider => {
      slider.addEventListener('input', () => {
        // Set personality to custom when sliders are adjusted
        const personalityOptions = container.querySelectorAll('.personality-option');
        personalityOptions.forEach(opt => {
          opt.classList.remove('selected');
        });
        const customOption = container.querySelector('.personality-option[data-personality="custom"]');
        if (customOption) {
          customOption.classList.add('selected');
        }
        
        // Update preview
        this.updatePreview(container);
      });
    });
    
    // Emotion-responsive toggle
    const emotionToggle = container.querySelector('#emotion-responsive');
    if (emotionToggle) {
      emotionToggle.addEventListener('change', (e) => {
        this.settings.emotionResponsive = e.target.checked;
        this.saveSettings();
      });
    }
    
    // Dialect customization toggles
    const dialectExpressionsToggle = container.querySelector('#use-dialect-expressions');
    if (dialectExpressionsToggle) {
      dialectExpressionsToggle.addEventListener('change', (e) => {
        this.settings.useDialectExpressions = e.target.checked;
        this.saveSettings();
        this.updatePreview(container);
      });
    }
    
    const dialectIntensitySlider = container.querySelector('#dialect-intensity');
    if (dialectIntensitySlider) {
      dialectIntensitySlider.addEventListener('input', () => {
        this.settings.dialectIntensity = parseInt(dialectIntensitySlider.value) / 100;
        this.saveSettings();
        this.updatePreview(container);
      });
    }
    
    // Add custom response button
    const addResponseBtn = container.querySelector('.add-response-btn');
    if (addResponseBtn) {
      addResponseBtn.addEventListener('click', () => {
        const triggerInput = container.querySelector('.trigger-input');
        const responseInput = container.querySelector('.response-input');
        
        const trigger = triggerInput.value.trim();
        const response = responseInput.value.trim();
        
        if (trigger && response) {
          // Dispatch event
          document.dispatchEvent(new CustomEvent('customResponseUpdated', {
            detail: { trigger, response }
          }));
          
          // Clear inputs
          triggerInput.value = '';
          responseInput.value = '';
          
          // Update UI
          const responsesList = container.querySelector('.custom-responses-list');
          if (responsesList) {
            responsesList.innerHTML = this.createCustomResponsesHTML();
            
            // Re-add event listeners to new elements
            this.addCustomResponseEventListeners(container);
          }
        }
      });
    }
    
    // Add event listeners to custom response buttons
    this.addCustomResponseEventListeners(container);
    
    // Refresh preview button
    const refreshPreviewBtn = container.querySelector('.refresh-preview-btn');
    if (refreshPreviewBtn) {
      refreshPreviewBtn.addEventListener('click', () => {
        this.updatePreview(container);
      });
    }
    
    // Save settings button
    const saveSettingsBtn = container.querySelector('.save-settings-btn');
    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener('click', () => {
        // Get values from sliders
        const settings = {};
        
        container.querySelectorAll('.personality-slider').forEach(slider => {
          const name = slider.getAttribute('name');
          const value = parseInt(slider.value) / 100;
          
          switch (name) {
            case 'tone':
              settings.tone = this.getToneFromValue(value);
              break;
            case 'verbosity':
              settings.verbosity = this.getVerbosityFromValue(value);
              break;
            case 'humor':
              settings.humor = this.getHumorFromValue(value);
              break;
            case 'expressiveness':
              settings.expressiveness = value;
              break;
            case 'empathy':
              settings.empathy = value;
              break;
          }
        });
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('voiceSettingsUpdated', {
          detail: { settings }
        }));
        
        // Show notification
        this.showNotification('Voice personality settings saved');
      });
    }
    
    // Reset defaults button
    const resetDefaultsBtn = container.querySelector('.reset-defaults-btn');
    if (resetDefaultsBtn) {
      resetDefaultsBtn.addEventListener('click', () => {
        // Reset to default settings
        this.settings = this.createDefaultSettings();
        this.saveSettings();
        
        // Update UI
        this.updateSettingsUI();
        
        // Show notification
        this.showNotification('Voice personality settings reset to defaults');
      });
    }
    
    // View plans buttons
    container.querySelectorAll('.view-plans-btn').forEach(button => {
      button.addEventListener('click', () => {
        // Navigate to subscription page
        if (window.router) {
          window.router.navigateTo('/settings/subscription');
        } else {
          window.location.href = '/settings/subscription';
        }
        
        // Close settings
        container.classList.remove('visible');
        setTimeout(() => {
          container.remove();
        }, 300);
      });
    });
  }

  /**
   * Add event listeners to custom response elements
   * @param {HTMLElement} container - Settings container element
   */
  addCustomResponseEventListeners(container) {
    // Edit response buttons
    container.querySelectorAll('.edit-response-btn').forEach(button => {
      button.addEventListener('click', () => {
        const trigger = button.dataset.trigger;
        const response = this.settings.customResponses[trigger];
        
        // Fill form inputs
        const triggerInput = container.querySelector('.trigger-input');
        const responseInput = container.querySelector('.response-input');
        
        if (triggerInput && responseInput) {
          triggerInput.value = trigger;
          responseInput.value = response;
          
          // Focus on response input
          responseInput.focus();
        }
      });
    });
    
    // Delete response buttons
    container.querySelectorAll('.delete-response-btn').forEach(button => {
      button.addEventListener('click', () => {
        const trigger = button.dataset.trigger;
        
        // Dispatch event with null response to delete
        document.dispatchEvent(new CustomEvent('customResponseUpdated', {
          detail: { trigger, response: null }
        }));
        
        // Update UI
        const responsesList = container.querySelector('.custom-responses-list');
        if (responsesList) {
          responsesList.innerHTML = this.createCustomResponsesHTML();
          
          // Re-add event listeners to new elements
          this.addCustomResponseEventListeners(container);
        }
      });
    });
  }

  /**
   * Update sliders for selected personality
   * @param {HTMLElement} container - Settings container element
   * @param {string} personality - Selected personality
   */
  updateSlidersForPersonality(container, personality) {
    // Skip if personality is custom
    if (personality === 'custom') return;
    
    // Get cultural context version if available
    let culturalContext = 'standard';
    if (this.culturalContext !== 'neutral' && 
        this.personalityPresets[personality] && 
        this.personalityPresets[personality][this.culturalContext]) {
      culturalContext = this.culturalContext;
    } else if (this.culturalContext !== 'neutral' && 
               this.personalityPresets[personality] && 
               this.personalityPresets[personality].arabic) {
      culturalContext = 'arabic';
    }
    
    // Get preset
    const preset = this.personalityPresets[personality] && 
                   this.personalityPresets[personality][culturalContext];
    
    if (!preset) return;
    
    // Update sliders
    const toneSlider = container.querySelector('.personality-slider[name="tone"]');
    if (toneSlider) {
      toneSlider.value = this.getToneValue(preset.tone);
    }
    
    const verbositySlider = container.querySelector('.personality-slider[name="verbosity"]');
    if (verbositySlider) {
      verbositySlider.value = this.getVerbosityValue(preset.verbosity);
    }
    
    const humorSlider = container.querySelector('.personality-slider[name="humor"]');
    if (humorSlider) {
      humorSlider.value = this.getHumorValue(preset.humor);
    }
  }

  /**
   * Update preview response
   * @param {HTMLElement} container - Settings container element
   */
  updatePreview(container) {
    // Get current settings from UI
    const personality = container.querySelector('.personality-option.selected')?.dataset.personality || this.settings.personality;
    
    // Get values from sliders
    const toneValue = parseInt(container.querySelector('.personality-slider[name="tone"]')?.value || 50) / 100;
    const verbosityValue = parseInt(container.querySelector('.personality-slider[name="verbosity"]')?.value || 50) / 100;
    const humorValue = parseInt(container.querySelector('.personality-slider[name="humor"]')?.value || 50) / 100;
    
    // Generate preview with these settings
    const previewSettings = {
      personality,
      tone: this.getToneFromValue(toneValue),
      verbosity: this.getVerbosityFromValue(verbosityValue),
      humor: this.getHumorFromValue(humorValue)
    };
    
    // Update preview text
    const previewText = container.querySelector('.preview-response .message-text');
    if (previewText) {
      previewText.textContent = this.generatePreviewResponse(previewSettings);
    }
  }

  /**
   * Generate preview response
   * @param {Object} settings - Settings to use for preview
   * @returns {string} Preview response
   */
  generatePreviewResponse(settings = null) {
    // Use provided settings or current settings
    const previewSettings = settings || this.settings;
    
    // Base response
    let baseResponse = "Stars are luminous spheres of plasma held together by gravity. They emit light and heat from nuclear fusion reactions in their cores. Our sun is the closest star to Earth.";
    
    // Adjust verbosity
    if (previewSettings.verbosity === 'concise' || 
        (typeof previewSettings.verbosity === 'number' && previewSettings.verbosity < 0.3)) {
      baseResponse = "Stars are massive balls of gas that produce light and heat through nuclear fusion.";
    } else if (previewSettings.verbosity === 'poetic' || 
               (typeof previewSettings.verbosity === 'number' && previewSettings.verbosity > 0.7)) {
      baseResponse = "Stars are celestial beacons, vast spheres of luminous plasma dancing across the cosmic tapestry. They radiate with the energy of countless nuclear furnaces, transforming hydrogen into helium in their fiery hearts. Our sun, a modest yellow dwarf, is but one of billions in our galaxy alone, each with its own story written in light across the vastness of space.";
    }
    
    // Add humor if appropriate
    if (previewSettings.humor === 'high' || 
        (typeof previewSettings.humor === 'number' && previewSettings.humor > 0.7)) {
      baseResponse += " They're basically cosmic nightlights, except they'll burn you to a crisp if you get too close!";
    } else if (previewSettings.humor === 'moderate' || 
               (typeof previewSettings.humor === 'number' && previewSettings.humor > 0.4)) {
      baseResponse += " Think of them as nature's disco balls, but with more hydrogen and less glitter.";
    }
    
    // Apply personality wrapper
    let response = baseResponse;
    
    // Get cultural context version if available
    let culturalContext = 'standard';
    if (this.culturalContext !== 'neutral' && 
        this.personalityPresets[previewSettings.personality] && 
        this.personalityPresets[previewSettings.personality][this.culturalContext]) {
      culturalContext = this.culturalContext;
    } else if (this.culturalContext !== 'neutral' && 
               this.personalityPresets[previewSettings.personality] && 
               this.personalityPresets[previewSettings.personality].arabic) {
      culturalContext = 'arabic';
    }
    
    // Get preset
    const preset = this.personalityPresets[previewSettings.personality] && 
                   this.personalityPresets[previewSettings.personality][culturalContext];
    
    if (preset && preset.responsePatterns) {
      const pattern = preset.responsePatterns[Math.floor(Math.random() * preset.responsePatterns.length)];
      response = pattern.replace('{response}', baseResponse);
    }
    
    // Apply dialect expressions if enabled
    if (this.settings.useDialectExpressions && 
        this.dialectTraits[this.culturalContext] && 
        this.dialectTraits[this.culturalContext].commonPhrases) {
      
      const phrases = this.dialectTraits[this.culturalContext].commonPhrases;
      const phrase = phrases[Math.floor(Math.random() * phrases.length)];
      
      // Add phrase at beginning or end based on dialect style
      if (Math.random() > 0.5) {
        response = `${phrase}, ${response}`;
      } else {
        response = `${response} ${phrase}`;
      }
    }
    
    return response;
  }

  /**
   * Show notification
   * @param {string} message - Notification message
   */
  showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'voice-personality-notification';
    notification.textContent = message;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
      notification.classList.add('visible');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
      notification.classList.remove('visible');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  /**
   * Show subscription upgrade prompt
   * @param {string} feature - Feature name
   */
  showSubscriptionUpgradePrompt(feature) {
    // Create upgrade prompt
    const upgradePrompt = document.createElement('div');
    upgradePrompt.className = 'subscription-upgrade-prompt';
    
    upgradePrompt.innerHTML = `
      <div class="upgrade-content">
        <h3>Premium Feature</h3>
        <p>${feature} are available with our Premium subscription.</p>
        <div class="upgrade-actions">
          <button class="upgrade-btn">Upgrade Now</button>
          <button class="cancel-btn">Maybe Later</button>
        </div>
      </div>
    `;
    
    // Add event listeners
    upgradePrompt.querySelector('.upgrade-btn').addEventListener('click', () => {
      // Navigate to subscription page
      if (window.router) {
        window.router.navigateTo('/settings/subscription');
      } else {
        window.location.href = '/settings/subscription';
      }
      
      // Remove prompt
      upgradePrompt.remove();
    });
    
    upgradePrompt.querySelector('.cancel-btn').addEventListener('click', () => {
      // Remove prompt
      upgradePrompt.remove();
    });
    
    // Add to document
    document.body.appendChild(upgradePrompt);
    
    // Show with animation
    setTimeout(() => {
      upgradePrompt.classList.add('visible');
    }, 10);
  }

  /**
   * Get personality name
   * @param {string} personalityId - Personality ID
   * @returns {string} Personality name
   */
  getPersonalityName(personalityId) {
    const personalityNames = {
      cosmic: 'Cosmic Guide',
      friendly: 'Friendly Assistant',
      professional: 'Professional Aide',
      playful: 'Playful Companion',
      zen: 'Zen Master',
      custom: 'Custom'
    };
    
    return personalityNames[personalityId] || personalityId;
  }

  /**
   * Get tone value for slider
   * @param {string|number} tone - Tone setting
   * @returns {number} Tone value (0-100)
   */
  getToneValue(tone = null) {
    // Use provided tone or current setting
    const currentTone = tone || this.settings.tone;
    
    // If already a number, return scaled value
    if (typeof currentTone === 'number') {
      return Math.round(currentTone * 100);
    }
    
    // Map tone names to values
    const toneValues = {
      formal: 0,
      respectful: 25,
      balanced: 50,
      warm: 75,
      friendly: 100,
      mystical: 60,
      energetic: 85,
      calm: 40
    };
    
    return toneValues[currentTone] || 50;
  }

  /**
   * Get verbosity value for slider
   * @param {string|number} verbosity - Verbosity setting
   * @returns {number} Verbosity value (0-100)
   */
  getVerbosityValue(verbosity = null) {
    // Use provided verbosity or current setting
    const currentVerbosity = verbosity || this.settings.verbosity;
    
    // If already a number, return scaled value
    if (typeof currentVerbosity === 'number') {
      return Math.round(currentVerbosity * 100);
    }
    
    // Map verbosity names to values
    const verbosityValues = {
      minimal: 0,
      concise: 25,
      balanced: 50,
      conversational: 75,
      detailed: 100,
      poetic: 85,
      chatty: 90
    };
    
    return verbosityValues[currentVerbosity] || 50;
  }

  /**
   * Get humor value for slider
   * @param {string|number} humor - Humor setting
   * @returns {number} Humor value (0-100)
   */
  getHumorValue(humor = null) {
    // Use provided humor or current setting
    const currentHumor = humor || this.settings.humor;
    
    // If already a number, return scaled value
    if (typeof currentHumor === 'number') {
      return Math.round(currentHumor * 100);
    }
    
    // Map humor names to values
    const humorValues = {
      minimal: 0,
      subtle: 25,
      moderate: 50,
      playful: 75,
      high: 100
    };
    
    return humorValues[currentHumor] || 50;
  }

  /**
   * Get expressiveness value for slider
   * @returns {number} Expressiveness value (0-100)
   */
  getExpressivenessValue() {
    return Math.round((this.settings.expressiveness || 0.5) * 100);
  }

  /**
   * Get empathy value for slider
   * @returns {number} Empathy value (0-100)
   */
  getEmpathyValue() {
    return Math.round((this.settings.empathy || 0.5) * 100);
  }

  /**
   * Get dialect intensity value for slider
   * @returns {number} Dialect intensity value (0-100)
   */
  getDialectIntensityValue() {
    return Math.round((this.settings.dialectIntensity || 0.5) * 100);
  }

  /**
   * Get tone from slider value
   * @param {number} value - Slider value (0-1)
   * @returns {string} Tone name
   */
  getToneFromValue(value) {
    if (value < 0.2) return 'formal';
    if (value < 0.4) return 'respectful';
    if (value < 0.6) return 'balanced';
    if (value < 0.8) return 'warm';
    return 'friendly';
  }

  /**
   * Get verbosity from slider value
   * @param {number} value - Slider value (0-1)
   * @returns {string} Verbosity name
   */
  getVerbosityFromValue(value) {
    if (value < 0.2) return 'minimal';
    if (value < 0.4) return 'concise';
    if (value < 0.6) return 'balanced';
    if (value < 0.8) return 'conversational';
    return 'detailed';
  }

  /**
   * Get humor from slider value
   * @param {number} value - Slider value (0-1)
   * @returns {string} Humor name
   */
  getHumorFromValue(value) {
    if (value < 0.2) return 'minimal';
    if (value < 0.4) return 'subtle';
    if (value < 0.6) return 'moderate';
    if (value < 0.8) return 'playful';
    return 'high';
  }

  /**
   * Process response with personality
   * @param {string} baseResponse - Base response text
   * @param {Object} options - Processing options
   * @returns {string} Processed response
   */
  processResponse(baseResponse, options = {}) {
    // Skip if not initialized
    if (!this.isInitialized) return baseResponse;
    
    // Default options
    const processingOptions = {
      emotion: null,
      context: null,
      ...options
    };
    
    // Start with base response
    let response = baseResponse;
    
    // Apply personality formatting
    response = this.applyPersonalityFormatting(response, processingOptions);
    
    // Apply emotion-responsive behavior if enabled
    if (this.settings.emotionResponsive && processingOptions.emotion) {
      response = this.applyEmotionFormatting(response, processingOptions.emotion);
    }
    
    // Apply dialect formatting if enabled
    if (this.settings.useDialectExpressions && this.dialectTraits[this.culturalContext]) {
      response = this.applyDialectFormatting(response);
    }
    
    // Check for custom responses
    if (processingOptions.context && this.settings.customResponses[processingOptions.context]) {
      return this.settings.customResponses[processingOptions.context];
    }
    
    return response;
  }

  /**
   * Apply personality formatting to response
   * @param {string} response - Base response text
   * @param {Object} options - Processing options
   * @returns {string} Formatted response
   */
  applyPersonalityFormatting(response, options) {
    // Get cultural context version if available
    let culturalContext = 'standard';
    if (this.culturalContext !== 'neutral' && 
        this.personalityPresets[this.settings.personality] && 
        this.personalityPresets[this.settings.personality][this.culturalContext]) {
      culturalContext = this.culturalContext;
    } else if (this.culturalContext !== 'neutral' && 
               this.personalityPresets[this.settings.personality] && 
               this.personalityPresets[this.settings.personality].arabic) {
      culturalContext = 'arabic';
    }
    
    // Get preset
    const preset = this.personalityPresets[this.settings.personality] && 
                   this.personalityPresets[this.settings.personality][culturalContext];
    
    if (preset && preset.responsePatterns) {
      const pattern = preset.responsePatterns[Math.floor(Math.random() * preset.responsePatterns.length)];
      return pattern.replace('{response}', response);
    }
    
    return response;
  }

  /**
   * Apply emotion formatting to response
   * @param {string} response - Base response text
   * @param {string} emotion - Current emotion
   * @returns {string} Emotion-formatted response
   */
  applyEmotionFormatting(response, emotion) {
    // Skip if emotion not defined
    if (!emotion || !this.emotionResponses[emotion]) return response;
    
    const emotionResponse = this.emotionResponses[emotion];
    
    // Apply emotion-specific pattern
    if (emotionResponse.responsePatterns && Math.random() > 0.5) {
      const pattern = emotionResponse.responsePatterns[Math.floor(Math.random() * emotionResponse.responsePatterns.length)];
      return pattern.replace('{response}', response);
    }
    
    return response;
  }

  /**
   * Apply dialect formatting to response
   * @param {string} response - Base response text
   * @returns {string} Dialect-formatted response
   */
  applyDialectFormatting(response) {
    // Skip if dialect not defined
    if (!this.dialectTraits[this.culturalContext]) return response;
    
    const dialectTrait = this.dialectTraits[this.culturalContext];
    const intensity = this.settings.dialectIntensity || 0.5;
    
    // Skip randomly based on intensity
    if (Math.random() > intensity) return response;
    
    // Add dialect phrase
    if (dialectTrait.commonPhrases && dialectTrait.commonPhrases.length > 0) {
      const phrase = dialectTrait.commonPhrases[Math.floor(Math.random() * dialectTrait.commonPhrases.length)];
      
      // Add phrase at beginning or end based on dialect style
      if (Math.random() > 0.5) {
        return `${phrase}, ${response}`;
      } else {
        return `${response} ${phrase}`;
      }
    }
    
    return response;
  }

  /**
   * Clean up and release resources
   */
  destroy() {
    console.log('Cleaning up Enhanced Voice Personality...');
    
    // Save settings
    this.saveSettings();
    
    // Remove event listeners
    document.removeEventListener('personalitySelected', this.handlePersonalitySelection);
    document.removeEventListener('voiceSettingsUpdated', this.handleSettingsUpdate);
    document.removeEventListener('customResponseUpdated', this.handleCustomResponseUpdate);
    document.removeEventListener('viewVoiceSettings', this.handleViewSettingsRequest);
    document.removeEventListener('subscriptionChanged', this.handleSubscriptionChanged);
    document.removeEventListener('culturalContextChanged', this.handleCulturalContextChanged);
    document.removeEventListener('emotionUpdate', this.handleEmotionUpdate);
    
    // Clear timeouts
    clearTimeout(this.emotionResponseTimeout);
    
    // Remove UI elements
    const settingsContainer = document.querySelector('.voice-personality-settings');
    if (settingsContainer) {
      settingsContainer.remove();
    }
    
    const notifications = document.querySelectorAll('.voice-personality-notification');
    notifications.forEach(notification => {
      notification.remove();
    });
    
    this.isInitialized = false;
    console.log('Enhanced Voice Personality cleaned up');
  }
}

// Export the voice personality module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VoicePersonality };
} else {
  window.voicePersonality = new VoicePersonality();
}
