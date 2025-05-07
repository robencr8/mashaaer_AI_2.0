/**
 * Voice Service
 * 
 * This service encapsulates the functionality for text-to-speech and voice-related features.
 * It replaces the direct voice functionality in the application.
 */

import { speakWithElevenLabs } from '../../utils/text-to-speech.js';
import { playVoiceResponse } from '../../static/js/MashaaerVoice.js';

export class VoiceService {
  constructor() {
    this.isInitialized = false;
    this.configService = null;
    this.emotionService = null;
    this.useElevenLabs = false;
    this.elevenlabsApiKey = '';
    this.speechSynthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voiceEnabled = true;
  }

  /**
   * Initialize the voice service
   * @param {ConfigService} configService - Config service instance
   * @param {EmotionService} emotionService - Emotion service instance
   * @returns {VoiceService} - This instance for chaining
   */
  initialize(configService, emotionService) {
    if (this.isInitialized) return this;

    this.configService = configService;
    this.emotionService = emotionService;

    // Get configuration values
    this.voiceEnabled = configService.get('voice.enabled', true);
    this.useElevenLabs = configService.get('voice.useElevenLabs', false);
    this.elevenlabsApiKey = configService.get('voice.elevenlabsApiKey', '');

    this.isInitialized = true;
    console.log("✅ Voice service initialized");
    return this;
  }

  /**
   * Speak a reply
   * @param {string} reply - Text to speak
   * @param {string} emotion - Emotion to express
   * @param {string} voiceProfile - Voice profile to use
   */
  speakReply(reply, emotion = 'neutral', voiceProfile = null) {
    if (!this.voiceEnabled) {
      console.log('Voice is disabled. Would speak:', reply);
      return;
    }

    // Try to use ElevenLabs if enabled and API key is available
    if (this.useElevenLabs && this.elevenlabsApiKey) {
      try {
        console.log('Using ElevenLabs for TTS');
        speakWithElevenLabs(reply, emotion, voiceProfile);
        return;
      } catch (error) {
        console.error('Error using ElevenLabs TTS:', error);
        // Fall back to browser TTS if ElevenLabs fails
      }
    }

    // Use browser's built-in TTS as fallback with emotional expression
    this.speakWithBrowserTTS(reply, emotion, voiceProfile);
  }

  /**
   * Speak with browser TTS
   * @param {string} text - Text to speak
   * @param {string} emotion - Emotion to express
   * @param {string} voiceProfile - Voice profile to use
   * @private
   */
  speakWithBrowserTTS(text, emotion = 'neutral', voiceProfile = null) {
    // Skip if speech synthesis is not available
    if (!this.speechSynthesis) {
      console.warn('Speech synthesis is not available.');
      return;
    }

    // Skip actual speech in non-browser environments
    if (typeof window === 'undefined') {
      console.log(`Would speak: "${text}" with emotion: ${emotion}`);
      return;
    }

    // Initialize speech utterance
    const utterance = new SpeechSynthesisUtterance(text);

    // Emotion settings
    const emotionSettings = {
      happy: { pitch: 1.2, rate: 1.1 },
      sad: { pitch: 0.8, rate: 0.9 },
      angry: { pitch: 1.5, rate: 1.3 },
      confident: { pitch: 1.1, rate: 1.0 },
      neutral: { pitch: 1.0, rate: 1.0 }
    };

    // Apply emotion settings
    const settings = emotionSettings[emotion] || emotionSettings.neutral;
    utterance.pitch = settings.pitch;
    utterance.rate = settings.rate;

    // Set language (Arabic by default)
    utterance.lang = 'ar-SA';

    // Try to find the requested voice profile
    if (voiceProfile && this.speechSynthesis.getVoices().length > 0) {
      const voices = this.speechSynthesis.getVoices();
      const selectedVoice = voices.find(v => v.name.includes(voiceProfile));
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    // Speak the text
    try {
      if (this.speechSynthesis.speaking) {
        this.speechSynthesis.cancel();
      }
      this.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error during speech synthesis:', error);
    }
  }

  /**
   * Play a voice response using the MashaaerVoice module
   * @param {Object} options - Voice response options
   */
  playVoiceResponse(options) {
    if (!this.voiceEnabled) {
      console.log('Voice is disabled. Would play voice response:', options);
      return;
    }

    try {
      playVoiceResponse(options);
    } catch (error) {
      console.error('Error playing voice response:', error);
      // Fall back to regular TTS
      this.speakReply(options.text, options.emotion, options.voiceProfile);
    }
  }

  /**
   * Set voice enabled state
   * @param {boolean} enabled - Whether voice is enabled
   */
  setVoiceEnabled(enabled) {
    this.voiceEnabled = enabled;
    if (this.configService) {
      this.configService.set('voice.enabled', enabled);
    }
  }

  /**
   * Get available voices
   * @returns {Array} - Array of available voices
   */
  getAvailableVoices() {
    if (!this.speechSynthesis) {
      return [];
    }
    return this.speechSynthesis.getVoices();
  }
}
