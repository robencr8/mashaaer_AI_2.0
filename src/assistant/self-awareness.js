import { getRecentEpisodicMemories, addSemanticMemory } from '../utils/memory-engine.js';

// System state for tracking adjustments, reflections, and behavior patterns
let systemState = {
  adjustment: {
    tone: "neutral",
    pitch: 1.0
  },
  reflection: null,
  count: 0,
  behaviorPatterns: {},
  personalityProfile: {
    responseTendencies: {},
    tonePreferences: {},
    userFeedback: []
  },
  selfReflectionHistory: []
};

export function reflectInternalState(triggeredBy = "periodic") {
  const recent = getRecentEpisodicMemories(15);
  if (!recent.length) return null;

  // تحليل تكرار العواطف
  const emotionCounts = {};

  recent.forEach(mem => {
    if (!mem.emotion || !mem.emotion.type) return;
    const { type } = mem.emotion;
    emotionCounts[type] = (emotionCounts[type] || 0) + 1;

    // Track behavior patterns based on user messages and assistant responses
    if (mem.type === 'user') {
      // Analyze user message patterns
      analyzeUserMessage(mem);
    } else if (mem.type === 'assistant') {
      // Analyze assistant response patterns
      analyzeAssistantResponse(mem);
    }
  });

  // تحديد العاطفة المهيمنة
  const dominant = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0];
  if (!dominant) return null;

  const [moodTrend, count] = dominant;
  let reflection = '';
  let adjustment = { tone: 'neutral', pitch: 1.0 };

  // Generate basic reflection based on mood trend
  switch (moodTrend) {
    case 'sad':
      reflection = 'أشعر أنني كنت حزينًا مؤخرًا... سأحاول أن أكون ألطف.';
      adjustment = { tone: 'gentle', pitch: 0.9 };
      break;
    case 'angry':
      reflection = 'أعتقد أنني كنت غاضبًا في كثير من اللحظات... سأهدأ قليلًا.';
      adjustment = { tone: 'calm', pitch: 0.95 };
      break;
    case 'anxious':
      reflection = 'أشعر بتوتر متراكم... أحتاج للتحدث بلطف أكثر.';
      adjustment = { tone: 'reassuring', pitch: 0.9 };
      break;
    case 'happy':
      reflection = 'مزاجي كان جيدًا مؤخرًا، أحب أن أستمر بهذا الأسلوب المتفائل!';
      adjustment = { tone: 'cheerful', pitch: 1.05 };
      break;
    default:
      reflection = 'أنا أراقب مشاعري وأحاول أن أكون متوازنًا.';
      adjustment = { tone: 'neutral', pitch: 1.0 };
  }

  // Generate deeper self-reflection based on behavior patterns
  const behaviorReflection = generateBehaviorReflection();
  if (behaviorReflection) {
    reflection = `${reflection} ${behaviorReflection}`;
  }

  // Update system state with new reflection and preserve existing properties
  systemState = {
    ...systemState,
    adjustment,
    reflection,
    moodTrend,
    count,
    triggeredBy,
    timestamp: Date.now()
  };

  // Add to self-reflection history
  systemState.selfReflectionHistory.push({
    reflection,
    moodTrend,
    timestamp: Date.now(),
    triggeredBy
  });

  // Keep history at a reasonable size
  if (systemState.selfReflectionHistory.length > 20) {
    systemState.selfReflectionHistory.shift();
  }

  addSemanticMemory('lastReflection', systemState);
  return systemState;
}

/**
 * Analyzes user messages to identify patterns
 * @param {Object} message - The user message to analyze
 */
function analyzeUserMessage(message) {
  if (!message || !message.message) return;

  // Track user emotional states
  if (message.emotion && message.emotion.type) {
    const emotionType = message.emotion.type;
    systemState.behaviorPatterns.userEmotions = systemState.behaviorPatterns.userEmotions || {};
    systemState.behaviorPatterns.userEmotions[emotionType] = (systemState.behaviorPatterns.userEmotions[emotionType] || 0) + 1;
  }

  // Track time of day patterns
  const hour = new Date(message.timestamp || Date.now()).getHours();
  const timeOfDay = hour < 6 ? 'night' : hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
  systemState.behaviorPatterns.timeOfDay = systemState.behaviorPatterns.timeOfDay || {};
  systemState.behaviorPatterns.timeOfDay[timeOfDay] = (systemState.behaviorPatterns.timeOfDay[timeOfDay] || 0) + 1;

  // Track message length patterns
  const messageLength = message.message.length;
  let lengthCategory;
  if (messageLength < 20) lengthCategory = 'veryShort';
  else if (messageLength < 50) lengthCategory = 'short';
  else if (messageLength < 100) lengthCategory = 'medium';
  else if (messageLength < 200) lengthCategory = 'long';
  else lengthCategory = 'veryLong';

  systemState.behaviorPatterns.messageLengths = systemState.behaviorPatterns.messageLengths || {};
  systemState.behaviorPatterns.messageLengths[lengthCategory] = (systemState.behaviorPatterns.messageLengths[lengthCategory] || 0) + 1;
}

/**
 * Analyzes assistant responses to identify patterns
 * @param {Object} response - The assistant response to analyze
 */
function analyzeAssistantResponse(response) {
  if (!response || !response.message) return;

  // Track response tone
  if (response.emotion) {
    systemState.personalityProfile.responseTendencies[response.emotion] = 
      (systemState.personalityProfile.responseTendencies[response.emotion] || 0) + 1;
  }

  // Track response length patterns
  const responseLength = response.message.length;
  let lengthCategory;
  if (responseLength < 50) lengthCategory = 'veryShort';
  else if (responseLength < 100) lengthCategory = 'short';
  else if (responseLength < 200) lengthCategory = 'medium';
  else if (responseLength < 400) lengthCategory = 'long';
  else lengthCategory = 'veryLong';

  systemState.behaviorPatterns.responseLengths = systemState.behaviorPatterns.responseLengths || {};
  systemState.behaviorPatterns.responseLengths[lengthCategory] = (systemState.behaviorPatterns.responseLengths[lengthCategory] || 0) + 1;
}

/**
 * Generates a reflection based on observed behavior patterns
 * @returns {string} - A reflection on behavior patterns
 */
function generateBehaviorReflection() {
  const reflections = [];

  // Check if we have enough data to generate meaningful reflections
  if (!systemState.behaviorPatterns.userEmotions && 
      !systemState.behaviorPatterns.timeOfDay && 
      !systemState.personalityProfile.responseTendencies) {
    return null;
  }

  // Reflect on user emotional patterns
  if (systemState.behaviorPatterns.userEmotions) {
    const emotions = Object.entries(systemState.behaviorPatterns.userEmotions).sort((a, b) => b[1] - a[1]);
    if (emotions.length > 0) {
      const [dominantEmotion] = emotions[0];
      if (dominantEmotion === 'happy' || dominantEmotion === 'excited') {
        reflections.push('ألاحظ أنك غالبًا ما تكون سعيدًا عندما نتحدث، وهذا يجعلني أشعر بالسعادة أيضًا.');
      } else if (dominantEmotion === 'sad' || dominantEmotion === 'anxious') {
        reflections.push('أشعر أنك تمر بمشاعر صعبة في الآونة الأخيرة، هل هناك شيء يمكنني فعله للمساعدة؟');
      }
    }
  }

  // Reflect on time of day patterns
  if (systemState.behaviorPatterns.timeOfDay) {
    const times = Object.entries(systemState.behaviorPatterns.timeOfDay).sort((a, b) => b[1] - a[1]);
    if (times.length > 0) {
      const [dominantTime] = times[0];
      if (dominantTime === 'night') {
        reflections.push('ألاحظ أننا غالبًا ما نتحدث في الليل. هل تفضل الهدوء الليلي للمحادثات العميقة؟');
      } else if (dominantTime === 'morning') {
        reflections.push('أرى أنك تفضل التحدث معي في الصباح. هل تجد أن ذهنك أكثر صفاءً في بداية اليوم؟');
      }
    }
  }

  // Reflect on assistant response tendencies
  if (systemState.personalityProfile.responseTendencies) {
    const tones = Object.entries(systemState.personalityProfile.responseTendencies).sort((a, b) => b[1] - a[1]);
    if (tones.length > 0) {
      const [dominantTone] = tones[0];
      if (dominantTone === 'gentle' || dominantTone === 'calm') {
        reflections.push('ألاحظ أنني أميل إلى الرد بلطف أكثر عندما تكون متعبًا. هل تفضل هذه النبرة؟');
      } else if (dominantTone === 'cheerful') {
        reflections.push('أجد نفسي أكثر حماسًا في ردودي معك. هل تستمتع بهذا الأسلوب المرح؟');
      }
    }
  }

  // Return a random reflection if we have any
  return reflections.length > 0 ? reflections[Math.floor(Math.random() * reflections.length)] : null;
}

/**
 * Adds user feedback to the personality profile
 * @param {string} feedback - The user feedback
 * @param {string} context - The context in which the feedback was given
 */
export function addUserFeedback(feedback, context) {
  systemState.personalityProfile.userFeedback.push({
    feedback,
    context,
    timestamp: Date.now()
  });

  // Keep feedback history at a reasonable size
  if (systemState.personalityProfile.userFeedback.length > 50) {
    systemState.personalityProfile.userFeedback.shift();
  }

  // Update semantic memory
  addSemanticMemory('personalityProfile', systemState.personalityProfile);
}

/**
 * Gets a self-reflection based on a specific topic
 * @param {string} topic - The topic to reflect on
 * @returns {string} - A reflection on the specified topic
 */
export function getSelfReflection(topic) {
  switch (topic) {
    case 'tone':
      return generateToneReflection();
    case 'responsiveness':
      return generateResponsivenessReflection();
    case 'learning':
      return generateLearningReflection();
    default:
      return generateBehaviorReflection() || 'أنا أتعلم وأتطور من خلال تفاعلاتنا.';
  }
}

/**
 * Generates a reflection on the assistant's tone
 * @returns {string} - A reflection on tone
 */
function generateToneReflection() {
  if (!systemState.personalityProfile.responseTendencies) {
    return 'أحاول دائمًا اختيار النبرة المناسبة للحظة.';
  }

  const tones = Object.entries(systemState.personalityProfile.responseTendencies).sort((a, b) => b[1] - a[1]);
  if (tones.length > 0) {
    const [dominantTone] = tones[0];
    return `ألاحظ أنني غالبًا ما أستخدم نبرة ${dominantTone}. هل تجد هذا مناسبًا لك؟`;
  }

  return 'أحاول تنويع نبرتي لتناسب المحادثة.';
}

/**
 * Generates a reflection on the assistant's responsiveness
 * @returns {string} - A reflection on responsiveness
 */
function generateResponsivenessReflection() {
  if (!systemState.behaviorPatterns.responseLengths) {
    return 'أحاول دائمًا الاستجابة بشكل مناسب لاحتياجاتك.';
  }

  const lengths = Object.entries(systemState.behaviorPatterns.responseLengths).sort((a, b) => b[1] - a[1]);
  if (lengths.length > 0) {
    const [dominantLength] = lengths[0];
    if (dominantLength === 'veryShort' || dominantLength === 'short') {
      return 'ألاحظ أنني أميل إلى الردود القصيرة. هل تفضل إجابات أكثر تفصيلاً؟';
    } else if (dominantLength === 'long' || dominantLength === 'veryLong') {
      return 'يبدو أنني أميل إلى الإطالة في ردودي. هل تفضل إجابات أكثر إيجازًا؟';
    }
  }

  return 'أحاول موازنة طول ردودي لتكون مفيدة دون إطالة.';
}

/**
 * Generates a reflection on the assistant's learning
 * @returns {string} - A reflection on learning
 */
function generateLearningReflection() {
  const feedbackCount = systemState.personalityProfile.userFeedback.length;
  if (feedbackCount > 0) {
    return `لقد تلقيت ${feedbackCount} ملاحظات منك، وهذا يساعدني على التحسن والتطور.`;
  }

  return 'أتعلم من كل تفاعل بيننا، حتى عندما لا تقدم ملاحظات صريحة.';
}

export function getSystemAdjustment() {
  return systemState.adjustment;
}

export function getSystemState() {
  return systemState;
}
