/**
 * Theme Service
 * 
 * This service encapsulates the functionality for managing the application's theme and styling.
 * It replaces the direct theme management in the application.
 */

import { initializeCosmicTheme, getCosmicTheme } from '../../theme/cosmic-theme.js';
import { initializeCosmicVoiceIntegration, ensureCosmicNebulaEffect } from '../../integration/cosmic_voice_integration.js';

export class ThemeService {
  constructor() {
    this.isInitialized = false;
    this.configService = null;
    this.emotionService = null;
    this.themeSettings = {
      accentColor: '#9370db',
      darkMode: false,
      fontScale: 1.0,
      animationsEnabled: true
    };
    this.cosmicTheme = null;
  }

  /**
   * Initialize the theme service
   * @param {ConfigService} configService - Config service instance
   * @param {EmotionService} emotionService - Emotion service instance
   * @returns {ThemeService} - This instance for chaining
   */
  initialize(configService, emotionService) {
    if (this.isInitialized) return this;

    this.configService = configService;
    this.emotionService = emotionService;

    // Get configuration values
    this.themeSettings = {
      accentColor: configService.get('theme.accentColor', '#9370db'),
      darkMode: configService.get('theme.darkMode', false),
      fontScale: configService.get('theme.fontScale', 1.0),
      animationsEnabled: configService.get('theme.animationsEnabled', true),
      emotionBasedTheme: configService.get('theme.emotionBasedTheme', true)
    };

    // Initialize cosmic theme
    this.initializeTheme();

    // Register emotion listener to update theme based on emotions
    if (this.emotionService && this.themeSettings.emotionBasedTheme) {
      this.registerEmotionListener();
    }

    this.isInitialized = true;
    console.log("✅ Theme service initialized");
    return this;
  }

  /**
   * Register emotion listener to update theme based on emotions
   * @private
   */
  registerEmotionListener() {
    this.emotionService.addEmotionListener((update) => {
      this.applyEmotionBasedTheme(update.emotion);
    });
    console.log("✅ Emotion listener registered for theme updates");
  }

  /**
   * Initialize the theme
   * @private
   */
  initializeTheme() {
    try {
      // Initialize cosmic theme
      initializeCosmicTheme();

      // Get cosmic theme instance
      this.cosmicTheme = getCosmicTheme();

      if (this.cosmicTheme) {
        // Apply theme settings
        this.cosmicTheme.settings.accentColor = this.themeSettings.accentColor;
        this.cosmicTheme.settings.darkMode = this.themeSettings.darkMode;
        this.cosmicTheme.settings.fontScale = this.themeSettings.fontScale;
        this.cosmicTheme.settings.animationsEnabled = this.themeSettings.animationsEnabled;

        // Apply the theme
        this.cosmicTheme.applyTheme();

        // Initialize cosmic voice integration
        ensureCosmicNebulaEffect();
        initializeCosmicVoiceIntegration();

        console.log('Cosmic theme initialized and applied');
      } else {
        console.warn('Cosmic theme not available');
      }
    } catch (error) {
      console.error('Error initializing theme:', error);
    }
  }

  /**
   * Apply dynamic styling to text based on emotion
   * @param {string} text - Text to style
   * @param {string} emotion - Emotion to apply
   * @returns {string} - Styled text
   */
  applyDynamicStyling(text, emotion) {
    if (!text) return '';

    try {
      // Simple styling based on emotion
      const emotionStyles = {
        happy: { color: '#50fa7b', fontWeight: 'bold' },
        sad: { color: '#6272a4', fontStyle: 'italic' },
        angry: { color: '#ff5555', textTransform: 'uppercase' },
        confident: { color: '#00ced1', textDecoration: 'underline' },
        neutral: { color: '#f8f8f2' }
      };

      const style = emotionStyles[emotion] || emotionStyles.neutral;

      // Apply style to text (in a real implementation, this would be more sophisticated)
      // For now, we'll just wrap the text in a span with inline styles
      return `<span style="color: ${style.color};">${text}</span>`;
    } catch (error) {
      console.error('Error applying dynamic styling:', error);
      return text;
    }
  }

  /**
   * Apply styling to an element
   * @param {HTMLElement} element - Element to style
   * @param {string} text - Text content
   * @param {string} emotion - Emotion to apply
   */
  applyToElement(element, text, emotion = 'neutral') {
    if (!element) return;

    try {
      // Get emotion color
      const emotionColor = this.emotionService?.getEmotionColor(emotion) || '#9370db';

      // Apply styles to element
      element.style.borderLeft = `4px solid ${emotionColor}`;
      element.style.paddingLeft = '10px';

      // Apply additional styles based on emotion
      switch (emotion) {
        case 'happy':
          element.style.backgroundColor = 'rgba(80, 250, 123, 0.1)';
          break;
        case 'sad':
          element.style.backgroundColor = 'rgba(98, 114, 164, 0.1)';
          break;
        case 'angry':
          element.style.backgroundColor = 'rgba(255, 85, 85, 0.1)';
          break;
        case 'confident':
          element.style.backgroundColor = 'rgba(0, 206, 209, 0.1)';
          break;
        default:
          element.style.backgroundColor = 'rgba(147, 112, 219, 0.1)';
      }
    } catch (error) {
      console.error('Error applying styles to element:', error);
    }
  }

  /**
   * Filter sensitive topics from text
   * @param {string} text - Text to filter
   * @returns {string} - Filtered text
   */
  filterSensitiveTopics(text) {
    if (!text) return '';

    // List of sensitive topics to filter
    const sensitiveTopics = [
      'politics',
      'religion',
      'adult content',
      // Add more sensitive topics as needed
    ];

    // Simple filtering (in a real implementation, this would be more sophisticated)
    let filteredText = text;
    sensitiveTopics.forEach(topic => {
      const regex = new RegExp(topic, 'gi');
      filteredText = filteredText.replace(regex, '[filtered]');
    });

    return filteredText;
  }

  /**
   * Set theme setting
   * @param {string} setting - Setting name
   * @param {*} value - Setting value
   */
  setThemeSetting(setting, value) {
    if (!Object.prototype.hasOwnProperty.call(this.themeSettings, setting)) {
      console.warn(`Unknown theme setting: ${setting}`);
      return;
    }

    this.themeSettings[setting] = value;

    // Update config
    if (this.configService) {
      this.configService.set(`theme.${setting}`, value);
    }

    // Apply to cosmic theme
    if (this.cosmicTheme) {
      this.cosmicTheme.settings[setting] = value;
      this.cosmicTheme.applyTheme();
    }
  }

  /**
   * Get theme setting
   * @param {string} setting - Setting name
   * @returns {*} - Setting value
   */
  getThemeSetting(setting) {
    return this.themeSettings[setting];
  }

  /**
   * Get all theme settings
   * @returns {Object} - All theme settings
   */
  getAllThemeSettings() {
    return { ...this.themeSettings };
  }

  /**
   * Toggle dark mode
   * @returns {boolean} - New dark mode state
   */
  toggleDarkMode() {
    const newDarkMode = !this.themeSettings.darkMode;
    this.setThemeSetting('darkMode', newDarkMode);
    return newDarkMode;
  }

  /**
   * Apply the current theme settings
   * @returns {ThemeService} - This instance for chaining
   */
  applyCurrentTheme() {
    try {
      if (this.cosmicTheme) {
        // Apply theme settings
        this.cosmicTheme.settings.accentColor = this.themeSettings.accentColor;
        this.cosmicTheme.settings.darkMode = this.themeSettings.darkMode;
        this.cosmicTheme.settings.fontScale = this.themeSettings.fontScale;
        this.cosmicTheme.settings.animationsEnabled = this.themeSettings.animationsEnabled;

        // Apply the theme
        this.cosmicTheme.applyTheme();
        console.log('Current theme applied');
      } else {
        console.warn('Cosmic theme not available for applying current theme');
        this.initializeTheme();
      }
    } catch (error) {
      console.error('Error applying current theme:', error);
    }
    return this;
  }

  /**
   * Apply emotion-based theme
   * @param {string} emotion - Emotion to apply theme for
   * @returns {ThemeService} - This instance for chaining
   */
  applyEmotionBasedTheme(emotion) {
    if (!this.themeSettings.emotionBasedTheme) {
      return this;
    }

    try {
      if (this.cosmicTheme) {
        // Apply emotion to the cosmic theme
        this.cosmicTheme.setEmotion(emotion);
        console.log(`Applied emotion-based theme for: ${emotion}`);
      } else {
        console.warn('Cosmic theme not available for applying emotion-based theme');
      }
    } catch (error) {
      console.error('Error applying emotion-based theme:', error);
    }

    return this;
  }

  /**
   * Toggle emotion-based theme
   * @returns {boolean} - New emotion-based theme state
   */
  toggleEmotionBasedTheme() {
    const newState = !this.themeSettings.emotionBasedTheme;
    this.themeSettings.emotionBasedTheme = newState;

    // Update config
    if (this.configService) {
      this.configService.set('theme.emotionBasedTheme', newState);
    }

    // If turning on, register listener if not already registered
    if (newState && this.emotionService) {
      this.registerEmotionListener();
    }

    // If turning off, reset to default theme
    if (!newState && this.cosmicTheme) {
      this.cosmicTheme.settings.currentEmotion = 'neutral';
      this.applyCurrentTheme();
    }

    return newState;
  }
}
