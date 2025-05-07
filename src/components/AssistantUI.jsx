import { useState, useEffect, useRef } from 'react';
import SmartPersonalAssistant from '../assistant/smart-personal-assistant.js';
import EnhancedEmotionDetection from '../emotion/enhanced-emotion-detection.js';
import EnhancedDialectNLP from '../voice/enhanced-dialect-nlp.js';
import { saveMessage, getChatHistory } from '../utils/session-storage.js';
import { playVoiceResponse } from '../static/js/MashaaerVoice.js';
import HelpTooltip from './HelpTooltip.jsx';
import LanguageSuggestion from './LanguageSuggestion.jsx';
import AIInsightCard from './AIInsightCard.jsx';
import { useLanguage } from '../context/LanguageContext.js';
import { uiTranslations } from '../translations';
import './AssistantUI.css';

const assistant = new SmartPersonalAssistant();
const emotion = new EnhancedEmotionDetection();
const nlpProcessor = new EnhancedDialectNLP();

// Emotion icons mapping
const emotionIcons = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  surprised: '😲',
  fearful: '😨',
  disgusted: '🤢',
  neutral: '😐',
  cheerful: '😄',
  warm: '🤗',
  calm: '😌',
  curious: '🧐',
  reassuring: '👍',
  friendly: '😀'
};

export default function AssistantUI() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [userProfile, setUserProfile] = useState({
    preferredDialect: 'khaliji',
    preferredTone: 'cheerful',
    preferredVoiceProfile: 'GULF_FEMALE_ARIA',
  });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { language, toggleLanguage, languageSource, resetToDetectedLanguage, setAppLanguage, supportedLanguages, getLanguageMetadata, isRTL } = useLanguage();
  const [showLanguageNotification, setShowLanguageNotification] = useState(true);
  const [showLanguageSuggestion, setShowLanguageSuggestion] = useState(false);
  const [lastDetectedEmotion, setLastDetectedEmotion] = useState(null);
  const [lastUserMessage, setLastUserMessage] = useState('');
  const [intentData, setIntentData] = useState(null);
  const [showInsightCard, setShowInsightCard] = useState(true);

  // Initialize assistant and emotion detection
  useEffect(() => {
    assistant.initialize();
    emotion.initialize();

    // Hide language notification after 10 seconds if it's browser-detected
    if (languageSource === 'browser') {
      const timer = setTimeout(() => {
        setShowLanguageNotification(false);
      }, 10000);
      return () => clearTimeout(timer);
    }

    // Load existing messages from session storage
    const storedMessages = getChatHistory();
    if (storedMessages && storedMessages.length > 0) {
      // Convert chat history format to messages format
      const formattedMessages = storedMessages.map((item, index) => ({
        id: index,
        type: item.sender,
        text: item.message,
        emotion: 'neutral',
        timestamp: new Date(item.time).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      }));
      setMessages(formattedMessages);
    } else {
      // Add welcome message if no messages exist
      const welcomeMessage = {
        id: Date.now(),
        type: 'assistant',
        text: uiTranslations[language]?.welcomeMessage || 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
        emotion: 'cheerful'
      };
      setMessages([welcomeMessage]);
      saveMessage('assistant', welcomeMessage.text);
    }

    // Focus input field on load
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Toggle TTS mode between Flask and Web Speech API
  const toggleTTSMode = () => {
    if (window.mashaaer && window.mashaaer.voice) {
      const isFlaskTTS = window.mashaaer.voice.toggleTTSMode();
      console.log(`TTS mode toggled to: ${isFlaskTTS ? 'Flask TTS' : 'Web Speech API'}`);
    }
  };

  // Play TTS for a specific message
  const playTTS = (text, emotion) => {
    if (!text) return;

    // Map language to voice profiles
    const languageVoiceMap = {
      'ar': 'GULF_FEMALE_ARIA', // Arabic voice
      'en': 'DEFAULT_FEMALE',   // English voice
      'fr': 'DEFAULT_FEMALE',   // French voice (fallback)
      'ur': 'GULF_FEMALE_ARIA', // Urdu voice (fallback to Arabic)
      'hi': 'DEFAULT_FEMALE',   // Hindi voice (fallback)
      'tr': 'DEFAULT_FEMALE',   // Turkish voice (fallback)
      'fil': 'DEFAULT_FEMALE'   // Filipino voice (fallback)
    };

    // Get voice profile based on current language
    const voiceProfile = languageVoiceMap[language] || 'DEFAULT_FEMALE';

    playVoiceResponse({ 
      text, 
      emotion: { type: emotion || 'neutral' },
      language: language,
      voiceProfile: voiceProfile
    });

    // Track TTS usage for A/B testing
    if (window.analytics && typeof window.analytics.track === 'function') {
      window.analytics.track('TTS Used', {
        language: language,
        emotion: emotion,
        voiceProfile: voiceProfile
      });
    }
  };

  // Handle voice input
  const handleVoiceInput = async () => {
    // Create a SpeechRecognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'assistant',
        text: '⚠️ التعرف على الصوت غير مدعوم في هذا المتصفح.',
        emotion: 'sad'
      }]);
      return;
    }

    // Check for microphone permission first
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Stop the stream immediately after permission is granted
      stream.getTracks().forEach(track => track.stop());

      // Now that we have permission, initialize speech recognition
      const recognition = new SpeechRecognition();

      // Set language based on current UI language
      const languageMap = {
        'ar': 'ar-SA',
        'en': 'en-US',
        'fr': 'fr-FR',
        'ur': 'ur-PK',
        'hi': 'hi-IN',
        'tr': 'tr-TR',
        'fil': 'fil-PH'
      };

      recognition.lang = languageMap[language] || 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;

        // Check if transcript is valid
        if (!transcript || transcript.trim().length < 2) {
          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            type: 'assistant',
            text: '⚠️ لم يتم التعرف على كلام واضح. يرجى المحاولة مرة أخرى والتحدث بوضوح.',
            emotion: 'neutral'
          }]);
          return;
        }

        // Set input value and process immediately
        setInputValue(transcript);
        handleInput(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);

        // Handle specific error types
        let errorMessage = '⚠️ حدث خطأ في التعرف على الصوت. يرجى المحاولة مرة أخرى.';

        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          errorMessage = '⚠️ لم يتم السماح بالوصول إلى الميكروفون. يرجى السماح بالوصول في إعدادات المتصفح.';
        } else if (event.error === 'no-speech') {
          errorMessage = '⚠️ لم يتم اكتشاف أي صوت. يرجى التحدث بصوت أعلى أو التأكد من أن الميكروفون يعمل.';
        } else if (event.error === 'audio-capture') {
          errorMessage = '⚠️ لا يمكن التقاط الصوت. يرجى التأكد من أن الميكروفون متصل ويعمل بشكل صحيح.';
        } else if (event.error === 'network') {
          errorMessage = '⚠️ حدث خطأ في الشبكة. يرجى التحقق من اتصالك بالإنترنت.';
        }

        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'assistant',
          text: errorMessage,
          emotion: 'sad'
        }]);
      };

      recognition.onend = () => {
        // Remove the listening indicator when recognition ends
        setMessages(prev => prev.filter(msg => msg.type !== 'system' || msg.text !== '🎤 جاري الاستماع...'));
      };

      // Add listening indicator message
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'system',
        text: '🎤 جاري الاستماع...',
      }]);

      // Start recognition
      recognition.start();

    } catch (error) {
      console.error('Microphone permission error:', error);

      // Handle permission errors
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'assistant',
        text: '⚠️ لم يتم السماح بالوصول إلى الميكروفون. يرجى السماح بالوصول في إعدادات المتصفح.',
        emotion: 'sad'
      }]);
    }
  };

  const handleInput = async (voiceText) => {
    const textToProcess = voiceText || inputValue;
    if (!textToProcess.trim() || isProcessing) return;

    setIsProcessing(true);

    // Remove listening indicator if it exists
    setMessages(prev => prev.filter(msg => msg.type !== 'system'));

    // Detect emotion from input
    const detectedEmotion = emotion.detectEmotionFromText(textToProcess);

    // Process text with NLP processor to get intent and other data
    const nlpResult = nlpProcessor.processText(textToProcess);
    setIntentData(nlpResult.intent);

    // Store the detected emotion and user message for language suggestion
    setLastDetectedEmotion(detectedEmotion);
    setLastUserMessage(textToProcess);

    // Check if we should show language suggestion based on emotion
    const confusionEmotions = ['confused', 'frustrated', 'angry', 'sad'];
    if (confusionEmotions.includes(detectedEmotion?.type)) {
      setShowLanguageSuggestion(true);
    }

    // Add user message to state
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: textToProcess,
      emotion: detectedEmotion?.type || 'neutral',
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);

    // Save user message to chat history
    saveMessage('user', textToProcess);

    // Clear input field
    setInputValue('');

    try {
      // Process the message with the assistant
      const response = await assistant.processUserMessage(textToProcess, false);

      // Add assistant response to state
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        text: response.text,
        emotion: response.emotion?.type || response.tone || 'neutral',
        model: response.model,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save assistant response to chat history
      saveMessage('assistant', response.text);

      // Automatically play TTS if enabled
      if (ttsEnabled) {
        playTTS(response.text, assistantMessage.emotion);
      }
    } catch (error) {
      console.error('Error processing message:', error);

      // Add error message to state
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'assistant',
        text: 'عذراً، حدث خطأ أثناء معالجة رسالتك. يرجى المحاولة مرة أخرى.',
        emotion: 'sad',
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsProcessing(false);
      // Focus input field after processing
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'assistant',
        text: '⚠️ حجم الملف كبير جدًا. يرجى تحميل ملف أصغر من 5 ميجابايت.',
        emotion: 'sad',
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      }]);
      return;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'assistant',
        text: '⚠️ نوع الملف غير مدعوم. الأنواع المدعومة هي: JPEG, PNG, GIF, PDF, TXT.',
        emotion: 'sad',
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      }]);
      return;
    }

    // Add file upload message
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      text: `تم تحميل ملف: ${file.name}`,
      fileInfo: {
        name: file.name,
        type: file.type,
        size: file.size
      },
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    }]);

    // For text files, read and process the content
    if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        // Process the file content
        setInputValue(`محتوى الملف: ${file.name}\n\n${content.substring(0, 500)}${content.length > 500 ? '...' : ''}`);
      };
      reader.readAsText(file);
    } else {
      // For other file types, just acknowledge the upload
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'assistant',
        text: `تم استلام الملف ${file.name}. يمكنك الآن طرح أسئلة حول هذا الملف.`,
        emotion: 'cheerful',
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      }]);
    }

    // Reset the file input
    event.target.value = '';
  };

  // Clear chat history
  const clearChat = () => {
    setMessages([{
      id: Date.now(),
      type: 'assistant',
      text: uiTranslations[language]?.clearChatMessage || 'تم مسح المحادثة. كيف يمكنني مساعدتك؟',
      emotion: 'neutral',
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    }]);
    // Clear session storage
    localStorage.removeItem('mashaaer-messages');
  };

  return (
    <div className="assistant-ui" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Language detection notification */}
      {languageSource === 'browser' && showLanguageNotification && (
        <div className="language-notification">
          <div className="notification-content">
            <span role="img" aria-label="info">ℹ️</span>
            <p>{uiTranslations[language]?.languageNotification}</p>
          </div>
          <button 
            className="dismiss-notification"
            onClick={() => setShowLanguageNotification(false)}
            title={uiTranslations[language]?.dismissNotification}
          >
            ✕
          </button>
        </div>
      )}

      <header className="assistant-header">
        <h1>{uiTranslations[language]?.assistantTitle || 'المساعد الذكي'}</h1>
        <div className="header-actions">
          <HelpTooltip 
            translationKey="settings"
            position="bottom"
            showIcon={false}
          >
            <button 
              className="settings-toggle"
              onClick={() => setShowSettings(!showSettings)}
              title={showSettings 
                ? (language === 'ar' ? "إخفاء الإعدادات" : "Hide Settings") 
                : (language === 'ar' ? "إظهار الإعدادات" : "Show Settings")
              }
            >
              ⚙️
            </button>
          </HelpTooltip>
          <HelpTooltip 
            translationKey="clearChat"
            position="bottom"
            showIcon={false}
          >
            <button 
              className="clear-chat"
              onClick={clearChat}
              title={language === 'ar' ? "مسح المحادثة" : "Clear Chat"}
            >
              🗑️
            </button>
          </HelpTooltip>
          <HelpTooltip 
            content={language === 'ar' ? "تغيير اللغة إلى الإنجليزية" : "Change language to Arabic"}
            position="bottom"
            showIcon={false}
          >
            <button 
              className="language-toggle"
              onClick={toggleLanguage}
              title={language === 'ar' ? "English" : "العربية"}
            >
              {language === 'ar' ? "EN" : "عر"}
            </button>
          </HelpTooltip>
          <HelpTooltip 
            content={language === 'ar' ? "إظهار/إخفاء بطاقة التحليل" : "Show/Hide Insight Card"}
            position="bottom"
            showIcon={false}
          >
            <button 
              className="insight-toggle"
              onClick={() => setShowInsightCard(!showInsightCard)}
              title={language === 'ar' ? (showInsightCard ? "إخفاء بطاقة التحليل" : "إظهار بطاقة التحليل") : (showInsightCard ? "Hide Insight Card" : "Show Insight Card")}
            >
              🧠
            </button>
          </HelpTooltip>
        </div>
      </header>

      {showSettings && (
        <div className="settings-panel" id="settings-panel">
          <div className="settings-header">
            <button 
              className="back-button"
              onClick={() => setShowSettings(false)}
              title={language === 'ar' ? "العودة" : "Back"}
            >
              {language === 'ar' ? "← رجوع" : "← Back"}
            </button>
            <h2>{language === 'ar' ? "الإعدادات" : "Settings"}</h2>
          </div>

          <div className="settings-group">
            <label>اللهجة المفضلة:</label>
            <select
              value={userProfile.preferredDialect}
              onChange={(e) => setUserProfile({ ...userProfile, preferredDialect: e.target.value })}
            >
              <option value="khaliji">خليجي</option>
              <option value="shami">شامي</option>
              <option value="masri">مصري</option>
              <option value="fusha">فصحى</option>
            </select>
          </div>

          <div className="settings-group">
            <label>النبرة المفضلة:</label>
            <select
              value={userProfile.preferredTone}
              onChange={(e) => setUserProfile({ ...userProfile, preferredTone: e.target.value })}
            >
              <option value="cheerful">مبهجة</option>
              <option value="warm">دافئة</option>
              <option value="calm">هادئة</option>
              <option value="curious">فضولية</option>
              <option value="neutral">محايدة</option>
              <option value="reassuring">مطمئنة</option>
              <option value="friendly">ودية</option>
            </select>
          </div>

          <div className="settings-group">
            <label>الصوت المفضل:</label>
            <select
              value={userProfile.preferredVoiceProfile}
              onChange={(e) => setUserProfile({ ...userProfile, preferredVoiceProfile: e.target.value })}
            >
              <option value="GULF_FEMALE_ARIA">أنثى خليجية (آريا)</option>
              <option value="DEFAULT_MALE">ذكر افتراضي</option>
              <option value="DEFAULT_FEMALE">أنثى افتراضية</option>
            </select>
          </div>

          <button 
            className="test-voice-button"
            onClick={() => playTTS(uiTranslations[language]?.testVoiceMessage || 'هذا مثال على الصوت المختار.', userProfile.preferredTone)}
          >
            {uiTranslations[language]?.testVoice || 'تجربة الصوت'}
          </button>

          {/* Language settings section */}
          <div className="settings-section">
            <h3>{uiTranslations[language]?.languageSettings}</h3>

            <div className="language-info">
              <div className="language-source">
                {languageSource === 'browser' ? (
                  <p>
                    <span role="img" aria-label="globe">🌐</span>
                    {language === 'ar' 
                      ? uiTranslations[language]?.browserDetectedLanguage 
                      : uiTranslations[language]?.browserDetectedLanguageEn}
                  </p>
                ) : languageSource === 'user' ? (
                  <p>
                    <span role="img" aria-label="user">👤</span>
                    {language === 'ar' ? 'تم اختيار اللغة يدوياً' : 'Language manually selected'}
                  </p>
                ) : (
                  <p>
                    <span role="img" aria-label="default">⭐</span>
                    {language === 'ar' ? 'اللغة الافتراضية: العربية' : 'Default language: Arabic'}
                  </p>
                )}
              </div>

              <div className="language-selector">
                <label htmlFor="language-select">{uiTranslations[language]?.languageSelector}</label>
                <select 
                  id="language-select"
                  value={language}
                  onChange={(e) => setAppLanguage(e.target.value)}
                  className="language-dropdown"
                >
                  {supportedLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.nativeName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="current-language">
                <p>
                  <span className="language-flag">{getLanguageMetadata().flag}</span>
                  <span className="language-name">{uiTranslations[language]?.languageName}</span>
                  <span className="language-direction">
                    {isRTL ? '(RTL)' : '(LTR)'}
                  </span>
                </p>
              </div>

              <div className="language-actions">
                <button 
                  className="reset-language-button"
                  onClick={resetToDetectedLanguage}
                  title={language === 'ar' ? 'استخدام لغة المتصفح' : 'Use browser language'}
                >
                  {uiTranslations[language]?.useDetectedLanguage}
                </button>
              </div>
            </div>
          </div>

          <div className="settings-footer">
            <button 
              className="scroll-top-button"
              onClick={() => document.getElementById('settings-panel').scrollTo({ top: 0, behavior: 'smooth' })}
              title={language === 'ar' ? "العودة إلى الأعلى" : "Scroll to top"}
            >
              {language === 'ar' ? "🔼 إلى الأعلى" : "🔼 Top"}
            </button>
          </div>
        </div>
      )}

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <p>{uiTranslations[language]?.emptyChat || 'ابدأ محادثة جديدة مع المساعد الذكي'}</p>
          </div>
        ) : (
          messages.map(message => (
            <div 
              key={message.id} 
              className={`message ${message.type}`}
            >
              {message.type !== 'system' && (
                <div className="message-avatar">
                  {message.type === 'user' ? 
                    '👤' : 
                    '🤖'}
                </div>
              )}
              <div className="message-bubble">
                <div className="message-content">
                  <p>{message.text}</p>
                  {message.type === 'assistant' && (
                    <button 
                      className="tts-button" 
                      onClick={() => playTTS(message.text, message.emotion)}
                      title="تشغيل الصوت"
                    >
                      🔊
                    </button>
                  )}
                </div>
                {message.type !== 'system' && (
                  <div className="message-meta">
                    {message.emotion && (
                      <HelpTooltip 
                        translationKey="emotionTag"
                        position="top"
                        showIcon={false}
                      >
                        <span className="emotion-tag">
                          {emotionIcons[message.emotion] || '😐'} {message.emotion}
                        </span>
                      </HelpTooltip>
                    )}
                    {message.model && (
                      <HelpTooltip 
                        translationKey="modelTag"
                        position="top"
                        showIcon={false}
                      >
                        <span className="model-tag">{message.model}</span>
                      </HelpTooltip>
                    )}
                    {message.timestamp && (
                      <HelpTooltip 
                        translationKey="timestamp"
                        position="top"
                        showIcon={false}
                      >
                        <span className="timestamp">{message.timestamp}</span>
                      </HelpTooltip>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Language suggestion component */}
      {showLanguageSuggestion && (
        <LanguageSuggestion
          detectedEmotion={lastDetectedEmotion}
          userMessage={lastUserMessage}
          onClose={() => setShowLanguageSuggestion(false)}
        />
      )}

      {/* AI Insight Card component */}
      {showInsightCard && lastUserMessage && lastDetectedEmotion && (
        <AIInsightCard
          userInput={lastUserMessage}
          emotionData={lastDetectedEmotion}
          intentData={intentData}
          isVisible={showInsightCard}
        />
      )}

      <div className="input-container">
        <HelpTooltip 
          translationKey="voiceInput"
          position="top"
          showIcon={false}
        >
          <button 
            className="voice-input-button"
            onClick={handleVoiceInput}
            title="إدخال صوتي"
            disabled={isProcessing}
          >
            🎤
          </button>
        </HelpTooltip>

        <HelpTooltip 
          translationKey="fileUpload"
          position="top"
          showIcon={false}
        >
          <label className="file-upload-button" title="تحميل ملف">
            📎
            <input 
              type="file"
              onChange={handleFileUpload}
              disabled={isProcessing}
              style={{ display: 'none' }}
              accept="image/jpeg,image/png,image/gif,application/pdf,text/plain"
            />
          </label>
        </HelpTooltip>

        <HelpTooltip 
          translationKey="inputField"
          position="top"
          showIcon={false}
        >
          <input 
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={uiTranslations[language]?.inputPlaceholder || 'أدخل الطلب هنا...'}
            onKeyDown={(e) => e.key === 'Enter' && handleInput()} 
            disabled={isProcessing}
          />
        </HelpTooltip>
        <HelpTooltip 
          translationKey="sendButton"
          position="top"
          showIcon={false}
        >
          <button 
            className="send-button"
            onClick={() => handleInput()}
            disabled={isProcessing || !inputValue.trim()}
          >
            {isProcessing ? <span className="loading-dots">...</span> : '↑'}
          </button>
        </HelpTooltip>
        <HelpTooltip 
          translationKey={ttsEnabled ? 'ttsToggleOn' : 'ttsToggleOff'}
          position="top"
          showIcon={false}
        >
          <button 
            className={`tts-toggle ${ttsEnabled ? 'active' : ''}`}
            onClick={() => setTtsEnabled(!ttsEnabled)}
            title={ttsEnabled ? 'إيقاف التشغيل التلقائي للصوت' : 'تفعيل التشغيل التلقائي للصوت'}
          >
            {ttsEnabled ? '🔊' : '🔇'}
          </button>
        </HelpTooltip>
        <HelpTooltip 
          translationKey="ttsMode"
          position="top"
          showIcon={false}
        >
          <button 
            className="tts-mode-toggle"
            onClick={toggleTTSMode}
            title="تبديل وضع التحويل من نص إلى كلام"
          >
            TTS
          </button>
        </HelpTooltip>
      </div>
    </div>
  );
}
