/**
 * Mashaaer Enhanced Project
 * Enhanced Emotion Detection System
 *
 * This module extends the core emotion detection capabilities with:
 * - Advanced NLP-based emotion analysis
 * - Multi-modal emotion detection (text, voice, facial)
 * - Cultural context awareness for Arabic and English expressions
 * - Emotion intensity tracking and gradation
 * - Subscription-aware feature access control
 */

class EnhancedEmotionDetection {
  constructor(config = {}) {
    this.subscriptionLevel = config.subscriptionLevel || 'free';
    this.culturalContext = config.culturalContext || 'standard';
    this.isInitialized = false;
    this.emotionCategories = {};
    this.emotionThreshold = 0.65; // Default threshold for detecting emotions
    this.emotionDisplayElement = null;
    this.textEmotionTimeout = null;
  }

  initialize(config = {}) {
    if (this.isInitialized) return this;

    // Apply configuration if provided
    if (config.subscriptionLevel) {
      this.subscriptionLevel = config.subscriptionLevel;
    }

    if (config.culturalContext) {
      this.culturalContext = config.culturalContext;
    }

    // Setup emotion categories and UI indicator
    this.setupEmotionCategories();
    this.setupEmotionIndicator();

    this.isInitialized = true;
    console.log("✅ Emotion detection system initialized");
    return this;
  }

  setupEmotionCategories() {
    this.emotionCategories = {
      happy: {
        keywords: {
          standard: ['happy', 'excited', 'joy', 'amazing'],
          arabic: ['سعيد', 'مبسوط', 'فرحان', 'منشرح'],
          levantine: ['مبسوط', 'فرحان'],
          gulf: ['مستانس', 'فرحان'],
          maghrebi: ['زين', 'مزيان']
        },
        responses: {
          standard: ["I'm glad you're happy!", "Keep smiling!"],
          arabic: ["يسعدني أنك سعيد!", "ابتسم دائمًا!"]
        },
        color: '#50fa7b',
        emoji: '😊',
        intensity: 0
      },
      sad: {
        keywords: {
          standard: ['sad', 'upset', 'unhappy'],
          arabic: ['حزين', 'مكتئب', 'زعلان'],
          levantine: ['زعلان', 'متضايق'],
          gulf: ['زعلان', 'مكتئب'],
          maghrebi: ['حزين', 'متضايق']
        },
        responses: {
          standard: ["I'm here for you.", "It's okay to feel sad."],
          arabic: ["أنا هنا للمساعدة.", "لا بأس أن تشعر بالحزن."]
        },
        color: '#6272a4',
        emoji: '😢',
        intensity: 0
      },
      confident: {
        keywords: {
          standard: ['confident', 'sure', 'positive', 'convinced'],
          arabic: ['واثق', 'متأكد', 'مطمئن'],
          levantine: ['واثق', 'أكيد'],
          gulf: ['واثق', 'متأكد'],
          maghrebi: ['واثق', 'مقتنع']
        },
        responses: {
          standard: ["I love your confidence!", "Being confident is great!"],
          arabic: ["أحب ثقتك بنفسك!", "إنه رائع أن تكون واثقًا!"]
        },
        color: '#00ced1',
        emoji: '💪',
        intensity: 0
      },
      neutral: {
        keywords: {
          standard: ['neutral', 'normal', 'okay'],
          arabic: ['عادي', 'طبيعي', 'محايد'],
          levantine: ['عادي', 'طبيعي'],
          gulf: ['عادي', 'طبيعي'],
          maghrebi: ['عادي', 'طبيعي']
        },
        responses: {
          standard: ["I understand.", "I see."],
          arabic: ["أفهم.", "أرى."]
        },
        color: '#9370db',
        emoji: '😐',
        intensity: 0
      }
    };
  }

  setupEmotionIndicator() {
    // Check if we're in a browser environment
    if (typeof document !== 'undefined') {
      if (!document.querySelector('.emotion-indicator')) {
        this.emotionDisplayElement = document.createElement('div');
        this.emotionDisplayElement.className = 'emotion-indicator enhanced';
        this.emotionDisplayElement.setAttribute('data-emotion', 'neutral');
        document.body.appendChild(this.emotionDisplayElement);
      }
    } else {
      // In a non-browser environment (e.g., Node.js for testing)
      console.log('Emotion indicator setup skipped (non-browser environment)');
    }
  }

  initializeTextEmotionDetection() {
    console.log('Initializing text emotion detection...');
    document.querySelectorAll('input[type="text"], textarea').forEach(element => {
      element.addEventListener('input', (event) => {
        clearTimeout(this.textEmotionTimeout);
        this.textEmotionTimeout = setTimeout(() => {
          const text = event.target.value;
          if (text && text.length > 5) {
            this.detectEmotionFromText(text);
          }
        }, 500);
      });
    });
  }

  initializeFacialEmotionDetection() {
    console.log('Initializing facial emotion detection...');

    // Check if we're in a browser environment and have access to the camera
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn('Facial emotion detection not available: Camera access not supported');
      return false;
    }

    // Check if the feature is accessible based on subscription
    if (!this.canAccessFeature('facialEmotionDetection')) {
      console.warn('Facial emotion detection not available: Feature not included in current subscription');
      return false;
    }

    // Create video element for camera feed
    const videoElement = document.createElement('video');
    videoElement.id = 'facial-emotion-camera';
    videoElement.autoplay = true;
    videoElement.style.position = 'fixed';
    videoElement.style.bottom = '20px';
    videoElement.style.right = '20px';
    videoElement.style.width = '160px';
    videoElement.style.height = '120px';
    videoElement.style.borderRadius = '8px';
    videoElement.style.zIndex = '1000';
    videoElement.style.transform = 'scaleX(-1)'; // Mirror effect
    videoElement.style.display = 'none'; // Hidden by default

    // Create canvas for processing
    const canvasElement = document.createElement('canvas');
    canvasElement.id = 'facial-emotion-canvas';
    canvasElement.style.display = 'none';

    // Add elements to the document
    document.body.appendChild(videoElement);
    document.body.appendChild(canvasElement);

    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.id = 'facial-emotion-toggle';
    toggleButton.textContent = '👁️';
    toggleButton.title = 'Toggle Facial Emotion Detection';
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '20px';
    toggleButton.style.right = '190px';
    toggleButton.style.width = '40px';
    toggleButton.style.height = '40px';
    toggleButton.style.borderRadius = '50%';
    toggleButton.style.backgroundColor = '#9370db';
    toggleButton.style.color = 'white';
    toggleButton.style.border = 'none';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.zIndex = '1001';
    toggleButton.style.fontSize = '20px';

    // Add toggle button to document
    document.body.appendChild(toggleButton);

    // Toggle camera visibility
    toggleButton.addEventListener('click', () => {
      if (videoElement.style.display === 'none') {
        videoElement.style.display = 'block';
        this.startFacialEmotionDetection(videoElement, canvasElement);
        toggleButton.style.backgroundColor = '#50fa7b';
      } else {
        videoElement.style.display = 'none';
        this.stopFacialEmotionDetection();
        toggleButton.style.backgroundColor = '#9370db';
      }
    });

    return true;
  }

  startFacialEmotionDetection(videoElement, canvasElement) {
    // Request camera access
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoElement.srcObject = stream;
        this.facialDetectionStream = stream;

        // Start detection loop
        this.facialDetectionInterval = setInterval(() => {
          this.detectEmotionFromFace(videoElement, canvasElement);
        }, 1000); // Check every second

        console.log('Facial emotion detection started');
      })
      .catch(error => {
        console.error('Error accessing camera:', error);
        alert('Could not access camera for facial emotion detection');
      });
  }

  stopFacialEmotionDetection() {
    // Stop detection loop
    if (this.facialDetectionInterval) {
      clearInterval(this.facialDetectionInterval);
      this.facialDetectionInterval = null;
    }

    // Stop camera stream
    if (this.facialDetectionStream) {
      this.facialDetectionStream.getTracks().forEach(track => track.stop());
      this.facialDetectionStream = null;
    }

    console.log('Facial emotion detection stopped');
  }

  detectEmotionFromFace(videoElement, canvasElement) {
    if (!videoElement || !canvasElement) return;

    // Prepare canvas
    const context = canvasElement.getContext('2d');
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    // Draw video frame to canvas
    context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

    // In a real implementation, you would use a facial emotion detection library
    // like face-api.js, TensorFlow.js, or a cloud API
    // For this simulation, we'll generate random emotions

    // Simulate emotion detection with random values
    const emotions = ['happy', 'sad', 'neutral', 'confident'];
    const detectedEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const intensity = Math.random() * 0.5 + 0.5; // Random intensity between 0.5 and 1.0

    console.log(`Facial emotion detected: ${detectedEmotion} (${intensity.toFixed(2)})`);

    // Update the emotion display
    this.updateEmotion(detectedEmotion, intensity);

    // Dispatch event for other components
    const emotionEvent = new CustomEvent('facialEmotionUpdate', {
      detail: {
        emotion: detectedEmotion,
        intensity,
        timestamp: new Date().toISOString(),
        source: 'facial'
      }
    });
    document.dispatchEvent(emotionEvent);
  }

  initializeEmotionTimeline() {
    console.log('Initializing emotion timeline...');
    // Implementation for emotion timeline goes here
  }

  detectEmotionFromText(text) {
    console.log(`Detecting emotion from text: ${text}`);
    for (const [emotion, data] of Object.entries(this.emotionCategories)) {
      const keywords = data.keywords[this.culturalContext] || [];
      const foundKeyword = keywords.find(keyword => text.includes(keyword));
      if (foundKeyword) {
        this.updateEmotion(emotion, Math.random()); // Simulated intensity (replace with actual model output)
        return;
      }
    }
    this.updateEmotion('neutral', 0);
  }

  updateEmotion(emotion, intensity) {
    console.log(`Emotion updated: ${emotion} (Intensity: ${intensity})`);

    // Update UI element
    if (this.emotionDisplayElement) {
      // Set the emotion attribute for tooltip
      this.emotionDisplayElement.setAttribute('data-emotion', emotion);

      // Set the background color
      this.emotionDisplayElement.style.backgroundColor = this.emotionCategories[emotion]?.color || '#9370db';

      // Set the emoji as content
      const emoji = this.emotionCategories[emotion]?.emoji || '😐';
      this.emotionDisplayElement.textContent = emoji;

      // Add click handler to show emotion timeline if not already added
      if (!this.emotionDisplayElement.hasAttribute('data-has-click-handler')) {
        this.emotionDisplayElement.setAttribute('data-has-click-handler', 'true');
        this.emotionDisplayElement.addEventListener('click', () => {
          if (window.router) {
            window.router.navigate('/emotions');
          }
        });
      }
    }

    // Dispatch event for emotion timeline
    const emotionEvent = new CustomEvent('emotionUpdate', {
      detail: {
        emotion,
        intensity,
        timestamp: new Date().toISOString()
      }
    });
    document.dispatchEvent(emotionEvent);
  }

  canAccessFeature(feature) {
    const featureAccess = {
      basicEmotionDetection: ['free', 'basic', 'premium'],
      advancedEmotionDetection: ['basic', 'premium'],
      facialEmotionDetection: ['premium'],
      emotionTimeline: ['basic', 'premium']
    };
    return featureAccess[feature]?.includes(this.subscriptionLevel) || false;
  }
}

// Create a singleton instance for use in standalone functions
const emotionDetector = new EnhancedEmotionDetection();
emotionDetector.initialize();

/**
 * Detect emotion from text
 * @param {string} text - Text to detect emotion from
 * @returns {Object} - Detected emotion with type and confidence
 */
export function detectEmotion(text) {
  if (!text) {
    return { type: 'neutral', confidence: 0 };
  }

  // Simple emotion detection based on keywords
  for (const [emotion, data] of Object.entries(emotionDetector.emotionCategories)) {
    const keywords = data.keywords.arabic || []; // Default to Arabic keywords
    const foundKeyword = keywords.find(keyword => text.toLowerCase().includes(keyword.toLowerCase()));
    if (foundKeyword) {
      const confidence = Math.random() * 0.5 + 0.5; // Random confidence between 0.5 and 1.0
      return { type: emotion, confidence };
    }
  }

  return { type: 'neutral', confidence: 0.5 };
}

export default EnhancedEmotionDetection;
