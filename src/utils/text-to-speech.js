/**
 * Emotional Voice Expression Module
 * 
 * This module enhances speech synthesis with emotional expression:
 * - Maps emotions to voice characteristics
 * - Adjusts pitch, rate, and volume based on emotional context
 * - Supports both ElevenLabs API and browser's built-in TTS
 */

// Emotion to voice characteristics mapping
const emotionVoiceMap = {
  happy: {
    pitch: 1.2,
    rate: 1.1,
    volume: 1.0,
    stability: 0.4,
    similarity_boost: 0.7,
    style: 0.7 // For ElevenLabs style parameter (enthusiasm)
  },
  sad: {
    pitch: 0.8,
    rate: 0.85,
    volume: 0.8,
    stability: 0.7,
    similarity_boost: 0.8,
    style: 0.3 // For ElevenLabs style parameter (sadness)
  },
  angry: {
    pitch: 1.1,
    rate: 1.2,
    volume: 1.0,
    stability: 0.3,
    similarity_boost: 0.6,
    style: 0.8 // For ElevenLabs style parameter (intensity)
  },
  anxious: {
    pitch: 1.1,
    rate: 1.15,
    volume: 0.9,
    stability: 0.5,
    similarity_boost: 0.7,
    style: 0.5 // For ElevenLabs style parameter (nervousness)
  },
  neutral: {
    pitch: 1.0,
    rate: 1.0,
    volume: 1.0,
    stability: 0.5,
    similarity_boost: 0.8,
    style: 0.5 // Default style
  },
  confident: {
    pitch: 1.1,
    rate: 1.05,
    volume: 1.0,
    stability: 0.6,
    similarity_boost: 0.8,
    style: 0.7 // For ElevenLabs style parameter (confidence)
  },
  calm: {
    pitch: 0.9,
    rate: 0.9,
    volume: 0.9,
    stability: 0.7,
    similarity_boost: 0.8,
    style: 0.4 // For ElevenLabs style parameter (calmness)
  }
};

/**
 * Speak text using ElevenLabs API with emotional expression
 * @param {string} text - Text to speak
 * @param {string} emotion - Emotion to express (happy, sad, angry, etc.)
 * @param {string} voiceId - Optional voice ID to use
 */
export const speakWithElevenLabs = async (text, emotion = 'neutral', voiceId = null) => {
  // Use provided voice ID or default
  const selectedVoiceId = voiceId || '21m00Tcm4TlvDq8ikWAM';
  const apiKey = process.env.REACT_APP_ELEVENLABS_API_KEY;

  if (!apiKey) {
    console.warn('ElevenLabs API key not found, falling back to browser TTS');
    tts(text, emotion);
    return;
  }

  // Get voice settings for the emotion
  const voiceSettings = emotionVoiceMap[emotion] || emotionVoiceMap.neutral;

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        text, 
        voice_settings: { 
          stability: voiceSettings.stability,
          similarity_boost: voiceSettings.similarity_boost,
          style: voiceSettings.style,
          use_speaker_boost: true
        } 
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const blob = await response.blob();
    const audio = new Audio(URL.createObjectURL(blob));

    // Apply volume adjustment
    audio.volume = voiceSettings.volume;

    // Play the audio
    audio.play();

    return audio; // Return audio object for potential further control
  } catch (error) {
    console.error('Error using ElevenLabs TTS:', error);
    // Fall back to browser TTS
    tts(text, emotion);
  }
};

/**
 * Speak text using browser's built-in TTS with emotional expression
 * @param {string} text - Text to speak
 * @param {string} emotion - Emotion to express (happy, sad, angry, etc.)
 */
export const tts = (text, emotion = 'neutral') => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-SA';

  // Apply emotional voice characteristics
  const voiceSettings = emotionVoiceMap[emotion] || emotionVoiceMap.neutral;
  utterance.pitch = voiceSettings.pitch;
  utterance.rate = voiceSettings.rate;
  utterance.volume = voiceSettings.volume;

  // Get available voices
  const voices = speechSynthesis.getVoices();

  // Try to find an Arabic voice
  const arabicVoice = voices.find(voice => voice.lang.includes('ar'));
  if (arabicVoice) {
    utterance.voice = arabicVoice;
  }

  // Speak the text
  speechSynthesis.speak(utterance);

  return utterance; // Return utterance object for potential further control
};
