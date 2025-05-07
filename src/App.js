import React, { useEffect, useState } from 'react';
import AssistantUI from './components/AssistantUI.jsx';
import OnboardingModal from './components/OnboardingModal.jsx';
import PWAInstallPrompt from './components/PWAInstallPrompt.jsx';
import TranslationAdmin from './components/TranslationAdmin.jsx';
import ToastContainer from './components/ToastContainer.jsx';
import { LanguageProvider } from './context/LanguageContext.js';

import emotionService from './services/emotionService.js';
import apiService from './services/apiService.js';
import voiceService from './services/voiceService.js';
import memoryService from './services/memoryService.js';
import themeService from './services/themeService.js';
import { initializeCosmicVoiceIntegration, ensureCosmicNebulaEffect } from './integration/cosmic_voice_integration.js';

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Initialize all core services
    emotionService.init?.();
    apiService.init?.();
    voiceService.init?.();
    memoryService.init?.();
    themeService.init?.();

    // Initialize and apply cosmic theme
    if (window.cosmicTheme) {
      if (typeof window.cosmicTheme.initialize === 'function') {
        window.cosmicTheme.initialize();
      }
      if (typeof window.cosmicTheme.applyTheme === 'function') {
        window.cosmicTheme.applyTheme();
      }
    }

    // Initialize Cosmic Nebula Effect and voice integration
    ensureCosmicNebulaEffect();
    initializeCosmicVoiceIntegration();

    // Check if this is the first visit
    const hasVisitedBefore = localStorage.getItem('mashaaer-visited');
    if (!hasVisitedBefore) {
      // Show onboarding for first-time users
      setShowOnboarding(true);
      // Mark as visited
      localStorage.setItem('mashaaer-visited', 'true');
    }
  }, []);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
  };

  return (
    <LanguageProvider>
      <AssistantUI />
      <OnboardingModal isOpen={showOnboarding} onClose={handleCloseOnboarding} />
      <PWAInstallPrompt />
      <TranslationAdmin />
      <ToastContainer />
    </LanguageProvider>
  );
}

export default App;
