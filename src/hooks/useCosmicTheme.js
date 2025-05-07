/**
 * useCosmicTheme Hook
 * 
 * This hook provides access to the cosmic theme instance and methods to update its settings.
 */

import { useState, useEffect } from 'react';

const useCosmicTheme = () => {
  // State to track theme settings
  const [settings, setSettings] = useState({
    accentColor: 'neutral',
    animationSpeed: 'normal',
    starDensity: 'medium',
    starShape: 'circle'
  });

  // Initialize settings from the global cosmic theme instance
  useEffect(() => {
    if (window.cosmicTheme) {
      setSettings({ ...window.cosmicTheme.settings });
    }
  }, []);

  // Update a specific setting
  const updateSetting = (key, value) => {
    if (!window.cosmicTheme) return;

    // Update the cosmic theme instance
    window.cosmicTheme.settings[key] = value;

    // Apply the changes
    window.cosmicTheme.applyTheme();

    // Update local state
    setSettings({ ...window.cosmicTheme.settings });
  };

  // Get available options for each setting
  const getOptions = (settingType) => {
    switch (settingType) {
      case 'accentColor':
        return [
          { value: 'cheerful', label: 'مبهجة (Cheerful)' },
          { value: 'warm', label: 'دافئة (Warm)' },
          { value: 'calm', label: 'هادئة (Calm)' },
          { value: 'curious', label: 'فضولية (Curious)' },
          { value: 'neutral', label: 'محايدة (Neutral)' },
          { value: 'reassuring', label: 'مطمئنة (Reassuring)' },
          { value: 'friendly', label: 'ودية (Friendly)' }
        ];
      case 'animationSpeed':
        return [
          { value: 'slow', label: 'بطيء (Slow)' },
          { value: 'normal', label: 'عادي (Normal)' },
          { value: 'fast', label: 'سريع (Fast)' }
        ];
      case 'starDensity':
        return [
          { value: 'low', label: 'منخفضة (Low)' },
          { value: 'medium', label: 'متوسطة (Medium)' },
          { value: 'high', label: 'عالية (High)' }
        ];
      case 'starShape':
        return [
          { value: 'circle', label: 'دائرة (Circle)' },
          { value: 'triangle', label: 'مثلث (Triangle)' },
          { value: 'star', label: 'نجمة (Star)' },
          { value: 'diamond', label: 'معين (Diamond)' }
        ];
      default:
        return [];
    }
  };

  // Reset all cosmic theme settings to defaults
  const resetCosmicTheme = () => {
    if (!window.cosmicTheme) return;

    // Default settings
    const defaultSettings = {
      accentColor: 'neutral',
      animationSpeed: 'normal',
      starDensity: 'medium',
      starShape: 'circle'
    };

    // Update all settings
    window.cosmicTheme.settings = { ...defaultSettings };

    // Apply the changes
    window.cosmicTheme.applyTheme();

    // Update local state
    setSettings({ ...defaultSettings });
  };

  return {
    settings,
    updateSetting,
    getOptions,
    resetCosmicTheme
  };
};

export default useCosmicTheme;
