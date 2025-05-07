/**
 * Voice Cache Module
 * 
 * This module provides functions for caching and retrieving TTS responses.
 * It works with the service worker to provide offline voice capabilities.
 */

const VOICE_CACHE_NAME = 'mashaaer-voice-cache-v1';

/**
 * Get a cached TTS response
 * @param {string} text - The text that was converted to speech
 * @param {string} emotion - The emotion used for the speech
 * @returns {Promise<Blob|null>} - The cached audio blob or null if not found
 */
export async function getCachedVoice(text, emotion = 'neutral') {
  // Skip if caches API is not available (not in a secure context or service worker not supported)
  if (!('caches' in window)) {
    return null;
  }

  try {
    const cache = await caches.open(VOICE_CACHE_NAME);
    const cacheKey = `tts-${text}-${emotion}`;
    const cachedResponse = await cache.match(cacheKey);
    
    if (cachedResponse) {
      console.log('Found cached voice for:', cacheKey);
      return await cachedResponse.blob();
    }
    
    return null;
  } catch (error) {
    console.warn('Error accessing voice cache:', error);
    return null;
  }
}

/**
 * Cache a TTS response
 * @param {string} text - The text that was converted to speech
 * @param {string} emotion - The emotion used for the speech
 * @param {Blob} audioBlob - The audio blob to cache
 * @returns {Promise<boolean>} - Whether the caching was successful
 */
export async function cacheVoice(text, emotion = 'neutral', audioBlob) {
  // Skip if caches API is not available
  if (!('caches' in window)) {
    return false;
  }

  try {
    const cache = await caches.open(VOICE_CACHE_NAME);
    const cacheKey = `tts-${text}-${emotion}`;
    
    // Create a response object from the blob
    const response = new Response(audioBlob, {
      headers: {
        'Content-Type': audioBlob.type
      }
    });
    
    // Store in cache
    await cache.put(cacheKey, response);
    console.log('Cached voice for:', cacheKey);
    return true;
  } catch (error) {
    console.warn('Error caching voice:', error);
    return false;
  }
}

/**
 * Clear the voice cache
 * @returns {Promise<boolean>} - Whether the clearing was successful
 */
export async function clearVoiceCache() {
  if (!('caches' in window)) {
    return false;
  }

  try {
    await caches.delete(VOICE_CACHE_NAME);
    console.log('Voice cache cleared');
    return true;
  } catch (error) {
    console.warn('Error clearing voice cache:', error);
    return false;
  }
}

/**
 * Get the size of the voice cache
 * @returns {Promise<number>} - The size of the cache in bytes
 */
export async function getVoiceCacheSize() {
  if (!('caches' in window) || !('estimate' in navigator.storage)) {
    return -1;
  }

  try {
    const estimate = await navigator.storage.estimate();
    const cacheStorage = estimate.usageDetails?.caches || 0;
    return cacheStorage;
  } catch (error) {
    console.warn('Error getting cache size:', error);
    return -1;
  }
}