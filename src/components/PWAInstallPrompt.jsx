import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.js';
import { uiTranslations } from '../translations';
import './PWAInstallPrompt.css';

/**
 * PWAInstallPrompt Component
 * 
 * This component displays a prompt to install the PWA app
 * with localized messages based on the current language.
 */
const PWAInstallPrompt = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const { language } = useLanguage();

  useEffect(() => {
    // Check if the app is already installed
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                          window.navigator.standalone === true;
    
    // Check if the user has dismissed the prompt before
    const hasPromptBeenDismissed = localStorage.getItem('pwa-prompt-dismissed') === 'true';
    
    if (isAppInstalled || hasPromptBeenDismissed) {
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the default browser prompt
      e.preventDefault();
      
      // Store the event for later use
      setDeferredPrompt(e);
      
      // Show our custom prompt after a delay
      setTimeout(() => {
        setIsVisible(true);
      }, 5000); // Show after 5 seconds
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Clean up
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Handle install button click
  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the browser's install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond
    const { outcome } = await deferredPrompt.userChoice;
    
    // Track the outcome
    if (window.analytics && typeof window.analytics.track === 'function') {
      window.analytics.track('PWA Install Prompt', {
        action: 'clicked',
        outcome: outcome,
        language: language
      });
    }
    
    // Clear the deferred prompt
    setDeferredPrompt(null);
    
    // Hide our prompt
    setIsVisible(false);
  };

  // Handle dismiss button click
  const handleDismiss = () => {
    // Track the dismissal
    if (window.analytics && typeof window.analytics.track === 'function') {
      window.analytics.track('PWA Install Prompt', {
        action: 'dismissed',
        language: language
      });
    }
    
    // Remember that the user dismissed the prompt
    localStorage.setItem('pwa-prompt-dismissed', 'true');
    
    // Hide the prompt
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="pwa-install-prompt" dir={language === 'ar' || language === 'ur' ? 'rtl' : 'ltr'}>
      <div className="prompt-content">
        <span className="prompt-icon">📱</span>
        <p>{uiTranslations[language]?.installApp}</p>
      </div>
      <div className="prompt-actions">
        <button className="install-button" onClick={handleInstall}>
          {language === 'ar' || language === 'ur' ? 'تثبيت' : 
           language === 'fr' ? 'Installer' : 
           language === 'hi' ? 'इंस्टॉल करें' : 
           language === 'tr' ? 'Yükle' : 
           language === 'fil' ? 'I-install' : 
           'Install'}
        </button>
        <button className="dismiss-button" onClick={handleDismiss}>
          {language === 'ar' || language === 'ur' ? 'لاحقاً' : 
           language === 'fr' ? 'Plus tard' : 
           language === 'hi' ? 'बाद में' : 
           language === 'tr' ? 'Daha sonra' : 
           language === 'fil' ? 'Mamaya' : 
           'Later'}
        </button>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;