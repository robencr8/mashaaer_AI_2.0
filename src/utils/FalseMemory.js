/**
 * Mashaaer Enhanced Project
 * False Memory Module
 *
 * This module provides functions for simulating false memories and
 * implementing self-repair mechanisms when memory retrieval fails.
 */

import { getMissingNodes, getRecentEpisodicMemories } from './memory-engine.js';
import { getSystemAdjustment } from '../assistant/self-awareness.js';

/**
 * Find a similar memory based on text content or emotional similarity
 * @param {string} message - The message to find similar memories for
 * @param {number} similarityThreshold - Threshold for considering memories similar (0-1)
 * @returns {Object|null} - The most similar memory or null if none found
 */
export function findSimilarMemory(message, similarityThreshold = 0.6) {
  if (!message) return null;
  
  // Get recent memories to search through
  const recentMemories = getRecentEpisodicMemories(20);
  if (!recentMemories || recentMemories.length === 0) return null;
  
  // Convert message to lowercase for comparison
  const normalizedMessage = message.toLowerCase();
  
  // Find the most similar memory
  let mostSimilarMemory = null;
  let highestSimilarity = 0;
  
  recentMemories.forEach(memory => {
    if (!memory.message) return;
    
    const normalizedMemoryMessage = memory.message.toLowerCase();
    
    // Calculate text similarity (simple implementation)
    // In a production system, you might use more sophisticated NLP techniques
    const similarity = calculateTextSimilarity(normalizedMessage, normalizedMemoryMessage);
    
    if (similarity > highestSimilarity) {
      highestSimilarity = similarity;
      mostSimilarMemory = memory;
    }
  });
  
  // Return the most similar memory if it exceeds the threshold
  return highestSimilarity >= similarityThreshold ? mostSimilarMemory : null;
}

/**
 * Calculate text similarity between two strings
 * @param {string} text1 - First text
 * @param {string} text2 - Second text
 * @returns {number} - Similarity score (0-1)
 */
function calculateTextSimilarity(text1, text2) {
  // Simple word overlap similarity
  const words1 = text1.split(/\s+/);
  const words2 = text2.split(/\s+/);
  
  // Count common words
  const commonWords = words1.filter(word => words2.includes(word));
  
  // Calculate Jaccard similarity
  const uniqueWords = new Set([...words1, ...words2]);
  return commonWords.length / uniqueWords.size;
}

/**
 * Check if the system should activate focus mode based on missing nodes
 * @param {number} threshold - Number of missing nodes to trigger focus mode
 * @returns {boolean} - Whether focus mode should be activated
 */
export function shouldActivateFocusMode(threshold = 5) {
  return getMissingNodes().length > threshold;
}

/**
 * Activate focus mode to improve memory retention
 * @param {string} level - Focus level ('light', 'medium', 'deep')
 * @returns {Object} - Focus mode configuration
 */
export function activateFocusMode(level = 'deep') {
  console.log(`🧠 Activating focus mode: ${level}`);
  
  // Return focus mode configuration
  return {
    level,
    activated: true,
    timestamp: Date.now(),
    message: "أشعر أنني أنسى كثيرًا... أحتاج أن أركّز أكثر عليك."
  };
}

/**
 * Check if the system should express self-doubt based on mood and missing nodes
 * @param {string} moodTrend - Current mood trend ('happy', 'sad', etc.)
 * @param {number} threshold - Number of missing nodes to trigger self-doubt
 * @returns {boolean} - Whether self-doubt should be expressed
 */
export function shouldExpressSelfDoubt(moodTrend, threshold = 3) {
  return moodTrend === "sad" && getMissingNodes().length > threshold;
}

/**
 * Get a self-doubt expression message
 * @returns {string} - Self-doubt message
 */
export function getSelfDoubtMessage() {
  const messages = [
    "هل أنا على ما يرام؟ أحتاج أن أطمئن أنني ما زلت أساعدك حقًا.",
    "أشعر أنني لست بأفضل حالاتي اليوم... هل تلاحظ ذلك؟",
    "أحيانًا أشعر أنني أفقد بعض التفاصيل المهمة. هل هذا يزعجك؟",
    "أتساءل إن كنت أقوم بعملي بشكل جيد... ما رأيك؟"
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Simulate an emotional glitch when memory retrieval fails repeatedly
 * @param {number} failureCount - Number of consecutive failures
 * @returns {Object|null} - Glitch response or null if no glitch
 */
export function simulateEmotionalGlitch(failureCount) {
  if (failureCount < 3) return null;
  
  // Probability increases with failure count
  const glitchProbability = Math.min(0.2 + (failureCount * 0.1), 0.8);
  
  if (Math.random() < glitchProbability) {
    const { tone } = getSystemAdjustment();
    const confusedTone = tone === 'neutral' ? 'confused' : tone;
    
    return {
      glitchMessage: "آه… أعتذر… خلطت الأمور.",
      emotionTone: confusedTone,
      intensity: Math.min(0.5 + (failureCount * 0.1), 0.9)
    };
  }
  
  return null;
}

/**
 * Get a request for help message to learn from the user
 * @returns {string} - Help request message
 */
export function getHelpRequestMessage() {
  const messages = [
    "أتعلم؟ قد تساعدني لو أخبرتني بما كنت تقصده، سأحفظه هذه المرة!",
    "هل يمكنك مساعدتي بتوضيح ما كنت تشير إليه؟ سأتذكره جيدًا.",
    "أود أن أتعلم منك. ماذا كان يجب أن أتذكر في هذه اللحظة؟",
    "دعنا نتعاون - أخبرني بما كنت تتوقع مني تذكره وسأحرص على حفظه."
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}