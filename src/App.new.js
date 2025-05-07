/**
 * App Component
 * 
 * This is the main component of the application.
 * It uses the AssistantUI component to provide a modern interface
 * for interacting with the voice assistant.
 */

// Import React and hooks
import React, { useEffect } from 'react';

// Import services context
import { useServices } from './context/services-context.js';

// Import LanguageProvider
import { LanguageProvider } from './context/LanguageContext.js';

// Import AssistantUI component
import AssistantUI from './components/AssistantUI.jsx';

// Import styles
import './App.css';

const App = () => {
  // Get services from context
  const {
    configService,
    assistantService,
    emotionService,
    apiService,
    voiceService,
    memoryService,
    themeService
  } = useServices();

  // Initialize services when component mounts
  useEffect(() => {
    // Initialize all services
    configService?.initialize?.();
    assistantService?.initialize?.();
    emotionService?.initialize?.();
    apiService?.initialize?.();
    voiceService?.initialize?.();
    memoryService?.initialize?.();
    themeService?.initialize?.();

    // Apply theme from theme service
    if (themeService) {
      themeService.applyCurrentTheme();
    }

    // Log initialization
    console.log('All services initialized');
  }, [
    configService,
    assistantService,
    emotionService,
    apiService,
    voiceService,
    memoryService,
    themeService
  ]);

  return (
    <div className="app-container" dir="rtl">
      {/* Wrap AssistantUI with LanguageProvider */}
      <LanguageProvider>
        <AssistantUI />
      </LanguageProvider>
    </div>
  );
};

export default App;
