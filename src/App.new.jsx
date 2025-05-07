import React, { useEffect, useState, lazy, Suspense } from 'react';
import { LanguageProvider } from './context/LanguageContext.js';

// Lazy load components for code splitting
const AssistantUI = lazy(() => import('./components/AssistantUI.jsx'));
const OnboardingModal = lazy(() => import('./components/OnboardingModal.jsx'));
const PWAInstallPrompt = lazy(() => import('./components/PWAInstallPrompt.jsx'));
const TranslationAdmin = lazy(() => import('./components/TranslationAdmin.jsx'));

import emotionService from './services/emotionService.js';
import apiService from './services/apiService.js';
import voiceService from './services/voiceService.js';
import memoryService from './services/memoryService.js';
import themeService from './services/themeService.js';

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Initialize all core services
    emotionService.init?.();
    apiService.init?.();
    voiceService.init?.();
    memoryService.init?.();
    themeService.init?.();

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
      <Suspense fallback={<div className="loading">Loading...</div>}>
        <AssistantUI />
        {showOnboarding && (
          <OnboardingModal isOpen={showOnboarding} onClose={handleCloseOnboarding} />
        )}
        <PWAInstallPrompt />
        <TranslationAdmin />
      </Suspense>
    </LanguageProvider>
  );
}

export default App;
