// Translation files for the application
// Contains translations for multiple languages

// Import language files
import arTranslations from './locales/ar.json';
import enTranslations from './locales/en.json';
import frTranslations from './locales/fr.json';
import urTranslations from './locales/ur.json';
import hiTranslations from './locales/hi.json';
import trTranslations from './locales/tr.json';
import filTranslations from './locales/fil.json';

// List of supported languages with metadata
export const supportedLanguages = [
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    dir: 'rtl',
    flag: '🇸🇦'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
    flag: '🇺🇸'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    dir: 'ltr',
    flag: '🇫🇷'
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    dir: 'rtl',
    flag: '🇵🇰'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    dir: 'ltr',
    flag: '🇮🇳'
  },
  {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    dir: 'ltr',
    flag: '🇹🇷'
  },
  {
    code: 'fil',
    name: 'Filipino',
    nativeName: 'Filipino',
    dir: 'ltr',
    flag: '🇵🇭'
  }
];

// RTL languages
export const rtlLanguages = ['ar', 'ur'];

// Onboarding modal translations
export const onboardingTranslations = {
  ar: arTranslations.onboarding,
  en: enTranslations.onboarding,
  fr: frTranslations.onboarding,
  ur: urTranslations.onboarding,
  hi: hiTranslations.onboarding,
  tr: trTranslations.onboarding,
  fil: filTranslations.onboarding
};

// Tooltip translations
export const tooltipTranslations = {
  ar: arTranslations.tooltips,
  en: enTranslations.tooltips,
  fr: frTranslations.tooltips,
  ur: urTranslations.tooltips,
  hi: hiTranslations.tooltips,
  tr: trTranslations.tooltips,
  fil: filTranslations.tooltips
};

// UI element translations
export const uiTranslations = {
  ar: arTranslations.ui,
  en: enTranslations.ui,
  fr: frTranslations.ui,
  ur: urTranslations.ui,
  hi: hiTranslations.ui,
  tr: trTranslations.ui,
  fil: filTranslations.ui
};

// Helper function to get translations based on current language
export const getTranslation = (translationObj, language, key) => {
  if (!translationObj || !language || !key) return '';

  // If language is not supported, fall back to English
  if (!supportedLanguages.some(lang => lang.code === language)) {
    language = 'en';
  }

  // Handle nested keys (e.g., 'buttons.next')
  if (key.includes('.')) {
    const keys = key.split('.');
    let result = translationObj[language];

    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        return '';
      }
    }

    return result;
  }

  return translationObj[language][key] || '';
};
