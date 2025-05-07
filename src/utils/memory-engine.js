/**
 * Mashaaer Enhanced Project
 * Memory Engine Module
 *
 * This module provides functions for managing episodic and semantic memory.
 */

// In-memory storage for episodic memories
const episodicMemories = [];

// In-memory storage for semantic memories
const semanticMemories = {};

// In-memory storage for missing nodes
const missingNodes = [];

/**
 * Add a new episodic memory
 * @param {Object} memory - The memory to add
 */
export function addEpisodicMemory(memory) {
  if (!memory) return;

  // Add timestamp if not provided
  if (!memory.timestamp) {
    memory.timestamp = Date.now();
  }

  // Add to episodic memories
  episodicMemories.push(memory);

  // Keep only the most recent memories (limit to 100)
  if (episodicMemories.length > 100) {
    episodicMemories.shift();
  }

  console.log(`Added episodic memory: ${JSON.stringify(memory)}`);
}

/**
 * Get recent episodic memories
 * @param {number} count - Number of recent memories to retrieve
 * @returns {Array} - Array of recent memories
 */
export function getRecentEpisodicMemories(count = 10) {
  // Return the most recent memories
  return episodicMemories.slice(-count);
}

/**
 * Add a semantic memory
 * @param {string} key - The key for the memory
 * @param {*} value - The value to store
 */
export function addSemanticMemory(key, value) {
  if (!key) return;

  semanticMemories[key] = {
    value,
    timestamp: Date.now()
  };

  console.log(`Added semantic memory: ${key}`);
}

/**
 * Get a semantic memory
 * @param {string} key - The key for the memory
 * @returns {*} - The stored value
 */
export function getSemanticMemory(key) {
  if (!key || !semanticMemories[key]) return null;

  return semanticMemories[key].value;
}

/**
 * Get all semantic memories
 * @returns {Object} - All semantic memories
 */
export function getAllSemanticMemories() {
  return semanticMemories;
}

/**
 * Clear all memories
 */
export function clearMemories() {
  episodicMemories.length = 0;
  Object.keys(semanticMemories).forEach(key => {
    delete semanticMemories[key];
  });

  console.log('All memories cleared');
}

/**
 * Register a missing node
 * @param {string} id - The ID of the missing node
 */
export function registerMissingNode(id) {
  missingNodes.push({ id, timestamp: Date.now() });
  console.warn("🔍 لم يتم العثور على العقدة:", id);
}

/**
 * Get all missing nodes
 * @returns {Array} - Array of missing nodes
 */
export function getMissingNodes() {
  return missingNodes;
}
