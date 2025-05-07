/**
 * Mashaaer Enhanced Project
 * Cosmic Voice Integration Module
 *
 * This module provides integration between the voice system and the cosmic nebula effect.
 * It handles events related to missing nodes and updates the visual effects accordingly.
 */

import { getMissingNodes } from '../utils/memory-engine.js';

/**
 * Initialize the cosmic voice integration
 */
export function initializeCosmicVoiceIntegration() {
  if (typeof window === 'undefined' || !window.mashaaer || !window.mashaaer.events) {
    console.warn('Cannot initialize cosmic voice integration: mashaaer.events not available');
    return;
  }

  // Listen for NODE_NOT_FOUND events
  window.mashaaer.events.on("NODE_NOT_FOUND", function(event) {
    const { id, message, emotion, intensity, failureCount, hasSimilarMemory } = event.detail || event;

    // Update the cosmic nebula effect to reflect the missing node
    if (typeof window.CosmicNebulaEffect !== 'undefined') {
      // Determine the visual effect based on the event data
      const missingNodesCount = getMissingNodes().length;

      if (hasSimilarMemory) {
        // False memory effect - slightly distorted but recognizable
        window.CosmicNebulaEffect.updateEmotion(emotion, 0.4, "false-memory");
      } else if (failureCount > 3) {
        // Glitch effect for repeated failures
        window.CosmicNebulaEffect.updateEmotion(emotion, intensity || 0.7, "glitch");
      } else {
        // Standard missing node effect - faded nebula
        const fadeIntensity = Math.min(0.2 + (missingNodesCount * 0.05), 0.8);
        window.CosmicNebulaEffect.updateEmotion(emotion || "حياد", fadeIntensity, "fade");
      }

      // Add lost nodes trail if there are multiple missing nodes
      if (missingNodesCount > 3) {
        createLostNodesTrail(missingNodesCount);
      }
    }

    // Display a temporary overlay with the message if the function is available
    if (typeof window.showTemporaryOverlay === 'function') {
      window.showTemporaryOverlay(message, emotion || "neutral");
    }

    // Add a "Recover Lost Memory" button if there are many missing nodes
    if (getMissingNodes().length > 5 && !document.getElementById('recover-memory-button')) {
      createRecoverMemoryButton();
    }

    console.warn("⚠️ تم تشغيل استجابة بصرية لعدم العثور على node:", id);
  });

  // Listen for ACTIVATE_FOCUS_MODE events
  window.mashaaer.events.on("ACTIVATE_FOCUS_MODE", function(event) {
    const { level } = event.detail || event;

    // Visual effect for focus mode
    if (typeof window.CosmicNebulaEffect !== 'undefined') {
      window.CosmicNebulaEffect.updateEmotion("تركيز", 0.8, "focus");
    }

    console.log(`🧠 تم تفعيل وضع التركيز: ${level}`);
  });

  console.log('✅ Cosmic voice integration initialized');
}

/**
 * Create a visual trail of lost nodes in the conversation map
 * @param {number} count - Number of missing nodes
 */
function createLostNodesTrail(count) {
  // Create or update the lost nodes trail element
  let trailElement = document.getElementById('lost-nodes-trail');

  if (!trailElement) {
    trailElement = document.createElement('div');
    trailElement.id = 'lost-nodes-trail';
    trailElement.className = 'lost-nodes-trail';
    document.body.appendChild(trailElement);

    // Add styles for the trail
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .lost-nodes-trail {
        position: fixed;
        bottom: 20%;
        right: 10%;
        width: 200px;
        height: 100px;
        background: radial-gradient(ellipse at center, rgba(169, 169, 169, 0.7) 0%, rgba(169, 169, 169, 0) 70%);
        pointer-events: none;
        z-index: 100;
        opacity: 0;
        transition: opacity 1s ease;
      }

      .lost-nodes-trail.visible {
        opacity: 1;
      }

      .lost-nodes-trail:before {
        content: attr(data-count);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 16px;
        text-shadow: 0 0 5px rgba(0,0,0,0.5);
      }
    `;
    document.head.appendChild(styleElement);
  }

  // Update the trail with the current count
  trailElement.setAttribute('data-count', `ذكريات مفقودة: ${count}`);
  trailElement.classList.add('visible');

  // Hide the trail after some time
  setTimeout(() => {
    trailElement.classList.remove('visible');
  }, 5000);
}

/**
 * Create a button to recover lost memories
 */
function createRecoverMemoryButton() {
  const button = document.createElement('button');
  button.id = 'recover-memory-button';
  button.className = 'cosmic-button recover-memory-button';
  button.textContent = 'استرجاع ذاكرة ضائعة 🌌';

  // Add styles for the button
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .recover-memory-button {
      position: fixed;
      bottom: 20px;
      right: 80px;
      background-color: rgba(147, 112, 219, 0.8);
      color: white;
      border: none;
      border-radius: 20px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      transition: all 0.3s ease;
    }

    .recover-memory-button:hover {
      background-color: rgba(147, 112, 219, 1);
      transform: scale(1.05);
    }
  `;
  document.head.appendChild(styleElement);

  // Add click handler
  button.addEventListener('click', () => {
    if (window.mashaaer && window.mashaaer.voice) {
      window.mashaaer.voice.speak("أحاول استرجاع الذكريات المفقودة... ساعدني بالتركيز معي.");
    }

    // Visual effect for memory recovery
    if (typeof window.CosmicNebulaEffect !== 'undefined') {
      window.CosmicNebulaEffect.updateEmotion("استرجاع", 1.0, "recovery");
    }

    // Remove the button after use
    setTimeout(() => {
      button.remove();
    }, 3000);
  });

  document.body.appendChild(button);
}

/**
 * Create the CosmicNebulaEffect object if it doesn't exist
 */
export function ensureCosmicNebulaEffect() {
  if (typeof window === 'undefined') return;

  if (typeof window.CosmicNebulaEffect === 'undefined') {
    window.CosmicNebulaEffect = {
      updateEmotion: function(emotion, intensity, effectType = '') {
        console.log(`CosmicNebulaEffect: Updating emotion to ${emotion} with intensity ${intensity}, effect: ${effectType}`);

        // Apply visual changes based on emotion and intensity
        const nebula = document.querySelector('.cosmic-nebula');
        if (nebula) {
          // Remove all previous effect classes
          nebula.classList.remove('effect-false-memory', 'effect-glitch', 'effect-fade', 'effect-focus', 'effect-recovery');

          // Update CSS variables based on emotion
          nebula.style.setProperty('--emotion-color', getEmotionColor(emotion));
          nebula.style.setProperty('--emotion-intensity', intensity);

          // Apply specific effect based on effectType
          switch (effectType) {
            case 'false-memory':
              nebula.classList.add('effect-false-memory');
              // Add distortion effect for false memories
              this.addDistortionEffect(nebula, 0.3);
              break;

            case 'glitch':
              nebula.classList.add('effect-glitch');
              // Add glitch animation for emotional glitches
              this.addGlitchEffect(nebula);
              break;

            case 'fade':
              nebula.classList.add('effect-fade');
              // Fade effect for standard missing nodes
              nebula.style.opacity = Math.max(0.3, 1 - intensity);
              break;

            case 'focus':
              nebula.classList.add('effect-focus');
              // Sharpen and intensify for focus mode
              this.addFocusEffect(nebula);
              break;

            case 'recovery':
              nebula.classList.add('effect-recovery');
              // Pulsating effect for memory recovery
              this.addRecoveryEffect(nebula);
              break;

            default:
              // Standard emotion transition
              break;
          }

          // Add a class to trigger animation
          nebula.classList.remove('emotion-transition');
          setTimeout(() => nebula.classList.add('emotion-transition'), 10);

          // Add CSS for the effects if not already present
          this.ensureEffectStyles();
        }
      },

      // Add distortion effect for false memories
      addDistortionEffect: function(element, amount) {
        element.style.filter = `blur(${amount}px) hue-rotate(15deg)`;
        setTimeout(() => {
          element.style.filter = '';
        }, 3000);
      },

      // Add glitch effect for emotional glitches
      addGlitchEffect: function(element) {
        // Create and apply a glitch animation
        const keyframes = [
          { transform: 'translateX(0)' },
          { transform: 'translateX(2px)', filter: 'hue-rotate(90deg)' },
          { transform: 'translateX(-2px)', filter: 'hue-rotate(-90deg)' },
          { transform: 'translateX(0)' }
        ];

        const animation = element.animate(keyframes, {
          duration: 500,
          iterations: 3
        });

        animation.onfinish = () => {
          element.style.transform = '';
          element.style.filter = '';
        };
      },

      // Add focus effect
      addFocusEffect: function(element) {
        element.style.filter = 'contrast(1.2) saturate(1.2)';
        element.style.transform = 'scale(1.05)';

        setTimeout(() => {
          element.style.filter = '';
          element.style.transform = '';
        }, 5000);
      },

      // Add recovery effect
      addRecoveryEffect: function(element) {
        // Create pulsating animation
        const keyframes = [
          { opacity: 0.7, transform: 'scale(0.95)' },
          { opacity: 1, transform: 'scale(1.05)' },
          { opacity: 0.7, transform: 'scale(0.95)' }
        ];

        const animation = element.animate(keyframes, {
          duration: 2000,
          iterations: 3
        });

        animation.onfinish = () => {
          element.style.opacity = '';
          element.style.transform = '';
        };
      },

      // Ensure CSS styles for effects are added to the document
      ensureEffectStyles: function() {
        if (document.getElementById('cosmic-effect-styles')) return;

        const styleElement = document.createElement('style');
        styleElement.id = 'cosmic-effect-styles';
        styleElement.textContent = `
          .cosmic-nebula {
            transition: all 0.5s ease;
          }

          .cosmic-nebula.effect-false-memory {
            animation: false-memory-pulse 4s infinite alternate;
          }

          .cosmic-nebula.effect-glitch {
            animation: glitch-effect 0.3s steps(1) 3;
          }

          .cosmic-nebula.effect-fade {
            transition: opacity 1s ease;
          }

          .cosmic-nebula.effect-focus {
            animation: focus-pulse 2s ease;
          }

          .cosmic-nebula.effect-recovery {
            animation: recovery-pulse 1s ease infinite;
          }

          @keyframes false-memory-pulse {
            0% { filter: blur(0px); }
            50% { filter: blur(1px); }
            100% { filter: blur(0px); }
          }

          @keyframes glitch-effect {
            0% { transform: translateX(0); }
            25% { transform: translateX(2px); filter: hue-rotate(90deg); }
            50% { transform: translateX(-2px); filter: hue-rotate(-90deg); }
            75% { transform: translateX(1px); filter: invert(10%); }
            100% { transform: translateX(0); }
          }

          @keyframes focus-pulse {
            0% { filter: contrast(1) saturate(1); }
            50% { filter: contrast(1.3) saturate(1.3); }
            100% { filter: contrast(1) saturate(1); }
          }

          @keyframes recovery-pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        `;

        document.head.appendChild(styleElement);
      }
    };
  }
}

/**
 * Get a color based on the emotion
 * @param {string} emotion - The emotion name
 * @returns {string} - A CSS color value
 */
function getEmotionColor(emotion) {
  const emotionColors = {
    // Basic emotions
    'سعادة': '#FFD700',    // Gold
    'حزن': '#4682B4',      // Steel Blue
    'غضب': '#FF4500',      // Orange Red
    'خوف': '#800080',      // Purple
    'مفاجأة': '#00FFFF',   // Cyan
    'حياد': '#A9A9A9',     // Dark Gray

    // Memory-related states
    'تركيز': '#9370DB',    // Medium Purple
    'استرجاع': '#7FFFD4',  // Aquamarine
    'confused': '#D8BFD8',  // Thistle

    // Additional emotional states
    'قلق': '#6A5ACD',      // Slate Blue
    'ارتباك': '#DDA0DD',   // Plum
    'اعتذار': '#B0C4DE',   // Light Steel Blue
    'شك': '#778899'        // Light Slate Gray
  };

  return emotionColors[emotion] || emotionColors['حياد'];
}

// Initialize when the module is loaded
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    ensureCosmicNebulaEffect();
    initializeCosmicVoiceIntegration();
  });
}
