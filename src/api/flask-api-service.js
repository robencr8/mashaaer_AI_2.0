/**
 * Flask API Service
 * 
 * This module provides functions for communicating with the Flask backend.
 * Includes authentication and usage limit protection for sensitive endpoints.
 */

import { authService } from '../services/auth/auth-service.js';

// Base URL for the Flask API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

/**
 * Send a request to the Flask /ask endpoint
 * @param {string} prompt - The user's message
 * @param {Object} userProfile - User profile information
 * @returns {Promise<Object>} - The response from the Flask backend
 */
export async function sendPromptToFlask(prompt, userProfile) {
  try {
    // Check if authentication is required
    const authRequired = process.env.REACT_APP_AUTH_REQUIRED !== 'false';

    // Check if user is authenticated (skip if auth not required)
    if (authRequired && !authService.isLoggedIn()) {
      console.warn('Authentication required but REACT_APP_AUTH_REQUIRED is not set to false');
      throw new Error('Authentication required. Please log in to continue.');
    }

    // Check usage limits (skip if auth not required)
    if (authRequired && !authService.trackApiRequest()) {
      throw new Error('Usage limit reached. Please upgrade your plan or try again tomorrow.');
    }

    // Get authentication token if needed
    const token = authRequired ? authService.token : 'development-mode-token';

    // Prepare headers
    const headers = {
      'Content-Type': 'application/json'
    };

    // Only add Authorization header if auth is required
    if (authRequired) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/ask`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        prompt,
        userProfile: userProfile || { name: 'Development User' },
        subscriptionPlan: authRequired ? authService.getCurrentSubscriptionPlan() : 'premium',
        developmentMode: !authRequired
      }),
    });

    if (response.status === 401) {
      // Handle authentication error
      authService.logout(); // Force logout on auth failure
      throw new Error('Authentication failed. Please log in again.');
    }

    if (response.status === 403) {
      // Handle authorization error (e.g., insufficient plan)
      throw new Error('Access denied. Your subscription plan does not allow this operation.');
    }

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending prompt to Flask:', error);
    return {
      success: false,
      error: error.message,
      authRequired: error.message.includes('Authentication required'),
      limitReached: error.message.includes('Usage limit reached')
    };
  }
}

// Import voice cache functions
import { getCachedVoice, cacheVoice } from '../utils/voice-cache.js';

/**
 * Request text-to-speech from the Flask backend
 * @param {string} text - The text to convert to speech
 * @param {string} emotionType - The emotion type for the speech
 * @returns {Promise<Blob>} - Audio blob from the Flask backend or cache
 */
export async function requestTTS(text, emotionType = 'neutral') {
  try {
    // Check if we're in production mode
    const isProduction = process.env.NODE_ENV === 'production';

    // First, try to get the voice from cache (only in production mode)
    if (isProduction) {
      const cachedVoice = await getCachedVoice(text, emotionType);
      if (cachedVoice) {
        console.log('Using cached voice for:', text);
        return cachedVoice;
      }
    }

    // Check if we should skip authentication for voice
    const skipAuthForVoice = process.env.REACT_APP_SKIP_AUTH_FOR_VOICE === 'true';

    // Check if user is authenticated (skip in development mode or if explicitly configured)
    if (!skipAuthForVoice && !authService.isLoggedIn()) {
      console.warn('Authentication required for TTS but REACT_APP_SKIP_AUTH_FOR_VOICE is not enabled');
      throw new Error('Authentication required. Please log in to continue.');
    }

    // Check usage limits (skip in development mode or if explicitly configured)
    if (!skipAuthForVoice && !authService.trackApiRequest()) {
      throw new Error('Usage limit reached. Please upgrade your plan or try again tomorrow.');
    }

    // Get authentication token if needed
    const token = skipAuthForVoice ? 'development-mode-token' : authService.token;

    // Prepare headers
    const headers = {
      'Content-Type': 'application/json'
    };

    // Only add Authorization header if not skipping auth
    if (!skipAuthForVoice) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/tts`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        text,
        emotion: emotionType,
        subscriptionPlan: skipAuthForVoice ? 'premium' : authService.getCurrentSubscriptionPlan(),
        developmentMode: skipAuthForVoice
      }),
    });

    if (response.status === 401) {
      // Handle authentication error
      authService.logout(); // Force logout on auth failure
      throw new Error('Authentication failed. Please log in again.');
    }

    if (response.status === 403) {
      // Handle authorization error (e.g., insufficient plan)
      throw new Error('Access denied. Your subscription plan does not allow this operation.');
    }

    if (!response.ok) {
      throw new Error(`TTS request failed with status ${response.status}`);
    }

    // Get the audio blob
    const audioBlob = await response.blob();

    // Cache the voice in production mode
    if (isProduction) {
      cacheVoice(text, emotionType, audioBlob.slice())
        .catch(err => console.warn('Failed to cache voice:', err));
    }

    // Return the audio blob
    return audioBlob;
  } catch (error) {
    console.error('Error requesting TTS from Flask:', error);

    // Add authentication and limit information to the error
    if (error.message.includes('Authentication required') || 
        error.message.includes('Authentication failed') ||
        error.message.includes('Usage limit reached') ||
        error.message.includes('Access denied')) {
      error.authError = true;
      error.limitError = error.message.includes('Usage limit') || error.message.includes('Access denied');
    }

    throw error;
  }
}

/**
 * Play audio from a blob
 * @param {Blob} audioBlob - The audio blob to play
 * @returns {Promise<void>} - Resolves when audio playback is complete
 */
export function playAudioBlob(audioBlob) {
  return new Promise((resolve, reject) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      resolve();
    };

    audio.onerror = (error) => {
      URL.revokeObjectURL(audioUrl);
      reject(error);
    };

    audio.play().catch(reject);
  });
}
