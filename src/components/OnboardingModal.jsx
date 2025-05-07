import React, { useState, useEffect } from 'react';
import './OnboardingModal.css';
import { useLanguage } from '../context/LanguageContext.js';
import { onboardingTranslations } from '../translations';

/**
 * OnboardingModal Component
 * 
 * This component displays a modal with onboarding information for first-time users.
 * It includes multiple steps to introduce key features of the application.
 * Supports multiple languages through the LanguageContext.
 */
const OnboardingModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(isOpen);
  const { language, toggleLanguage } = useLanguage();

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  // Get steps from translations based on current language
  const steps = onboardingTranslations[language]?.steps || [];

  // Handle next step
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle close
  const handleClose = () => {
    setIsVisible(false);

    // Track onboarding completion for A/B testing
    if (window.analytics && typeof window.analytics.track === 'function') {
      window.analytics.track('Onboarding Completed', {
        language: language,
        step: currentStep + 1,
        totalSteps: steps.length,
        completed: currentStep === steps.length - 1,
        skipped: currentStep < steps.length - 1
      });
    }

    // Add a small delay before calling onClose to allow the animation to complete
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Skip onboarding
  const handleSkip = () => {
    handleClose();
  };

  // If not visible, don't render
  if (!isVisible) return null;

  return (
    <div className={`onboarding-overlay ${isVisible ? 'visible' : ''}`}>
      <div className="onboarding-modal">
        <button className="close-button" onClick={handleClose}>✖</button>

        <div className="step-indicator">
          {steps.map((_, index) => (
            <div 
              key={index} 
              className={`step-dot ${index === currentStep ? 'active' : ''}`}
              onClick={() => setCurrentStep(index)}
            />
          ))}
        </div>

        <div className="step-content">
          <div className="step-image">{steps[currentStep].image}</div>
          <h2>{steps[currentStep].title}</h2>
          <p>{steps[currentStep].content}</p>
        </div>

        <div className="step-actions">
          {currentStep > 0 && (
            <button className="previous-button" onClick={handlePrevious}>
              {onboardingTranslations[language]?.buttons?.previous || 'السابق'}
            </button>
          )}

          <button className="skip-button" onClick={handleSkip}>
            {onboardingTranslations[language]?.buttons?.skip || 'تخطي'}
          </button>

          <button className="next-button" onClick={handleNext}>
            {currentStep < steps.length - 1 
              ? onboardingTranslations[language]?.buttons?.next || 'التالي'
              : onboardingTranslations[language]?.buttons?.finish || 'إنهاء'
            }
          </button>
        </div>

        {/* Language toggle button */}
        <button 
          className="language-toggle-button"
          onClick={toggleLanguage}
          title={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
        >
          {language === 'ar' ? 'English' : 'العربية'}
        </button>
      </div>
    </div>
  );
};

export default OnboardingModal;
