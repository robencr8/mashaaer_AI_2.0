/**
 * Mashaaer Enhanced Project
 * Voice Module
 *
 * This module provides functions for voice synthesis and response.
 */

import { requestTTS, playAudioBlob } from '../../api/flask-api-service.js';

// Global mashaaer object for voice functions
if (typeof window !== 'undefined' && !window.mashaaer) {
  window.mashaaer = {
    voice: {
      // Current voice settings
      settings: {
        useFlaskTTS: true,  // Whether to use Flask TTS or Web Speech API
        emotionMode: 'neutral',
        pitch: 1.0
      },

      speak: async (text, emotionType = 'neutral') => {
        console.log(`Speaking: "${text}" with emotion: ${emotionType}`);

        // Use Flask TTS if enabled
        if (window.mashaaer.voice.settings.useFlaskTTS) {
          try {
            // Request TTS from Flask backend
            const audioBlob = await requestTTS(text, emotionType);

            // Play the audio
            await playAudioBlob(audioBlob);
            return;
          } catch (error) {
            console.warn('Flask TTS failed, falling back to Web Speech API:', error);
            // Fall back to Web Speech API
          }
        }

        // Use the Web Speech API if Flask TTS is disabled or failed
        if (window.speechSynthesis) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'ar-SA';

          // Set pitch and rate based on emotion
          switch (emotionType) {
            case 'happy':
              utterance.pitch = 1.2;
              utterance.rate = 1.1;
              break;
            case 'sad':
              utterance.pitch = 0.8;
              utterance.rate = 0.9;
              break;
            case 'angry':
              utterance.pitch = 1.0;
              utterance.rate = 1.2;
              break;
            case 'anxious':
              utterance.pitch = 1.1;
              utterance.rate = 1.3;
              break;
            default:
              utterance.pitch = 1.0;
              utterance.rate = 1.0;
          }

          window.speechSynthesis.speak(utterance);

          return new Promise((resolve) => {
            utterance.onend = () => resolve();
          });
        }

        // Fallback for environments without speech synthesis
        return Promise.resolve();
      },

      // Toggle between Flask TTS and Web Speech API
      toggleTTSMode: () => {
        window.mashaaer.voice.settings.useFlaskTTS = !window.mashaaer.voice.settings.useFlaskTTS;
        console.log(`TTS Mode set to: ${window.mashaaer.voice.settings.useFlaskTTS ? 'Flask TTS' : 'Web Speech API'}`);
        return window.mashaaer.voice.settings.useFlaskTTS;
      },

      setEmotionMode: (mode) => {
        window.mashaaer.voice.settings.emotionMode = mode;
        console.log(`Setting emotion mode to: ${mode}`);
      },

      setPitch: (pitch) => {
        window.mashaaer.voice.settings.pitch = pitch;
        console.log(`Setting pitch to: ${pitch}`);
      }
    }
  };
}

/**
 * Play voice response
 * @param {Object} options - Options for voice response
 * @param {string} options.text - Text to speak
 * @param {Object} options.emotion - Emotion object
 */
export function playVoiceResponse(options) {
  const { text, emotion } = options;

  if (!text) return;

  const emotionType = emotion?.type || 'neutral';

  if (typeof window !== 'undefined' && window.mashaaer?.voice) {
    window.mashaaer.voice.speak(text, emotionType);
  } else {
    console.log(`Would speak: "${text}" with emotion: ${emotionType}`);
  }
}

/**
 * Initialize voice module
 */
export function initializeVoice() {
  console.log('Voice module initialized');

  // Check if speech synthesis is available
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    // Load voices
    window.speechSynthesis.onvoiceschanged = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log(`Loaded ${voices.length} voices`);
    };
  }
}
