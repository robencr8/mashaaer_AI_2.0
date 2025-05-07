/**
 * Enhanced Dialect NLP Module for Mashaaer
 * 
 * This module provides advanced natural language processing capabilities
 * with support for multiple Arabic and English dialects.
 * 
 * Features:
 * - Dialect detection for Arabic (Levantine, Gulf, Maghrebi, Egyptian, Sudanese)
 * - Dialect detection for English (AAVE, UK, Canadian, Irish, Scottish)
 * - Sentiment analysis for detecting emotional tone
 * - Intent recognition for determining user goals
 * - Context-aware processing for more relevant responses
 * - Custom vocabulary for different dialects
 */

class EnhancedDialectNLP {
  constructor() {
    this.arabicDialects = ['levantine', 'gulf', 'maghrebi', 'egyptian', 'sudanese'];
    this.englishDialects = ['aave', 'uk', 'canadian', 'irish', 'scottish'];
    this.conversationHistory = [];
    this.userPreferences = {};
    this.dialectPatterns = this.initDialectPatterns();
    this.intentPatterns = this.initIntentPatterns();
  }

  /**
   * Initialize dialect detection patterns
   */
  initDialectPatterns() {
    return {
      // Arabic dialect patterns
      levantine: {
        keywords: ['هيك', 'شو', 'هلأ', 'بدي', 'منيح'],
        expressions: ['شو هاد', 'كيفك', 'وينك', 'شو في']
      },
      gulf: {
        keywords: ['شلونك', 'يبغى', 'زين', 'وايد', 'عاد'],
        expressions: ['من وين', 'شخبارك', 'يالله', 'ما عليه']
      },
      maghrebi: {
        keywords: ['بزاف', 'واش', 'لابس', 'مزيان', 'فين'],
        expressions: ['واش كاين', 'لا باس', 'بصح', 'كيفاش']
      },
      egyptian: {
        keywords: ['ازيك', 'فين', 'ازاي', 'خالص', 'اوي'],
        expressions: ['ايه ده', 'مش كده', 'يا سلام', 'ماشي']
      },
      sudanese: {
        keywords: ['كيفن', 'وين', 'شديد', 'جاري', 'زاتو'],
        expressions: ['يا زول', 'شنو داير', 'كويس كده', 'ما عندي']
      },

      // English dialect patterns
      aave: {
        keywords: ['finna', 'tryna', 'ain\'t', 'y\'all', 'bae'],
        expressions: ['what\'s good', 'no cap', 'for real', 'straight up']
      },
      uk: {
        keywords: ['mate', 'bloody', 'proper', 'quid', 'cheeky'],
        expressions: ['cheers', 'fancy a', 'sorted', 'brilliant']
      },
      canadian: {
        keywords: ['eh', 'toque', 'loonie', 'washroom', 'sorry'],
        expressions: ['double double', 'out and about', 'give\'r', 'beauty']
      },
      irish: {
        keywords: ['grand', 'craic', 'eejit', 'gas', 'deadly'],
        expressions: ['what\'s the craic', 'fair play', 'sound out', 'fierce']
      },
      scottish: {
        keywords: ['wee', 'aye', 'nae', 'braw', 'dinnae'],
        expressions: ['pure dead', 'how\'s it gaun', 'wheesht', 'cannae']
      }
    };
  }

  /**
   * Initialize intent recognition patterns
   */
  initIntentPatterns() {
    return {
      greeting: {
        arabic: ['مرحبا', 'السلام عليكم', 'صباح الخير', 'مساء الخير', 'أهلا'],
        english: ['hello', 'hi', 'good morning', 'good evening', 'hey']
      },
      farewell: {
        arabic: ['مع السلامة', 'إلى اللقاء', 'تصبح على خير', 'وداعا'],
        english: ['goodbye', 'bye', 'see you', 'farewell', 'later']
      },
      question: {
        arabic: ['ما هو', 'كيف', 'متى', 'أين', 'لماذا', 'من', 'هل'],
        english: ['what', 'how', 'when', 'where', 'why', 'who', 'is', 'can', 'do']
      },
      command: {
        arabic: ['افعل', 'اذهب', 'أرني', 'ابحث', 'افتح', 'أغلق', 'شغل'],
        english: ['do', 'go', 'show', 'search', 'open', 'close', 'play']
      },
      help: {
        arabic: ['مساعدة', 'ساعدني', 'لا أفهم', 'كيف يمكنني'],
        english: ['help', 'assist', 'don\'t understand', 'how can i']
      }
    };
  }

  /**
   * Process input text to detect dialect, sentiment, and intent
   * @param {string} text - User input text
   * @param {object} context - Additional context information
   * @returns {object} Processing results
   */
  processText(text, context = {}) {
    // Store in conversation history
    this.addToHistory(text, context);

    // Detect language (Arabic or English)
    const language = this.detectLanguage(text);

    // Detect dialect
    const dialect = this.detectDialect(text, language);

    // Analyze sentiment
    const sentiment = this.analyzeSentiment(text, language);

    // Recognize intent
    const intent = this.recognizeIntent(text, language);

    // Extract entities
    const entities = this.extractEntities(text, language);

    // Context-aware processing
    const contextualUnderstanding = this.processContext(text, {
      language,
      dialect,
      sentiment,
      intent,
      entities,
      conversationHistory: this.conversationHistory,
      userPreferences: this.userPreferences,
      ...context
    });

    return {
      language,
      dialect,
      sentiment,
      intent,
      entities,
      contextualUnderstanding
    };
  }

  /**
   * Detect if text is in Arabic or English
   * @param {string} text - Input text
   * @returns {string} Detected language ('arabic' or 'english')
   */
  detectLanguage(text) {
    // Simple detection based on character ranges
    const arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(text) ? 'arabic' : 'english';
  }

  /**
   * Detect dialect based on language and text patterns
   * @param {string} text - Input text
   * @param {string} language - Detected language
   * @returns {string} Detected dialect
   */
  detectDialect(text, language) {
    const text_lower = text.toLowerCase();
    let dialectScores = {};

    // Initialize scores
    if (language === 'arabic') {
      this.arabicDialects.forEach(dialect => {
        dialectScores[dialect] = 0;
      });
    } else {
      this.englishDialects.forEach(dialect => {
        dialectScores[dialect] = 0;
      });
    }

    // Score each dialect based on keywords and expressions
    Object.keys(dialectScores).forEach(dialect => {
      // Check for keywords
      this.dialectPatterns[dialect].keywords.forEach(keyword => {
        if (text_lower.includes(keyword.toLowerCase())) {
          dialectScores[dialect] += 1;
        }
      });

      // Check for expressions
      this.dialectPatterns[dialect].expressions.forEach(expression => {
        if (text_lower.includes(expression.toLowerCase())) {
          dialectScores[dialect] += 2; // Expressions are stronger indicators
        }
      });
    });

    // Find dialect with highest score
    let maxScore = 0;
    let detectedDialect = language === 'arabic' ? 'standard_arabic' : 'standard_english';

    Object.keys(dialectScores).forEach(dialect => {
      if (dialectScores[dialect] > maxScore) {
        maxScore = dialectScores[dialect];
        detectedDialect = dialect;
      }
    });

    // If score is too low, default to standard
    if (maxScore < 2) {
      detectedDialect = language === 'arabic' ? 'standard_arabic' : 'standard_english';
    }

    return detectedDialect;
  }

  /**
   * Analyze sentiment in the text
   * @param {string} text - Input text
   * @param {string} language - Detected language
   * @returns {object} Sentiment analysis results
   */
  analyzeSentiment(text, language) {
    // Simplified sentiment analysis
    const text_lower = text.toLowerCase();

    // Define positive and negative words for each language
    const positiveWords = {
      arabic: ['جميل', 'رائع', 'ممتاز', 'سعيد', 'حب', 'فرح', 'شكرا'],
      english: ['good', 'great', 'excellent', 'happy', 'love', 'joy', 'thanks']
    };

    const negativeWords = {
      arabic: ['سيء', 'حزين', 'غاضب', 'مشكلة', 'صعب', 'فشل'],
      english: ['bad', 'sad', 'angry', 'problem', 'difficult', 'fail']
    };

    // Count positive and negative words
    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords[language].forEach(word => {
      if (text_lower.includes(word.toLowerCase())) {
        positiveCount++;
      }
    });

    negativeWords[language].forEach(word => {
      if (text_lower.includes(word.toLowerCase())) {
        negativeCount++;
      }
    });

    // Calculate sentiment score (-1 to 1)
    const totalWords = text.split(/\s+/).length;
    const sentimentScore = (positiveCount - negativeCount) / Math.max(1, totalWords);

    // Determine sentiment category
    let sentiment = 'neutral';
    if (sentimentScore > 0.1) {
      sentiment = 'positive';
    } else if (sentimentScore < -0.1) {
      sentiment = 'negative';
    }

    return {
      score: sentimentScore,
      category: sentiment,
      positiveCount,
      negativeCount
    };
  }

  /**
   * Recognize user intent from text
   * @param {string} text - Input text
   * @param {string} language - Detected language
   * @returns {object} Recognized intent
   */
  recognizeIntent(text, language) {
    const text_lower = text.toLowerCase();
    let intentScores = {};

    // Initialize scores for each intent
    Object.keys(this.intentPatterns).forEach(intent => {
      intentScores[intent] = 0;
    });

    // Score each intent based on keywords
    Object.keys(this.intentPatterns).forEach(intent => {
      this.intentPatterns[intent][language].forEach(keyword => {
        if (text_lower.includes(keyword.toLowerCase())) {
          intentScores[intent] += 1;
        }
      });
    });

    // Find intent with highest score
    let maxScore = 0;
    let primaryIntent = 'unknown';

    Object.keys(intentScores).forEach(intent => {
      if (intentScores[intent] > maxScore) {
        maxScore = intentScores[intent];
        primaryIntent = intent;
      }
    });

    // Get secondary intent (second highest score)
    let secondMaxScore = 0;
    let secondaryIntent = 'unknown';

    Object.keys(intentScores).forEach(intent => {
      if (intentScores[intent] > secondMaxScore && intent !== primaryIntent) {
        secondMaxScore = intentScores[intent];
        secondaryIntent = intent;
      }
    });

    return {
      primary: primaryIntent,
      secondary: secondaryIntent,
      confidence: maxScore > 0 ? Math.min(maxScore / 3, 1) : 0
    };
  }

  /**
   * Extract entities from text
   * @param {string} text - Input text
   * @param {string} language - Detected language
   * @returns {object} Extracted entities
   */
  extractEntities(text, language) {
    // Simplified entity extraction
    const entities = {
      dates: [],
      times: [],
      locations: [],
      persons: [],
      numbers: []
    };

    // Extract dates
    const datePatterns = {
      arabic: /\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}-\d{1,2}-\d{2,4}/g,
      english: /\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}-\d{1,2}-\d{2,4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2}(?:st|nd|rd|th)?, \d{4}/gi
    };

    const dateMatches = text.match(datePatterns[language]);
    if (dateMatches) {
      entities.dates = dateMatches;
    }

    // Extract times
    const timePatterns = {
      arabic: /\d{1,2}:\d{2}(?::\d{2})?(?: [صم])?/g,
      english: /\d{1,2}:\d{2}(?::\d{2})?(?: ?[AP]M)?/gi
    };

    const timeMatches = text.match(timePatterns[language]);
    if (timeMatches) {
      entities.times = timeMatches;
    }

    // Extract numbers
    const numberPattern = /\d+(?:\.\d+)?/g;
    const numberMatches = text.match(numberPattern);
    if (numberMatches) {
      entities.numbers = numberMatches.map(num => parseFloat(num));
    }

    return entities;
  }

  /**
   * Process context for more relevant understanding
   * @param {string} text - Input text
   * @param {object} contextData - Context data
   * @returns {object} Contextual understanding
   */
  processContext(text, contextData) {
    const { language, dialect, sentiment, intent, conversationHistory, userPreferences } = contextData;

    // Analyze conversation flow
    const conversationFlow = this.analyzeConversationFlow(conversationHistory);

    // Identify topics
    const topics = this.identifyTopics(text, conversationHistory);

    // Determine user preferences
    const preferences = this.determinePreferences(text, userPreferences);

    // Generate contextual response suggestions
    const responseSuggestions = this.generateResponseSuggestions(text, {
      language,
      dialect,
      sentiment,
      intent,
      conversationFlow,
      topics,
      preferences
    });

    return {
      conversationFlow,
      topics,
      preferences,
      responseSuggestions
    };
  }

  /**
   * Analyze conversation flow
   * @param {array} history - Conversation history
   * @returns {object} Conversation flow analysis
   */
  analyzeConversationFlow(history) {
    if (history.length < 2) {
      return { type: 'new_conversation' };
    }

    const lastUserMessage = history[history.length - 1];
    const previousUserMessage = history[history.length - 2];

    // Check if this is a follow-up question
    const isFollowUp = this.isFollowUpQuestion(lastUserMessage.text, previousUserMessage.text);

    // Check if this is a topic change
    const isTopicChange = this.isTopicChange(lastUserMessage.text, previousUserMessage.text);

    // Check if this is a clarification
    const isClarification = this.isClarification(lastUserMessage.text, previousUserMessage.text);

    return {
      type: isFollowUp ? 'follow_up' : (isTopicChange ? 'topic_change' : (isClarification ? 'clarification' : 'continuation')),
      isFollowUp,
      isTopicChange,
      isClarification
    };
  }

  /**
   * Check if current message is a follow-up question
   * @param {string} currentText - Current message text
   * @param {string} previousText - Previous message text
   * @returns {boolean} True if follow-up question
   */
  isFollowUpQuestion(currentText, previousText) {
    // Simplified implementation
    const followUpIndicators = {
      arabic: ['وماذا عن', 'وماذا', 'وكيف', 'ثم ماذا', 'وبعد ذلك'],
      english: ['and what about', 'what about', 'and how', 'then what', 'and then']
    };

    const language = this.detectLanguage(currentText);

    return followUpIndicators[language].some(indicator => 
      currentText.toLowerCase().includes(indicator.toLowerCase())
    );
  }

  /**
   * Check if current message is a topic change
   * @param {string} currentText - Current message text
   * @param {string} previousText - Previous message text
   * @returns {boolean} True if topic change
   */
  isTopicChange(currentText, previousText) {
    // Simplified implementation - check for common topic change indicators
    const topicChangeIndicators = {
      arabic: ['بالمناسبة', 'على فكرة', 'دعنا نتحدث عن', 'موضوع آخر'],
      english: ['by the way', 'speaking of', 'let\'s talk about', 'changing the subject']
    };

    const language = this.detectLanguage(currentText);

    return topicChangeIndicators[language].some(indicator => 
      currentText.toLowerCase().includes(indicator.toLowerCase())
    );
  }

  /**
   * Check if current message is a clarification
   * @param {string} currentText - Current message text
   * @param {string} previousText - Previous message text
   * @returns {boolean} True if clarification
   */
  isClarification(currentText, previousText) {
    // Simplified implementation - check for common clarification indicators
    const clarificationIndicators = {
      arabic: ['أقصد', 'بمعنى', 'أعني', 'للتوضيح', 'بعبارة أخرى'],
      english: ['i mean', 'to clarify', 'in other words', 'what i meant', 'to be clear']
    };

    const language = this.detectLanguage(currentText);

    return clarificationIndicators[language].some(indicator => 
      currentText.toLowerCase().includes(indicator.toLowerCase())
    );
  }

  /**
   * Identify topics in the conversation
   * @param {string} text - Current message text
   * @param {array} history - Conversation history
   * @returns {object} Identified topics
   */
  identifyTopics(text, history) {
    // Simplified topic identification
    const commonTopics = {
      weather: {
        arabic: ['طقس', 'حرارة', 'مطر', 'ثلج', 'رياح'],
        english: ['weather', 'temperature', 'rain', 'snow', 'wind']
      },
      travel: {
        arabic: ['سفر', 'رحلة', 'فندق', 'طيران', 'سياحة'],
        english: ['travel', 'trip', 'hotel', 'flight', 'tourism']
      },
      food: {
        arabic: ['طعام', 'أكل', 'مطعم', 'وصفة', 'طبخ'],
        english: ['food', 'eat', 'restaurant', 'recipe', 'cook']
      },
      health: {
        arabic: ['صحة', 'مرض', 'دواء', 'طبيب', 'علاج'],
        english: ['health', 'illness', 'medicine', 'doctor', 'treatment']
      },
      technology: {
        arabic: ['تكنولوجيا', 'هاتف', 'حاسوب', 'إنترنت', 'تطبيق'],
        english: ['technology', 'phone', 'computer', 'internet', 'app']
      }
    };

    const language = this.detectLanguage(text);
    const text_lower = text.toLowerCase();

    let topicScores = {};
    Object.keys(commonTopics).forEach(topic => {
      topicScores[topic] = 0;

      commonTopics[topic][language].forEach(keyword => {
        if (text_lower.includes(keyword.toLowerCase())) {
          topicScores[topic] += 1;
        }
      });
    });

    // Find primary topic (highest score)
    let maxScore = 0;
    let primaryTopic = 'general';

    Object.keys(topicScores).forEach(topic => {
      if (topicScores[topic] > maxScore) {
        maxScore = topicScores[topic];
        primaryTopic = topic;
      }
    });

    // Check history for topic continuity
    const recentTopics = new Set();
    if (history.length > 0) {
      // Look at last 3 messages
      const recentHistory = history.slice(-3);
      recentHistory.forEach(message => {
        // For simplicity, just check if the message contains topic keywords
        Object.keys(commonTopics).forEach(topic => {
          commonTopics[topic][language].forEach(keyword => {
            if (message.text.toLowerCase().includes(keyword.toLowerCase())) {
              recentTopics.add(topic);
            }
          });
        });
      });
    }

    return {
      primary: primaryTopic,
      recent: Array.from(recentTopics),
      confidence: maxScore > 0 ? Math.min(maxScore / 3, 1) : 0
    };
  }

  /**
   * Determine user preferences from conversation
   * @param {string} text - Current message text
   * @param {object} existingPreferences - Existing user preferences
   * @returns {object} Updated user preferences
   */
  determinePreferences(text, existingPreferences) {
    // Clone existing preferences
    const preferences = { ...existingPreferences };

    // Simplified preference extraction
    const preferencePatterns = {
      arabic: {
        like: /أحب|أفضل|يعجبني/i,
        dislike: /لا أحب|أكره|لا يعجبني/i,
        prefer: /أفضل|أرغب|أود/i
      },
      english: {
        like: /like|love|enjoy/i,
        dislike: /don't like|hate|dislike/i,
        prefer: /prefer|rather|would like/i
      }
    };

    const language = this.detectLanguage(text);

    // Check for likes
    if (preferencePatterns[language].like.test(text)) {
      // Extract what they like (simplified)
      const words = text.split(/\s+/);
      const likeIndex = words.findIndex(word => 
        preferencePatterns[language].like.test(word)
      );

      if (likeIndex >= 0 && likeIndex < words.length - 1) {
        const likedThing = words[likeIndex + 1];
        if (!preferences.likes) {
          preferences.likes = [];
        }
        if (!preferences.likes.includes(likedThing)) {
          preferences.likes.push(likedThing);
        }
      }
    }

    // Check for dislikes
    if (preferencePatterns[language].dislike.test(text)) {
      // Extract what they dislike (simplified)
      const words = text.split(/\s+/);
      const dislikeIndex = words.findIndex(word => 
        preferencePatterns[language].dislike.test(word)
      );

      if (dislikeIndex >= 0 && dislikeIndex < words.length - 1) {
        const dislikedThing = words[dislikeIndex + 1];
        if (!preferences.dislikes) {
          preferences.dislikes = [];
        }
        if (!preferences.dislikes.includes(dislikedThing)) {
          preferences.dislikes.push(dislikedThing);
        }
      }
    }

    return preferences;
  }

  /**
   * Generate response suggestions based on context
   * @param {string} text - Input text
   * @param {object} contextData - Context data
   * @returns {array} Response suggestions
   */
  generateResponseSuggestions(text, contextData) {
    const { language, dialect, sentiment, intent } = contextData;

    // Basic response templates
    const responseTemplates = {
      greeting: {
        arabic: {
          standard_arabic: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
          levantine: 'مرحبا! كيف فيني ساعدك اليوم؟',
          gulf: 'هلا! شلون أقدر أساعدك اليوم؟',
          maghrebi: 'صباح الخير! كيفاش نقدر نعاونك اليوم؟',
          egyptian: 'أهلاً! إزاي أقدر أساعدك النهاردة؟',
          sudanese: 'سلام! كيف ممكن أساعدك اليوم؟'
        },
        english: {
          standard_english: 'Hello! How can I help you today?',
          aave: 'Hey there! How can I help you out today?',
          uk: 'Hello there! How may I assist you today?',
          canadian: 'Hi there! How can I help you out today, eh?',
          irish: 'Hello! How can I help you today, like?',
          scottish: 'Hiya! How can I help ye the day?'
        }
      },
      question: {
        arabic: {
          standard_arabic: 'سأبحث عن إجابة لك.',
          levantine: 'رح دور على جواب إلك.',
          gulf: 'بدور لك على الجواب.',
          maghrebi: 'غادي نقلب على جواب ليك.',
          egyptian: 'هدور على إجابة ليك.',
          sudanese: 'حا أبحث ليك على إجابة.'
        },
        english: {
          standard_english: 'I\'ll look for an answer for you.',
          aave: 'I\'ma find you an answer.',
          uk: 'I\'ll have a look for an answer for you.',
          canadian: 'I\'ll find an answer for you right away.',
          irish: 'I\'ll find you an answer there now.',
          scottish: 'I\'ll find ye an answer right noo.'
        }
      }
    };

    // Select appropriate templates based on intent and dialect
    let suggestions = [];

    if (intent.primary in responseTemplates) {
      if (dialect in responseTemplates[intent.primary][language]) {
        suggestions.push(responseTemplates[intent.primary][language][dialect]);
      } else {
        // Fallback to standard dialect
        const standardDialect = language === 'arabic' ? 'standard_arabic' : 'standard_english';
        suggestions.push(responseTemplates[intent.primary][language][standardDialect]);
      }
    }

    // Add sentiment-aware responses
    if (sentiment.category === 'positive') {
      const positiveResponses = {
        arabic: {
          standard_arabic: 'يسعدني أن أسمع ذلك!',
          levantine: 'بفرحني إسمع هيك!',
          gulf: 'يسرني أسمع جذي!',
          maghrebi: 'فرحان باش نسمع هاد شي!',
          egyptian: 'مبسوط إني أسمع كده!',
          sudanese: 'سعيد أسمع كده!'
        },
        english: {
          standard_english: 'I\'m glad to hear that!',
          aave: 'That\'s what\'s up!',
          uk: 'Brilliant to hear that!',
          canadian: 'That\'s great to hear!',
          irish: 'Deadly to hear that!',
          scottish: 'That\'s pure brilliant!'
        }
      };

      if (dialect in positiveResponses[language]) {
        suggestions.push(positiveResponses[language][dialect]);
      }
    } else if (sentiment.category === 'negative') {
      const negativeResponses = {
        arabic: {
          standard_arabic: 'آسف لسماع ذلك.',
          levantine: 'آسف إسمع هيك.',
          gulf: 'متأسف أسمع جذي.',
          maghrebi: 'متأسف باش نسمع هاد شي.',
          egyptian: 'متأسف إني أسمع كده.',
          sudanese: 'آسف أسمع كده.'
        },
        english: {
          standard_english: 'I\'m sorry to hear that.',
          aave: 'That\'s tough, I feel you.',
          uk: 'I\'m terribly sorry to hear that.',
          canadian: 'I\'m really sorry to hear that.',
          irish: 'I\'m awful sorry to hear that.',
          scottish: 'I\'m dead sorry tae hear that.'
        }
      };

      if (dialect in negativeResponses[language]) {
        suggestions.push(negativeResponses[language][dialect]);
      }
    }

    return suggestions;
  }

  /**
   * Add message to conversation history
   * @param {string} text - Message text
   * @param {object} context - Message context
   */
  addToHistory(text, context) {
    this.conversationHistory.push({
      text,
      timestamp: new Date(),
      context
    });

    // Limit history size
    if (this.conversationHistory.length > 20) {
      this.conversationHistory.shift();
    }
  }

  /**
   * Update user preferences
   * @param {object} newPreferences - New preferences to add
   */
  updateUserPreferences(newPreferences) {
    this.userPreferences = {
      ...this.userPreferences,
      ...newPreferences
    };
  }

  /**
   * Get custom vocabulary for specific dialect
   * @param {string} dialect - Target dialect
   * @returns {object} Custom vocabulary
   */
  getDialectVocabulary(dialect) {
    // Custom vocabulary for different dialects
    const dialectVocabulary = {
      levantine: {
        greeting: 'مرحبا',
        goodbye: 'مع السلامة',
        yes: 'إي',
        no: 'لأ',
        please: 'لو سمحت',
        thank_you: 'شكراً',
        how_are_you: 'كيفك',
        good: 'منيح',
        bad: 'مش منيح'
      },
      gulf: {
        greeting: 'هلا',
        goodbye: 'مع السلامة',
        yes: 'إي',
        no: 'لا',
        please: 'لو سمحت',
        thank_you: 'مشكور',
        how_are_you: 'شلونك',
        good: 'زين',
        bad: 'مو زين'
      },
      // Add more dialects as needed
    };

    return dialectVocabulary[dialect] || {};
  }
}

export default EnhancedDialectNLP;
