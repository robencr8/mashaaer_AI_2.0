import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.js';
import './AIInsightCard.css';

/**
 * AIInsightCard component
 * Displays an AI-generated insight card based on user input
 * Similar to ClickUp's AI Cards but with emotional intelligence
 */
const AIInsightCard = ({ userInput, emotionData, intentData, isVisible = true }) => {
  const { language } = useLanguage();
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cardVisible, setCardVisible] = useState(isVisible);

  // Generate summary when input or emotion changes
  useEffect(() => {
    if (!userInput || !emotionData) return;
    
    setIsLoading(true);
    
    // Generate a summary based on the input and emotion
    const generateSummary = () => {
      // In a real implementation, this would call an API
      // For now, we'll generate a simple summary
      const emotion = emotionData.type || 'neutral';
      const intensity = emotionData.intensity || 0.5;
      const intent = intentData?.primary || 'general';
      
      let summaryText = '';
      
      // Generate summary based on emotion and intent
      if (intensity > 0.7) {
        summaryText = language === 'ar' 
          ? `يبدو أنك تشعر بـ ${getEmotionName(emotion, language)} بشكل قوي.`
          : `You seem to be feeling strongly ${getEmotionName(emotion, language)}.`;
      } else if (intensity > 0.4) {
        summaryText = language === 'ar'
          ? `أرى أنك تشعر بـ ${getEmotionName(emotion, language)}.`
          : `I see you're feeling ${getEmotionName(emotion, language)}.`;
      } else {
        summaryText = language === 'ar'
          ? `أرى بعض مشاعر ${getEmotionName(emotion, language)}.`
          : `I detect some ${getEmotionName(emotion, language)} feelings.`;
      }
      
      // Add intent-based insight
      if (intent !== 'general') {
        const intentInsight = getIntentInsight(intent, language);
        summaryText += ' ' + intentInsight;
      }
      
      return summaryText;
    };
    
    // Set timeout to simulate API call
    const timer = setTimeout(() => {
      const generatedSummary = generateSummary();
      setSummary(generatedSummary);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [userInput, emotionData, intentData, language]);
  
  // Helper function to get emotion name in current language
  const getEmotionName = (emotion, lang) => {
    const emotionNames = {
      happy: { ar: 'السعادة', en: 'happy' },
      sad: { ar: 'الحزن', en: 'sad' },
      angry: { ar: 'الغضب', en: 'angry' },
      fearful: { ar: 'الخوف', en: 'fearful' },
      surprised: { ar: 'المفاجأة', en: 'surprised' },
      disgusted: { ar: 'الاشمئزاز', en: 'disgusted' },
      neutral: { ar: 'الحياد', en: 'neutral' },
      confident: { ar: 'الثقة', en: 'confident' },
      curious: { ar: 'الفضول', en: 'curious' },
      calm: { ar: 'الهدوء', en: 'calm' }
    };
    
    return emotionNames[emotion]?.[lang] || emotion;
  };
  
  // Helper function to get intent insight
  const getIntentInsight = (intent, lang) => {
    const intentInsights = {
      business: {
        ar: 'يبدو أنك تفكر في أمور تتعلق بالأعمال أو الإدارة.',
        en: 'You seem to be thinking about business or management matters.'
      },
      creative: {
        ar: 'أرى أنك في حالة إبداعية وتبحث عن الإلهام.',
        en: 'I see you\'re in a creative mood and looking for inspiration.'
      },
      time_focus: {
        ar: 'تبدو مهتمًا بتحسين إنتاجيتك وإدارة وقتك.',
        en: 'You seem interested in improving your productivity and time management.'
      },
      movie: {
        ar: 'يبدو أنك مهتم بالأفلام أو السينما.',
        en: 'You appear to be interested in movies or cinema.'
      },
      book: {
        ar: 'أرى اهتمامًا بالكتب أو الأدب.',
        en: 'I notice an interest in books or literature.'
      },
      default: {
        ar: 'أنا هنا للمساعدة في أي موضوع تريده.',
        en: 'I\'m here to help with any topic you\'d like.'
      }
    };
    
    return intentInsights[intent]?.[lang] || intentInsights.default[lang];
  };
  
  // Toggle card visibility
  const toggleCardVisibility = () => {
    setCardVisible(!cardVisible);
  };
  
  // If card is not visible, show only the toggle button
  if (!cardVisible) {
    return (
      <div className="ai-insight-toggle-container">
        <button 
          className="ai-insight-toggle-button" 
          onClick={toggleCardVisibility}
          title={language === 'ar' ? 'إظهار بطاقة التحليل' : 'Show insight card'}
        >
          {language === 'ar' ? 'إظهار التحليل' : 'Show Insights'}
        </button>
      </div>
    );
  }
  
  return (
    <div className="ai-insight-card">
      <div className="ai-insight-header">
        <h3>{language === 'ar' ? 'بطاقة التحليل الذكي' : 'AI Insight Card'}</h3>
        <button 
          className="ai-insight-close-button" 
          onClick={toggleCardVisibility}
          title={language === 'ar' ? 'إخفاء' : 'Hide'}
        >
          ×
        </button>
      </div>
      
      <div className="ai-insight-content">
        {isLoading ? (
          <div className="ai-insight-loading">
            <div className="ai-insight-loading-spinner"></div>
            <p>{language === 'ar' ? 'جاري التحليل...' : 'Analyzing...'}</p>
          </div>
        ) : (
          <>
            {emotionData && (
              <div className="ai-insight-emotion">
                <div className="ai-insight-emotion-icon">
                  {getEmotionIcon(emotionData.type || 'neutral')}
                </div>
                <div className="ai-insight-emotion-details">
                  <h4>{language === 'ar' ? 'الحالة العاطفية' : 'Emotional State'}</h4>
                  <p>{getEmotionName(emotionData.type || 'neutral', language)}</p>
                  <div className="ai-insight-intensity-bar">
                    <div 
                      className="ai-insight-intensity-fill" 
                      style={{ width: `${(emotionData.intensity || 0.5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            
            {intentData && (
              <div className="ai-insight-intent">
                <h4>{language === 'ar' ? 'النية المحتملة' : 'Likely Intent'}</h4>
                <p>{getIntentName(intentData.primary || 'default', language)}</p>
              </div>
            )}
            
            <div className="ai-insight-summary">
              <h4>{language === 'ar' ? 'التحليل' : 'Analysis'}</h4>
              <p>{summary}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Helper function to get emotion icon
const getEmotionIcon = (emotion) => {
  const emotionIcons = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    fearful: '😨',
    surprised: '😲',
    disgusted: '🤢',
    neutral: '😐',
    confident: '💪',
    curious: '🧐',
    calm: '😌'
  };
  
  return emotionIcons[emotion] || '😐';
};

// Helper function to get intent name in current language
const getIntentName = (intent, lang) => {
  const intentNames = {
    business: { ar: 'الأعمال', en: 'Business' },
    creative: { ar: 'الإبداع', en: 'Creative' },
    time_focus: { ar: 'الإنتاجية', en: 'Productivity' },
    movie: { ar: 'الأفلام', en: 'Movies' },
    book: { ar: 'الكتب', en: 'Books' },
    quote: { ar: 'الاقتباسات', en: 'Quotes' },
    ai_news: { ar: 'أخبار الذكاء الاصطناعي', en: 'AI News' },
    world_facts: { ar: 'حقائق عالمية', en: 'World Facts' },
    music: { ar: 'الموسيقى', en: 'Music' },
    history: { ar: 'التاريخ', en: 'History' },
    default: { ar: 'عام', en: 'General' }
  };
  
  return intentNames[intent]?.[lang] || intentNames.default[lang];
};

export default AIInsightCard;