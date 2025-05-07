import React, { useState, useRef, useEffect } from 'react';
import './HelpTooltip.css';
import { useLanguage } from '../context/LanguageContext.js';
import { tooltipTranslations } from '../translations';

/**
 * HelpTooltip Component
 * 
 * This component displays a tooltip with helpful information when hovering over UI elements.
 * It can be positioned relative to the target element in different directions.
 * Supports multiple languages through the LanguageContext.
 */
const HelpTooltip = ({ 
  children, 
  content, 
  position = 'top',
  showIcon = true,
  delay = 300,
  className = '',
  translationKey = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const tooltipRef = useRef(null);
  const timerRef = useRef(null);
  const { language } = useLanguage();

  // Get translated content if translationKey is provided
  const tooltipContent = translationKey 
    ? tooltipTranslations[language]?.[translationKey] || content
    : content;

  // Show tooltip with delay
  const showTooltip = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  // Hide tooltip
  const hideTooltip = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!isHovered && !isFocused) {
        setIsVisible(false);
      }
    }, 100);
  };

  // Handle mouse events
  const handleMouseEnter = () => {
    setIsHovered(true);
    showTooltip();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    hideTooltip();
  };

  // Handle focus events
  const handleFocus = () => {
    setIsFocused(true);
    showTooltip();
  };

  const handleBlur = () => {
    setIsFocused(false);
    hideTooltip();
  };

  // Handle tooltip mouse events
  const handleTooltipMouseEnter = () => {
    setIsHovered(true);
  };

  const handleTooltipMouseLeave = () => {
    setIsHovered(false);
    hideTooltip();
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  // Handle click outside to close tooltip
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  return (
    <div 
      className={`help-tooltip-container ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {showIcon ? (
        <div className="tooltip-trigger">
          {children}
          <span className="help-icon">?</span>
        </div>
      ) : (
        <div className="tooltip-trigger">
          {children}
        </div>
      )}

      {isVisible && (
        <div 
          className={`tooltip-content ${position}`}
          ref={tooltipRef}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
          {tooltipContent}
          <div className={`tooltip-arrow ${position}`}></div>
        </div>
      )}
    </div>
  );
};

export default HelpTooltip;
