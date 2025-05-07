import React, { createContext, useState, useContext, useEffect } from 'react';
import { supportedLanguages, rtlLanguages } from '../translations/index.js';

// Create a context for language
const LanguageContext = createContext();

// Helper function to detect browser language
const detectBrowserLanguage = () => {
  // Get browser language
  const browserLang = navigator.language || navigator.userLanguage;

  if (browserLang) {
    // Extract the language code (e.g., 'en-US' -> 'en')
    const langCode = browserLang.split('-')[0].toLowerCase();

    // Check if the language is supported
    const isSupported = supportedLanguages.some(lang => lang.code === langCode);
    if (isSupported) {
      return langCode;
    }

    // Check if any supported language matches the browser language
    for (const lang of supportedLanguages) {
      if (browserLang.startsWith(lang.code)) {
        return lang.code;
      }
    }
  }

  // Default to Arabic if browser language is not supported
  return 'ar';
};

// Create a provider component
export const LanguageProvider = ({ children }) => {
  // Track how the language was detected
  const [languageSource, setLanguageSource] = useState('default');

  // Initialize language state with priority:
  // 1. User's previously selected language (from localStorage)
  // 2. Browser language settings
  // 3. Default language (Arabic)
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('mashaaer-language');

    if (savedLanguage && supportedLanguages.some(lang => lang.code === savedLanguage)) {
      setLanguageSource('user');
      return savedLanguage;
    }

    const browserLanguage = detectBrowserLanguage();
    if (browserLanguage !== 'ar') { // Only set source if not default
      setLanguageSource('browser');
    }

    return browserLanguage; // Use browser language if no saved preference
  });

  // Update localStorage and document direction when language changes
  useEffect(() => {
    localStorage.setItem('mashaaer-language', language);

    // Update document direction based on language (RTL for Arabic and Urdu, LTR for others)
    document.documentElement.dir = rtlLanguages.includes(language) ? 'rtl' : 'ltr';

    // Add language class to body for CSS targeting
    document.body.className = document.body.className
      .replace(/lang-\w+/g, '')
      .trim() + ` lang-${language}`;

    // Log language change for analytics
    console.log(`Language changed to: ${language} (Source: ${languageSource})`);

    // Track language change event for A/B testing
    if (window.analytics && typeof window.analytics.track === 'function') {
      window.analytics.track('Language Changed', {
        language,
        source: languageSource
      });
    }
  }, [language, languageSource]);

  // Function to toggle between Arabic and English (legacy support)
  const toggleLanguage = () => {
    setLanguageSource('user'); // User manually changed the language
    setLanguage(prevLang => prevLang === 'ar' ? 'en' : 'ar');
  };

  // Function to set language directly
  const setAppLanguage = (lang) => {
    if (supportedLanguages.some(l => l.code === lang)) {
      setLanguageSource('user'); // User manually changed the language
      setLanguage(lang);
    } else {
      console.warn(`Language ${lang} is not supported. Falling back to English.`);
      setLanguageSource('user');
      setLanguage('en');
    }
  };

  // Function to reset to browser language
  const resetToDetectedLanguage = () => {
    const browserLanguage = detectBrowserLanguage();
    setLanguageSource('browser');
    setLanguage(browserLanguage);
  };

  // Get language metadata for the current language
  const getLanguageMetadata = () => {
    return supportedLanguages.find(lang => lang.code === language) || supportedLanguages[0];
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      toggleLanguage, 
      setAppLanguage, 
      languageSource,
      resetToDetectedLanguage,
      supportedLanguages,
      getLanguageMetadata,
      isRTL: rtlLanguages.includes(language)
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
