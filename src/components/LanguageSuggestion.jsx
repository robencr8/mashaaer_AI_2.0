import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.js';
import { uiTranslations } from '../translations';
import './LanguageSuggestion.css';

/**
 * LanguageSuggestion Component
 * 
 * This component displays a suggestion to switch languages when the user
 * appears to be confused or frustrated, based on emotion detection.
 */
const LanguageSuggestion = ({ 
  detectedEmotion, 
  userMessage, 
  onClose,
  suggestedLanguage = null 
}) => {
  const { language, setAppLanguage, supportedLanguages } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [suggestedLang, setSuggestedLang] = useState(null);
  
  // Determine if we should show a language suggestion based on emotion and message
  useEffect(() => {
    // Only show suggestion if user is confused or frustrated
    const confusionEmotions = ['confused', 'frustrated', 'angry', 'sad'];
    const isConfused = confusionEmotions.includes(detectedEmotion?.type);
    
    // If a specific language is suggested, use that
    if (suggestedLanguage) {
      const langObj = supportedLanguages.find(l => l.code === suggestedLanguage);
      if (langObj && langObj.code !== language) {
        setSuggestedLang(langObj);
        setIsVisible(true);
        return;
      }
    }
    
    // Otherwise, try to detect language from the message
    if (isConfused && userMessage) {
      // Simple language detection based on common words/characters
      const detectLanguageFromText = (text) => {
        // Arabic characters
        if (/[\u0600-\u06FF]/.test(text) && language !== 'ar') {
          return supportedLanguages.find(l => l.code === 'ar');
        }
        
        // Urdu characters
        if (/[\u0600-\u06FF\u0750-\u077F]/.test(text) && language !== 'ur') {
          return supportedLanguages.find(l => l.code === 'ur');
        }
        
        // Hindi characters
        if (/[\u0900-\u097F]/.test(text) && language !== 'hi') {
          return supportedLanguages.find(l => l.code === 'hi');
        }
        
        // French words
        const frenchWords = ['je', 'tu', 'il', 'elle', 'nous', 'vous', 'bonjour', 'merci', 'oui', 'non'];
        if (frenchWords.some(word => text.toLowerCase().includes(word)) && language !== 'fr') {
          return supportedLanguages.find(l => l.code === 'fr');
        }
        
        // Turkish words
        const turkishWords = ['merhaba', 'teşekkürler', 'evet', 'hayır', 'nasılsın', 'iyi'];
        if (turkishWords.some(word => text.toLowerCase().includes(word)) && language !== 'tr') {
          return supportedLanguages.find(l => l.code === 'tr');
        }
        
        // Filipino words
        const filipinoWords = ['kumusta', 'salamat', 'oo', 'hindi', 'magandang', 'araw'];
        if (filipinoWords.some(word => text.toLowerCase().includes(word)) && language !== 'fil') {
          return supportedLanguages.find(l => l.code === 'fil');
        }
        
        // English is the fallback for confused users if they're not already using English
        if (language !== 'en') {
          return supportedLanguages.find(l => l.code === 'en');
        }
        
        return null;
      };
      
      const detectedLang = detectLanguageFromText(userMessage);
      if (detectedLang) {
        setSuggestedLang(detectedLang);
        setIsVisible(true);
      }
    }
  }, [detectedEmotion, userMessage, language, supportedLanguages, suggestedLanguage]);
  
  // Handle language switch
  const handleSwitchLanguage = () => {
    if (suggestedLang) {
      setAppLanguage(suggestedLang.code);
      
      // Track language switch for A/B testing
      if (window.analytics && typeof window.analytics.track === 'function') {
        window.analytics.track('Language Switched', {
          from: language,
          to: suggestedLang.code,
          source: 'emotion-suggestion',
          emotion: detectedEmotion?.type
        });
      }
      
      handleClose();
    }
  };
  
  // Handle close
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(() => {
        onClose();
      }, 300);
    }
  };
  
  if (!isVisible || !suggestedLang) return null;
  
  return (
    <div className="language-suggestion-container">
      <div className="language-suggestion">
        <div className="suggestion-content">
          <span className="suggestion-icon">🌐</span>
          <p>
            {uiTranslations[language]?.emotionAwareLanguageSuggestion.replace(
              '{language}', 
              suggestedLang.nativeName
            )}
          </p>
        </div>
        <div className="suggestion-actions">
          <button 
            className="suggestion-yes" 
            onClick={handleSwitchLanguage}
          >
            {uiTranslations[language]?.yes}
          </button>
          <button 
            className="suggestion-no" 
            onClick={handleClose}
          >
            {uiTranslations[language]?.no}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSuggestion;