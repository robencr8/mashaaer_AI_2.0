import { reflectInternalState, getSystemAdjustment } from './self-awareness.js';
import { detectEmotion } from '../emotion/enhanced-emotion-detection.js';
import { playVoiceResponse } from '../static/js/MashaaerVoice.js';
import { addEpisodicMemory, registerMissingNode } from '../utils/memory-engine.js';
import { 
  findSimilarMemory, 
  shouldActivateFocusMode, 
  activateFocusMode, 
  shouldExpressSelfDoubt,
  getSelfDoubtMessage,
  simulateEmotionalGlitch,
  getHelpRequestMessage
} from '../utils/FalseMemory.js';
import { handleMultiengineRequest } from '../api/llm_multiengine.js';
import { sendPromptToFlask } from '../api/flask-api-service.js';

class SmartPersonalAssistant {
  constructor(config = {}) {
    this.config = {
      assistantName: 'Mashaaer',
      language: 'ar',
      voiceEnabled: true,
      emotionAware: true,
      selfAware: true,
      ...config
    };

    // Initialize user profile from config
    this.userProfile = {
      language: this.config.language || 'ar-SA',
      preferredDialect: this.config.preferredDialect || 'khaliji',
      preferredTone: this.config.preferredTone || 'cheerful',
      preferredVoiceProfile: this.config.preferredVoiceProfile || 'GULF_FEMALE_ARIA'
    };

    // Initialize speech synthesis if available
    this.speechSynthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;

    // System state for tracking message count
    this.messageCount = 0;

    // Memory timeline for tracking nodes
    this.memoryTimeline = [];

    this.isInitialized = false;
  }

  initialize() {
    if (this.isInitialized) return;

    console.log("✅ Smart Assistant initialized");
    this.isInitialized = true;
  }

  setPersonalityMode(mode) {
    if (window.mashaaerComponents?.personalityEngine) {
      window.mashaaerComponents.personalityEngine.setMode(mode);
      console.log(`Personality mode set to: ${mode}`);
      return true;
    }
    return false;
  }

  getContextSummary() {
    if (window.mashaaerComponents?.contextEngine) {
      return window.mashaaerComponents.contextEngine.getSummary();
    }
    return { lastEmotion: 'neutral', dominantEmotion: 'neutral', totalEntries: 0 };
  }

  getEmotionalMoodSummary() {
    if (window.mashaaerComponents?.emotionalMemory) {
      return window.mashaaerComponents.emotionalMemory.summarizeMood();
    }
    return 'لا مزاج واضح بعد';
  }

  getEmotionalTrend() {
    if (window.mashaaerComponents?.emotionalMemory) {
      return window.mashaaerComponents.emotionalMemory.getEmotionalTrend();
    }
    return [];
  }

  getNodeByIdOrMessageId(id, message = '') {
    // Track consecutive failures for glitch simulation
    if (!this.failureCount) this.failureCount = 0;

    const node = this.memoryTimeline.find(n => n.id === id || n.messageId === id);

    if (!node) {
      // Register the missing node
      registerMissingNode(id);
      this.failureCount++;

      // Get system adjustment for tone and pitch
      const { tone, pitch } = getSystemAdjustment();
      let responseMessage = "أشعر وكأنني فقدت تلك اللحظة... هل تود أن تذكّرني؟";
      let emotionTone = tone;
      let emotionIntensity = 0.5;

      // 1. Self-Repair via Memory Feedback
      if (shouldActivateFocusMode()) {
        const focusMode = activateFocusMode('deep');
        responseMessage = focusMode.message;

        // Emit event to activate focus mode
        if (window.mashaaer && window.mashaaer.events) {
          window.mashaaer.events.emit("ACTIVATE_FOCUS_MODE", { level: "deep" });
        }
      }

      // 2. False Memory Simulation
      const similar = findSimilarMemory(message);
      if (similar) {
        responseMessage = `ربما قصدت يوم قلت: ${similar.message}`;
      }

      // 3. Emotional Drift Over Time
      const moodTrend = window.mashaaerComponents?.emotionalMemory?.getEmotionalTrend?.()?.[0]?.trend || 'neutral';
      if (shouldExpressSelfDoubt(moodTrend)) {
        responseMessage = getSelfDoubtMessage();
      }

      // 4. Meta-Conversation Trigger
      if (this.failureCount > 2 && Math.random() > 0.5) {
        responseMessage = getHelpRequestMessage();
      }

      // 5. Emotion Glitch Mode
      const glitch = simulateEmotionalGlitch(this.failureCount);
      if (glitch) {
        responseMessage = glitch.glitchMessage;
        emotionTone = glitch.emotionTone;
        emotionIntensity = glitch.intensity;
      }

      // Speak the response
      if (window.mashaaer && window.mashaaer.voice) {
        window.mashaaer.voice.setEmotionMode(emotionTone);
        window.mashaaer.voice.setPitch(pitch);
        window.mashaaer.voice.speak(responseMessage, emotionTone);
      }

      // إطلاق حدث مرئي لواجهة المستخدم
      if (window.mashaaer && window.mashaaer.events) {
        window.mashaaer.events.emit("NODE_NOT_FOUND", {
          id,
          message: responseMessage,
          emotion: emotionTone,
          intensity: emotionIntensity,
          failureCount: this.failureCount,
          hasSimilarMemory: !!similar
        });
      }

      return null;
    }

    // Reset failure count when a node is found
    this.failureCount = 0;
    return node;
  }


  speakReply(reply, tone = 'neutral', voiceProfile = null) {
    // التأكد إذا كانت الميزة مدعومة
    if (!this.speechSynthesis) {
      console.warn('Speech synthesis is not available.');
      return;
    }

    // Skip actual speech in non-browser environments
    if (typeof window === 'undefined') {
      console.log(`Would speak: "${reply}" with tone: ${tone}`);
      return;
    }

    // تهيئة النطق
    const utterance = new SpeechSynthesisUtterance(reply);

    // إعدادات النبرة
    const toneSettings = {
      cheerful: { pitch: 1.5, rate: 1.2 },
      warm: { pitch: 1.0, rate: 0.9 },
      calm: { pitch: 0.9, rate: 0.8 },
      curious: { pitch: 1.2, rate: 1.0 },
      neutral: { pitch: 1.0, rate: 1.0 },
      reassuring: { pitch: 0.8, rate: 0.85 },
      friendly: { pitch: 1.3, rate: 1.1 }
    };

    // Apply tone adjustment from self-awareness if available
    if (this.config.selfAware) {
      const adjustment = getSystemAdjustment();

      // Override tone if specified in adjustment
      if (adjustment.tone) {
        tone = adjustment.tone;
      }

      // Get base settings for the tone
      const baseSettings = toneSettings[tone] || toneSettings.neutral;

      // Apply pitch adjustment if specified
      utterance.pitch = adjustment.pitch || baseSettings.pitch;
      utterance.rate = baseSettings.rate;
    } else {
      // Use standard tone settings
      const settings = toneSettings[tone] || toneSettings.neutral;
      utterance.pitch = settings.pitch;
      utterance.rate = settings.rate;
    }

    utterance.lang = this.userProfile.language || 'ar-SA';

    // اختيار الصوت من قائمة الأصوات
    const voices = this.speechSynthesis.getVoices();
    if (voices.length === 0) {
      console.warn('No voices available yet. Ensure voices are loaded.');
      this.speechSynthesis.onvoiceschanged = () => {
        const updatedVoices = this.speechSynthesis.getVoices();
        const selectedVoice = updatedVoices.find(v => v.name.includes(voiceProfile)) || null;
        if (selectedVoice) utterance.voice = selectedVoice;
        this.speechSynthesis.speak(utterance);
      };
    } else if (voiceProfile) {
      utterance.voice = voices.find(v => v.name.includes(voiceProfile)) || null;
    }

    // محاولة تشغيل الصوت
    try {
      if (this.speechSynthesis.speaking) {
        console.warn('Speech synthesis is currently speaking. Canceling previous utterance...');
        this.speechSynthesis.cancel();
      }
      this.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error during speech synthesis:', error);
    }
  }

  async handleUserMessage(message, isVoice = false) {
    this.messageCount++;

    // تحليل العاطفة من الرسالة
    const emotion = detectEmotion(message);

    // حفظ في الذاكرة الحلقية
    addEpisodicMemory({ message, emotion });

    // Add to memory timeline for future reference
    const messageId = `msg_${Date.now()}`;
    this.memoryTimeline.push({
      id: messageId,
      messageId,
      message,
      emotion,
      timestamp: Date.now(),
      type: 'user'
    });

    // Check for any referenced nodes that might be missing
    // This simulates the system trying to recall related memories
    if (message.includes('تذكر') || message.includes('نسيت') || message.includes('قلت سابقًا')) {
      // Extract potential node IDs from message or use a recent one
      const potentialId = message.match(/node_\d+/) || `node_${Date.now() - 86400000}`; // 1 day ago
      this.getNodeByIdOrMessageId(potentialId, message);
    }

    // تأمل ذاتي كل 5 رسائل أو إذا زادت شدة العاطفة
    if (this.messageCount % 5 === 0 || (emotion && emotion.confidence > 0.75)) {
      const reflection = reflectInternalState();
      if (reflection && reflection.reflection) {
        console.log('[Self-Reflection]', reflection.reflection);

        // Check if we should express self-doubt based on missing nodes
        const moodTrend = reflection.moodTrend || 'neutral';
        if (shouldExpressSelfDoubt(moodTrend)) {
          const doubtMessage = getSelfDoubtMessage();
          await window.mashaaer.voice.speak(doubtMessage, 'شك');

          // Add self-doubt to response
          reflection.reflection = `${doubtMessage} ${reflection.reflection}`;
        } else {
          await window.mashaaer.voice.speak(reflection.reflection, reflection.moodTrend);
        }
      }
    }

    // Check if we should activate focus mode
    if (shouldActivateFocusMode()) {
      const focusMode = activateFocusMode('deep');

      // Emit event to activate focus mode
      if (window.mashaaer && window.mashaaer.events) {
        window.mashaaer.events.emit("ACTIVATE_FOCUS_MODE", { level: "deep" });
      }

      // Speak the focus mode message
      if (window.mashaaer && window.mashaaer.voice) {
        window.mashaaer.voice.speak(focusMode.message, "تركيز");
      }
    }

    // تعديل النغمة وفقًا لحالة النظام
    const { tone, pitch } = getSystemAdjustment();

    // Create user profile for LLM request
    const userProfile = {
      preferredTone: tone,
      preferredVoiceProfile: this.userProfile.preferredVoiceProfile,
      language: this.userProfile.language,
      emotionalState: emotion.type,
      emotionalIntensity: emotion.confidence
    };

    // Generate response using Flask backend
    console.log('🚀 Sending request to Flask backend');
    const flaskResponse = await sendPromptToFlask(message, userProfile);

    let responseText;
    let responseModel = 'flask-backend';

    if (flaskResponse.success) {
      responseText = flaskResponse.result || flaskResponse.response;
      responseModel = flaskResponse.metadata?.model || 'flask-backend';
      console.log(`✅ Response generated using Flask backend`);
    } else {
      // Fallback to LLM Multiengine if Flask fails
      console.warn('⚠️ Flask backend failed, using LLM Multiengine as fallback');
      const llmResponse = await handleMultiengineRequest(message, userProfile);

      if (llmResponse.success) {
        responseText = llmResponse.result;
        responseModel = llmResponse.metadata?.model || 'default';
        console.log(`✅ Fallback response generated using model: ${responseModel}`);
      } else {
        // Fallback to simple response if both Flask and LLM fail
        console.warn('⚠️ Both Flask and LLM Multiengine failed, using simple fallback response');
        responseText = `أنت قلت: ${message}`;
      }
    }

    // Set voice parameters
    if (window.mashaaer && window.mashaaer.voice) {
      window.mashaaer.voice.setEmotionMode(tone);
      window.mashaaer.voice.setPitch(pitch);
    }

    // تشغيل الرد صوتيًا ونصيًا
    playVoiceResponse({ text: responseText, emotion });

    // Add response to memory timeline
    this.memoryTimeline.push({
      id: `resp_${Date.now()}`,
      messageId: `resp_${messageId}`,
      message: responseText,
      emotion: tone,
      timestamp: Date.now(),
      type: 'assistant',
      model: responseModel
    });

    return {
      text: responseText,
      emotion,
      tone,
      pitch,
      model: responseModel
    };
  }

  // Keep the old method for backward compatibility
  async processUserMessage(message, isVoice = false) {
    return this.handleUserMessage(message, isVoice);
  }
}

export default SmartPersonalAssistant;
