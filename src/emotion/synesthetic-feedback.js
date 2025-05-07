/**
 * Mashaaer Enhanced Project
 * Synesthetic Feedback Modes
 *
 * This module provides synesthetic feedback for emotions,
 * giving them sound, movement, texture, and other sensory qualities.
 */

// Synesthetic mappings for different emotions
const synestheticMappings = {
  // Sad emotions
  sad: {
    audio: {
      background: 'gentle_rain',
      effects: ['soft_echo', 'minor_chord'],
      volume: 0.4,
      pitch: 0.8,
      tempo: 0.7
    },
    visual: {
      colors: ['#6272a4', '#8be9fd', '#44475a'],
      animation: 'gentle_waves',
      intensity: 0.6,
      blur: 0.3,
      brightness: 0.7
    },
    haptic: {
      pattern: 'slow_pulse',
      intensity: 0.4,
      duration: 1.5
    },
    voice: {
      tone: 'gentle',
      speed: 0.85,
      pitch: 0.9,
      modulation: 'low'
    }
  },
  
  // Joy emotions
  joy: {
    audio: {
      background: 'soft_bells',
      effects: ['light_chimes', 'major_chord'],
      volume: 0.5,
      pitch: 1.1,
      tempo: 1.2
    },
    visual: {
      colors: ['#50fa7b', '#f1fa8c', '#ffb86c'],
      animation: 'rising_particles',
      intensity: 0.8,
      blur: 0,
      brightness: 1.2
    },
    haptic: {
      pattern: 'double_tap',
      intensity: 0.7,
      duration: 0.8
    },
    voice: {
      tone: 'cheerful',
      speed: 1.1,
      pitch: 1.1,
      modulation: 'high'
    }
  },
  
  // Anger emotions
  anger: {
    audio: {
      background: 'low_rumble',
      effects: ['sharp_accent', 'dissonant_chord'],
      volume: 0.6,
      pitch: 0.9,
      tempo: 1.3
    },
    visual: {
      colors: ['#ff5555', '#ff79c6', '#bd93f9'],
      animation: 'sharp_pulse',
      intensity: 0.9,
      blur: 0.1,
      brightness: 1.1
    },
    haptic: {
      pattern: 'sharp_vibration',
      intensity: 0.8,
      duration: 0.5
    },
    voice: {
      tone: 'firm',
      speed: 1.05,
      pitch: 0.95,
      modulation: 'sharp'
    }
  },
  
  // Fear emotions
  fear: {
    audio: {
      background: 'low_drone',
      effects: ['subtle_dissonance', 'minor_chord'],
      volume: 0.5,
      pitch: 0.85,
      tempo: 0.9
    },
    visual: {
      colors: ['#6272a4', '#bd93f9', '#44475a'],
      animation: 'subtle_tremor',
      intensity: 0.7,
      blur: 0.2,
      brightness: 0.8
    },
    haptic: {
      pattern: 'irregular_pulse',
      intensity: 0.6,
      duration: 1.0
    },
    voice: {
      tone: 'cautious',
      speed: 0.95,
      pitch: 0.9,
      modulation: 'wavering'
    }
  },
  
  // Surprise emotions
  surprise: {
    audio: {
      background: 'bright_accent',
      effects: ['quick_rise', 'suspended_chord'],
      volume: 0.7,
      pitch: 1.2,
      tempo: 1.1
    },
    visual: {
      colors: ['#bd93f9', '#ff79c6', '#f1fa8c'],
      animation: 'quick_flash',
      intensity: 0.9,
      blur: 0.1,
      brightness: 1.3
    },
    haptic: {
      pattern: 'quick_double',
      intensity: 0.8,
      duration: 0.4
    },
    voice: {
      tone: 'animated',
      speed: 1.1,
      pitch: 1.2,
      modulation: 'varied'
    }
  },
  
  // Calm emotions
  calm: {
    audio: {
      background: 'gentle_waves',
      effects: ['soft_resonance', 'major_seventh_chord'],
      volume: 0.3,
      pitch: 1.0,
      tempo: 0.8
    },
    visual: {
      colors: ['#8be9fd', '#6272a4', '#f8f8f2'],
      animation: 'slow_breathing',
      intensity: 0.5,
      blur: 0.2,
      brightness: 0.9
    },
    haptic: {
      pattern: 'gentle_wave',
      intensity: 0.3,
      duration: 2.0
    },
    voice: {
      tone: 'soothing',
      speed: 0.9,
      pitch: 1.0,
      modulation: 'smooth'
    }
  },
  
  // Neutral emotions (default)
  neutral: {
    audio: {
      background: 'ambient_hum',
      effects: [],
      volume: 0.3,
      pitch: 1.0,
      tempo: 1.0
    },
    visual: {
      colors: ['#f8f8f2', '#6272a4', '#8be9fd'],
      animation: 'subtle_pulse',
      intensity: 0.4,
      blur: 0,
      brightness: 1.0
    },
    haptic: {
      pattern: 'single_tap',
      intensity: 0.3,
      duration: 0.5
    },
    voice: {
      tone: 'neutral',
      speed: 1.0,
      pitch: 1.0,
      modulation: 'even'
    }
  }
};

/**
 * Synesthetic Feedback Manager
 * Manages synesthetic feedback for emotions
 */
class SynestheticFeedback {
  constructor() {
    this.mappings = synestheticMappings;
    this.currentEmotion = 'neutral';
    this.currentIntensity = 0.5;
    this.audioEnabled = true;
    this.visualEnabled = true;
    this.hapticEnabled = true;
    this.voiceEnabled = true;
    this.accessibilityMode = false;
    this.customMappings = {};
  }
  
  /**
   * Set the current emotion and intensity
   * @param {string} emotion - The emotion to set
   * @param {number} intensity - The intensity of the emotion (0-1)
   */
  setEmotion(emotion, intensity = 0.5) {
    this.currentEmotion = this.mappings[emotion] ? emotion : 'neutral';
    this.currentIntensity = Math.max(0, Math.min(1, intensity));
    
    // Apply feedback if in browser environment
    if (typeof window !== 'undefined') {
      this.applyFeedback();
    }
  }
  
  /**
   * Enable or disable a feedback mode
   * @param {string} mode - The mode to toggle ('audio', 'visual', 'haptic', 'voice')
   * @param {boolean} enabled - Whether the mode should be enabled
   */
  toggleFeedbackMode(mode, enabled) {
    switch (mode) {
      case 'audio':
        this.audioEnabled = enabled;
        break;
      case 'visual':
        this.visualEnabled = enabled;
        break;
      case 'haptic':
        this.hapticEnabled = enabled;
        break;
      case 'voice':
        this.voiceEnabled = enabled;
        break;
      case 'all':
        this.audioEnabled = enabled;
        this.visualEnabled = enabled;
        this.hapticEnabled = enabled;
        this.voiceEnabled = enabled;
        break;
    }
    
    // Apply changes if in browser environment
    if (typeof window !== 'undefined') {
      this.applyFeedback();
    }
  }
  
  /**
   * Toggle accessibility mode
   * @param {boolean} enabled - Whether accessibility mode should be enabled
   */
  toggleAccessibilityMode(enabled) {
    this.accessibilityMode = enabled;
    
    // Apply changes if in browser environment
    if (typeof window !== 'undefined') {
      this.applyFeedback();
    }
  }
  
  /**
   * Create a custom synesthetic mapping
   * @param {string} name - The name of the custom mapping
   * @param {Object} mapping - The mapping configuration
   */
  createCustomMapping(name, mapping) {
    if (!name || typeof name !== 'string') {
      console.warn('Invalid mapping name');
      return false;
    }
    
    this.customMappings[name] = {
      ...mapping,
      isCustom: true,
      created: Date.now()
    };
    
    return true;
  }
  
  /**
   * Get the current synesthetic mapping
   * @returns {Object} - The current mapping
   */
  getCurrentMapping() {
    const mapping = this.customMappings[this.currentEmotion] || this.mappings[this.currentEmotion] || this.mappings.neutral;
    return this.adjustMappingForIntensity(mapping, this.currentIntensity);
  }
  
  /**
   * Adjust a mapping based on intensity
   * @param {Object} mapping - The mapping to adjust
   * @param {number} intensity - The intensity to apply (0-1)
   * @returns {Object} - The adjusted mapping
   */
  adjustMappingForIntensity(mapping, intensity) {
    // Create a deep copy to avoid modifying the original
    const adjustedMapping = JSON.parse(JSON.stringify(mapping));
    
    // Adjust audio properties
    if (adjustedMapping.audio) {
      adjustedMapping.audio.volume *= intensity;
      adjustedMapping.audio.pitch = 1.0 + ((adjustedMapping.audio.pitch - 1.0) * intensity);
      adjustedMapping.audio.tempo = 1.0 + ((adjustedMapping.audio.tempo - 1.0) * intensity);
    }
    
    // Adjust visual properties
    if (adjustedMapping.visual) {
      adjustedMapping.visual.intensity *= intensity;
      adjustedMapping.visual.blur *= intensity;
      adjustedMapping.visual.brightness = 1.0 + ((adjustedMapping.visual.brightness - 1.0) * intensity);
    }
    
    // Adjust haptic properties
    if (adjustedMapping.haptic) {
      adjustedMapping.haptic.intensity *= intensity;
      adjustedMapping.haptic.duration = adjustedMapping.haptic.duration * (0.5 + (intensity * 0.5));
    }
    
    // Adjust voice properties
    if (adjustedMapping.voice) {
      adjustedMapping.voice.speed = 1.0 + ((adjustedMapping.voice.speed - 1.0) * intensity);
      adjustedMapping.voice.pitch = 1.0 + ((adjustedMapping.voice.pitch - 1.0) * intensity);
    }
    
    return adjustedMapping;
  }
  
  /**
   * Apply synesthetic feedback based on current emotion and settings
   */
  applyFeedback() {
    const mapping = this.getCurrentMapping();
    
    // Apply audio feedback
    if (this.audioEnabled) {
      this.applyAudioFeedback(mapping.audio);
    }
    
    // Apply visual feedback
    if (this.visualEnabled) {
      this.applyVisualFeedback(mapping.visual);
    }
    
    // Apply haptic feedback
    if (this.hapticEnabled) {
      this.applyHapticFeedback(mapping.haptic);
    }
    
    // Apply voice feedback
    if (this.voiceEnabled) {
      this.applyVoiceFeedback(mapping.voice);
    }
    
    // Apply accessibility adaptations if needed
    if (this.accessibilityMode) {
      this.applyAccessibilityAdaptations(mapping);
    }
  }
  
  /**
   * Apply audio feedback
   * @param {Object} audioConfig - Audio configuration
   */
  applyAudioFeedback(audioConfig) {
    if (!audioConfig || typeof window === 'undefined') return;
    
    // Check if audio context is available
    if (!window.AudioContext && !window.webkitAudioContext) {
      console.warn('Audio Context not supported in this browser');
      return;
    }
    
    // In a real implementation, this would play the background sound
    // and apply audio effects based on the configuration
    console.log(`🔊 Playing audio feedback: ${audioConfig.background} (Volume: ${audioConfig.volume.toFixed(2)})`);
    
    // Dispatch event for other components to react to
    const audioEvent = new CustomEvent('synestheticAudioFeedback', {
      detail: {
        config: audioConfig,
        emotion: this.currentEmotion,
        intensity: this.currentIntensity
      }
    });
    
    document.dispatchEvent(audioEvent);
  }
  
  /**
   * Apply visual feedback
   * @param {Object} visualConfig - Visual configuration
   */
  applyVisualFeedback(visualConfig) {
    if (!visualConfig || typeof document === 'undefined') return;
    
    // Get or create the visual feedback overlay
    let overlay = document.getElementById('synesthetic-visual-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'synesthetic-visual-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.pointerEvents = 'none';
      overlay.style.zIndex = '1000';
      overlay.style.transition = 'all 0.5s ease';
      overlay.style.opacity = '0';
      document.body.appendChild(overlay);
    }
    
    // Apply visual effects
    const primaryColor = visualConfig.colors[0];
    overlay.style.background = `linear-gradient(135deg, ${visualConfig.colors.join(', ')})`;
    overlay.style.opacity = visualConfig.intensity * 0.3; // Keep it subtle
    overlay.style.filter = `blur(${visualConfig.blur * 10}px)`;
    
    // Apply animation
    overlay.style.animation = `${visualConfig.animation} 3s infinite`;
    
    // Create animation if it doesn't exist
    if (!document.getElementById('synesthetic-animations')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'synesthetic-animations';
      styleSheet.textContent = `
        @keyframes gentle_waves {
          0% { opacity: ${visualConfig.intensity * 0.2}; }
          50% { opacity: ${visualConfig.intensity * 0.4}; }
          100% { opacity: ${visualConfig.intensity * 0.2}; }
        }
        @keyframes rising_particles {
          0% { transform: translateY(0); }
          100% { transform: translateY(-20px); }
        }
        @keyframes sharp_pulse {
          0% { opacity: ${visualConfig.intensity * 0.2}; }
          10% { opacity: ${visualConfig.intensity * 0.5}; }
          20% { opacity: ${visualConfig.intensity * 0.2}; }
          100% { opacity: ${visualConfig.intensity * 0.2}; }
        }
        @keyframes subtle_tremor {
          0% { transform: translateX(0); }
          25% { transform: translateX(2px); }
          50% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
          100% { transform: translateX(0); }
        }
        @keyframes quick_flash {
          0% { opacity: ${visualConfig.intensity * 0.2}; }
          5% { opacity: ${visualConfig.intensity * 0.6}; }
          15% { opacity: ${visualConfig.intensity * 0.2}; }
          100% { opacity: ${visualConfig.intensity * 0.2}; }
        }
        @keyframes slow_breathing {
          0% { opacity: ${visualConfig.intensity * 0.2}; transform: scale(1); }
          50% { opacity: ${visualConfig.intensity * 0.3}; transform: scale(1.05); }
          100% { opacity: ${visualConfig.intensity * 0.2}; transform: scale(1); }
        }
        @keyframes subtle_pulse {
          0% { opacity: ${visualConfig.intensity * 0.1}; }
          50% { opacity: ${visualConfig.intensity * 0.2}; }
          100% { opacity: ${visualConfig.intensity * 0.1}; }
        }
      `;
      document.head.appendChild(styleSheet);
    }
    
    // Dispatch event for other components to react to
    const visualEvent = new CustomEvent('synestheticVisualFeedback', {
      detail: {
        config: visualConfig,
        emotion: this.currentEmotion,
        intensity: this.currentIntensity
      }
    });
    
    document.dispatchEvent(visualEvent);
  }
  
  /**
   * Apply haptic feedback
   * @param {Object} hapticConfig - Haptic configuration
   */
  applyHapticFeedback(hapticConfig) {
    if (!hapticConfig || typeof navigator === 'undefined') return;
    
    // Check if vibration API is available
    if (!navigator.vibrate) {
      console.warn('Vibration API not supported in this browser');
      return;
    }
    
    // Create vibration pattern based on configuration
    let pattern;
    switch (hapticConfig.pattern) {
      case 'slow_pulse':
        pattern = [100, 100, 100, 100, 100];
        break;
      case 'double_tap':
        pattern = [50, 50, 50];
        break;
      case 'sharp_vibration':
        pattern = [100, 50, 100, 50, 100];
        break;
      case 'irregular_pulse':
        pattern = [50, 100, 75, 50, 150];
        break;
      case 'quick_double':
        pattern = [30, 30, 30];
        break;
      case 'gentle_wave':
        pattern = [200, 100, 200, 100, 200];
        break;
      case 'single_tap':
      default:
        pattern = [50];
    }
    
    // Scale pattern based on intensity
    pattern = pattern.map(duration => Math.round(duration * hapticConfig.duration));
    
    // Apply vibration
    try {
      navigator.vibrate(pattern);
      console.log(`📳 Applying haptic feedback: ${hapticConfig.pattern} (Intensity: ${hapticConfig.intensity.toFixed(2)})`);
    } catch (error) {
      console.warn('Error applying haptic feedback:', error);
    }
    
    // Dispatch event for other components to react to
    const hapticEvent = new CustomEvent('synestheticHapticFeedback', {
      detail: {
        config: hapticConfig,
        emotion: this.currentEmotion,
        intensity: this.currentIntensity,
        pattern
      }
    });
    
    document.dispatchEvent(hapticEvent);
  }
  
  /**
   * Apply voice feedback
   * @param {Object} voiceConfig - Voice configuration
   */
  applyVoiceFeedback(voiceConfig) {
    if (!voiceConfig) return;
    
    // In a real implementation, this would adjust the voice synthesis parameters
    console.log(`🗣️ Applying voice feedback: ${voiceConfig.tone} (Speed: ${voiceConfig.speed.toFixed(2)}, Pitch: ${voiceConfig.pitch.toFixed(2)})`);
    
    // Dispatch event for other components to react to
    const voiceEvent = new CustomEvent('synestheticVoiceFeedback', {
      detail: {
        config: voiceConfig,
        emotion: this.currentEmotion,
        intensity: this.currentIntensity
      }
    });
    
    document.dispatchEvent(voiceEvent);
  }
  
  /**
   * Apply accessibility adaptations
   * @param {Object} mapping - The current mapping
   */
  applyAccessibilityAdaptations(mapping) {
    if (typeof document === 'undefined') return;
    
    // Create or update accessibility indicator
    let indicator = document.getElementById('accessibility-emotion-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'accessibility-emotion-indicator';
      indicator.style.position = 'fixed';
      indicator.style.bottom = '20px';
      indicator.style.left = '20px';
      indicator.style.padding = '10px 15px';
      indicator.style.borderRadius = '5px';
      indicator.style.color = '#f8f8f2';
      indicator.style.fontWeight = 'bold';
      indicator.style.zIndex = '1001';
      document.body.appendChild(indicator);
    }
    
    // Set indicator properties based on emotion
    indicator.style.backgroundColor = mapping.visual.colors[0];
    indicator.textContent = `${this.currentEmotion.toUpperCase()} (${Math.round(this.currentIntensity * 100)}%)`;
    
    // Add touch-based cues for hearing-impaired users
    if (mapping.haptic && this.hapticEnabled) {
      // Enhanced haptic feedback for accessibility mode
      const enhancedPattern = Array(3).fill().flatMap(() => [
        Math.round(100 * mapping.haptic.duration),
        Math.round(50 * mapping.haptic.duration)
      ]);
      
      try {
        navigator.vibrate(enhancedPattern);
      } catch (error) {
        console.warn('Error applying accessibility haptic feedback:', error);
      }
    }
  }
  
  /**
   * Get voice parameters for speech synthesis
   * @returns {Object} - Voice parameters
   */
  getVoiceParameters() {
    const mapping = this.getCurrentMapping();
    if (!mapping.voice) return { pitch: 1, rate: 1 };
    
    return {
      pitch: mapping.voice.pitch,
      rate: mapping.voice.speed
    };
  }
}

// Create singleton instance
const synestheticFeedback = new SynestheticFeedback();

export default synestheticFeedback;