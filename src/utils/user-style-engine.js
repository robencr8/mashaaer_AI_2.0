// User Style Engine
// This module analyzes user communication style and builds a persona based on the analysis

/**
 * Analyzes user communication style from chat history
 * @param {Array} history - Chat history array with sender and message properties
 * @returns {Object} Style analysis results
 */
export function analyzeUserStyle(history) {
  const patterns = {
    usesEmojis: false,
    asksQuestions: 0,
    exclaims: 0,
    usesDialects: new Set(),
    wordFrequency: {}
  };

  for (let entry of history) {
    if (entry.sender !== 'user') continue;
    const msg = entry.message;

    if (msg.includes('؟') || msg.includes('?')) patterns.asksQuestions++;
    if (msg.includes('!')) patterns.exclaims++;
    if (/😊|😂|❤️|🔥/.test(msg)) patterns.usesEmojis = true;

    if (/شو|كتير|هيك/.test(msg)) patterns.usesDialects.add('levantine');
    if (/زين|وش|مافيه/.test(msg)) patterns.usesDialects.add('gulf');
    if (/واش|بزاف|مزيان/.test(msg)) patterns.usesDialects.add('maghrebi');

    msg.split(/\s+/).forEach(word => {
      const w = word.toLowerCase();
      patterns.wordFrequency[w] = (patterns.wordFrequency[w] || 0) + 1;
    });
  }

  return patterns;
}

/**
 * Builds a user persona based on style analysis
 * @param {Object} styleAnalysis - Results from analyzeUserStyle
 * @returns {Object} User persona configuration
 */
export function buildUserPersona(styleAnalysis) {
  return {
    tone: styleAnalysis.usesEmojis ? 'friendly' : 'formal',
    dialect: [...styleAnalysis.usesDialects][0] || 'standard',
    prefersQuestions: styleAnalysis.asksQuestions > 5,
    favoriteWords: Object.entries(styleAnalysis.wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word)
  };
}

/**
 * Saves user persona to localStorage
 * @param {Object} persona - User persona to save
 */
export function savePersonaToStorage(persona) {
  localStorage.setItem('user_persona', JSON.stringify(persona));
}

/**
 * Loads user persona from localStorage
 * @returns {Object|null} User persona or null if not found
 */
export function loadPersonaFromStorage() {
  const data = localStorage.getItem('user_persona');
  return data ? JSON.parse(data) : null;
}