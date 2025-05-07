/**
 * Mashaaer Enhanced Project
 * Comprehensive Test Suite
 * 
 * This file contains tests for all enhanced components:
 * - Emotion detection and timeline
 * - Voice personality
 * - Integration modules (PayPal, WhatsApp, Telegram)
 * - Cosmic UI theme
 * - Smart personal assistant
 */

// Test configuration
const config = {
  runAllTests: true,
  verbose: true,
  stopOnFailure: false,
  testTimeout: 5000, // 5 seconds
  components: {
    emotion: true,
    voice: true,
    integration: true,
    ui: true,
    assistant: true
  }
};

// Test results tracking
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  startTime: null,
  endTime: null,
  failedTests: []
};

// Test utilities
const TestUtils = {
  // Assert functions
  assert: {
    isTrue: (value, message) => {
      if (value !== true) {
        throw new Error(message || `Expected true but got ${value}`);
      }
    },
    isFalse: (value, message) => {
      if (value !== false) {
        throw new Error(message || `Expected false but got ${value}`);
      }
    },
    equal: (actual, expected, message) => {
      if (actual !== expected) {
        throw new Error(message || `Expected ${expected} but got ${actual}`);
      }
    },
    notEqual: (actual, expected, message) => {
      if (actual === expected) {
        throw new Error(message || `Expected value to not equal ${expected}`);
      }
    },
    deepEqual: (actual, expected, message) => {
      const actualStr = JSON.stringify(actual);
      const expectedStr = JSON.stringify(expected);
      if (actualStr !== expectedStr) {
        throw new Error(message || `Expected ${expectedStr} but got ${actualStr}`);
      }
    },
    includes: (collection, item, message) => {
      if (Array.isArray(collection)) {
        if (!collection.includes(item)) {
          throw new Error(message || `Expected array to include ${item}`);
        }
      } else if (typeof collection === 'string') {
        if (!collection.includes(item)) {
          throw new Error(message || `Expected string to include ${item}`);
        }
      } else {
        throw new Error('Collection must be an array or string');
      }
    },
    throws: (fn, errorType, message) => {
      try {
        fn();
        throw new Error(message || 'Expected function to throw an error');
      } catch (error) {
        if (errorType && !(error instanceof errorType)) {
          throw new Error(message || `Expected error of type ${errorType.name}`);
        }
      }
    },
    doesNotThrow: (fn, message) => {
      try {
        fn();
      } catch (error) {
        throw new Error(message || `Expected function not to throw but got ${error.message}`);
      }
    }
  },

  // Mock functions
  mock: {
    // Create a mock function
    fn: () => {
      const mockFn = (...args) => {
        mockFn.calls.push(args);
        return mockFn.returnValue;
      };

      mockFn.calls = [];
      mockFn.returnValue = undefined;

      mockFn.mockReturnValue = (value) => {
        mockFn.returnValue = value;
        return mockFn;
      };

      mockFn.mockImplementation = (implementation) => {
        const originalMockFn = mockFn;
        const newMockFn = (...args) => {
          newMockFn.calls.push(args);
          return implementation(...args);
        };

        newMockFn.calls = originalMockFn.calls;
        newMockFn.mockReturnValue = originalMockFn.mockReturnValue;
        newMockFn.mockImplementation = originalMockFn.mockImplementation;

        return newMockFn;
      };

      return mockFn;
    },

    // Create a mock event
    event: (type, detail = {}) => {
      return new CustomEvent(type, { detail });
    },

    // Create a mock element
    element: (tagName = 'div', attributes = {}, children = []) => {
      const element = document.createElement(tagName);

      // Set attributes
      Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
          element.className = value;
        } else if (key === 'innerHTML') {
          element.innerHTML = value;
        } else {
          element.setAttribute(key, value);
        }
      });

      // Add children
      children.forEach(child => {
        if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child));
        } else {
          element.appendChild(child);
        }
      });

      return element;
    },

    // Create a mock storage
    storage: () => {
      const store = {};

      return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = String(value); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { Object.keys(store).forEach(key => delete store[key]); },
        key: (index) => Object.keys(store)[index] || null,
        get length() { return Object.keys(store).length; }
      };
    },

    // Create a mock window
    window: () => {
      return {
        localStorage: TestUtils.mock.storage(),
        sessionStorage: TestUtils.mock.storage(),
        location: {
          href: 'https://example.com',
          pathname: '/',
          search: '',
          hash: ''
        },
        navigator: {
          language: 'en-US',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        document: {
          createElement: TestUtils.mock.fn().mockImplementation((tagName) => TestUtils.mock.element(tagName)),
          querySelector: TestUtils.mock.fn().mockReturnValue(null),
          querySelectorAll: TestUtils.mock.fn().mockReturnValue([]),
          getElementById: TestUtils.mock.fn().mockReturnValue(null),
          body: TestUtils.mock.element('body')
        },
        addEventListener: TestUtils.mock.fn(),
        removeEventListener: TestUtils.mock.fn(),
        setTimeout: TestUtils.mock.fn().mockImplementation((callback, delay) => {
          callback();
          return 1;
        }),
        clearTimeout: TestUtils.mock.fn()
      };
    }
  },

  // DOM utilities
  dom: {
    // Create a test container
    createTestContainer: () => {
      const container = document.createElement('div');
      container.id = 'test-container';
      document.body.appendChild(container);
      return container;
    },

    // Remove test container
    removeTestContainer: () => {
      const container = document.getElementById('test-container');
      if (container) {
        container.remove();
      }
    },

    // Trigger event
    triggerEvent: (element, eventType, detail = {}) => {
      const event = new CustomEvent(eventType, { detail, bubbles: true });
      element.dispatchEvent(event);
    },

    // Wait for element
    waitForElement: (selector, timeout = 1000) => {
      return new Promise((resolve, reject) => {
        const startTime = Date.now();

        const checkElement = () => {
          const element = document.querySelector(selector);

          if (element) {
            resolve(element);
          } else if (Date.now() - startTime >= timeout) {
            reject(new Error(`Timeout waiting for element: ${selector}`));
          } else {
            setTimeout(checkElement, 100);
          }
        };

        checkElement();
      });
    }
  },

  // Async utilities
  async: {
    // Wait for a specified time
    wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    // Wait for a condition to be true
    waitFor: (condition, timeout = 1000, interval = 100) => {
      return new Promise((resolve, reject) => {
        const startTime = Date.now();

        const checkCondition = () => {
          const result = condition();

          if (result) {
            resolve(result);
          } else if (Date.now() - startTime >= timeout) {
            reject(new Error('Timeout waiting for condition'));
          } else {
            setTimeout(checkCondition, interval);
          }
        };

        checkCondition();
      });
    }
  }
};

// Test runner
class TestRunner {
  constructor(config) {
    this.config = config;
    this.tests = [];
  }

  // Add a test
  addTest(name, testFn, category) {
    this.tests.push({ name, testFn, category });
  }

  // Run all tests
  async runTests() {
    testResults.startTime = new Date();
    testResults.total = this.tests.length;

    console.log(`Running ${testResults.total} tests...`);

    for (const test of this.tests) {
      // Skip test if category is disabled
      if (this.config.components && !this.config.components[test.category]) {
        testResults.skipped++;
        if (this.config.verbose) {
          console.log(`SKIPPED: ${test.name} (${test.category})`);
        }
        continue;
      }

      try {
        // Run test with timeout
        await Promise.race([
          test.testFn(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Test timeout')), this.config.testTimeout)
          )
        ]);

        testResults.passed++;
        if (this.config.verbose) {
          console.log(`PASSED: ${test.name}`);
        }
      } catch (error) {
        testResults.failed++;
        testResults.failedTests.push({
          name: test.name,
          category: test.category,
          error: error.message
        });

        console.error(`FAILED: ${test.name}`);
        console.error(`  Error: ${error.message}`);

        if (this.config.stopOnFailure) {
          break;
        }
      }
    }

    testResults.endTime = new Date();
    this.printResults();
  }

  // Print test results
  printResults() {
    const duration = (testResults.endTime - testResults.startTime) / 1000;

    console.log('\n----- TEST RESULTS -----');
    console.log(`Total: ${testResults.total}`);
    console.log(`Passed: ${testResults.passed}`);
    console.log(`Failed: ${testResults.failed}`);
    console.log(`Skipped: ${testResults.skipped}`);
    console.log(`Duration: ${duration.toFixed(2)}s`);

    if (testResults.failed > 0) {
      console.log('\n----- FAILED TESTS -----');
      testResults.failedTests.forEach((test, index) => {
        console.log(`${index + 1}. ${test.name} (${test.category})`);
        console.log(`   Error: ${test.error}`);
      });
    }

    console.log('\n------------------------');
  }
}

// Create test runner
const runner = new TestRunner(config);

// Enhanced Emotion Detection Tests
runner.addTest('Emotion Detection - Initialization', async () => {
  // Import module
  const { EnhancedEmotionDetection } = require('../src/emotion/enhanced-emotion-detection.js');

  // Create instance
  const emotionDetection = new EnhancedEmotionDetection();

  // Test initialization
  emotionDetection.initialize();

  // Verify initialization
  TestUtils.assert.isTrue(emotionDetection.isInitialized, 'Should be initialized');
  TestUtils.assert.equal(emotionDetection.config.defaultLanguage, 'ar', 'Default language should be Arabic');
}, 'emotion');

runner.addTest('Emotion Detection - Dialect Support', async () => {
  // Import module
  const { EnhancedEmotionDetection } = require('../src/emotion/enhanced-emotion-detection.js');

  // Create instance
  const emotionDetection = new EnhancedEmotionDetection();
  emotionDetection.initialize();

  // Test dialect support
  const dialectResult = emotionDetection.setDialect('levantine');

  // Verify dialect support
  TestUtils.assert.isTrue(dialectResult, 'Should return true for valid dialect');
  TestUtils.assert.equal(emotionDetection.currentDialect, 'levantine', 'Current dialect should be updated');
}, 'emotion');

runner.addTest('Emotion Detection - Cultural Context', async () => {
  // Import module
  const { EnhancedEmotionDetection } = require('../src/emotion/enhanced-emotion-detection.js');

  // Create instance
  const emotionDetection = new EnhancedEmotionDetection();
  emotionDetection.initialize();

  // Test cultural context
  const contextResult = emotionDetection.setCulturalContext('gulf');

  // Verify cultural context
  TestUtils.assert.isTrue(contextResult, 'Should return true for valid cultural context');
  TestUtils.assert.equal(emotionDetection.culturalContext, 'gulf', 'Cultural context should be updated');
}, 'emotion');

runner.addTest('Emotion Detection - Text Analysis', async () => {
  // Import module
  const { EnhancedEmotionDetection } = require('../src/emotion/enhanced-emotion-detection.js');

  // Create instance
  const emotionDetection = new EnhancedEmotionDetection();
  emotionDetection.initialize();

  // Test text analysis
  const result = emotionDetection.analyzeText('أنا سعيد جداً اليوم!');

  // Verify text analysis
  TestUtils.assert.equal(typeof result, 'object', 'Should return an object');
  TestUtils.assert.equal(typeof result.emotion, 'string', 'Should include emotion string');
  TestUtils.assert.equal(typeof result.intensity, 'number', 'Should include intensity number');
  TestUtils.assert.isTrue(result.intensity >= 0 && result.intensity <= 1, 'Intensity should be between 0 and 1');
}, 'emotion');

// Emotion Timeline Tests
runner.addTest('Emotion Timeline - Initialization', async () => {
  // Import module
  const { EmotionTimeline } = require('../src/emotion/emotion-timeline.js');

  // Create instance
  const emotionTimeline = new EmotionTimeline();

  // Test initialization
  emotionTimeline.initialize();

  // Verify initialization
  TestUtils.assert.isTrue(emotionTimeline.isInitialized, 'Should be initialized');
  TestUtils.assert.equal(typeof emotionTimeline.emotions, 'object', 'Should have emotions object');
  TestUtils.assert.equal(emotionTimeline.emotions.length, 0, 'Should start with empty emotions array');
}, 'emotion');

runner.addTest('Emotion Timeline - Adding Emotions', async () => {
  // Import module
  const { EmotionTimeline } = require('../src/emotion/emotion-timeline.js');

  // Create instance
  const emotionTimeline = new EmotionTimeline();
  emotionTimeline.initialize();

  // Test adding emotions
  emotionTimeline.addEmotion('happy', 0.8);
  emotionTimeline.addEmotion('sad', 0.5);

  // Verify emotions were added
  TestUtils.assert.equal(emotionTimeline.emotions.length, 2, 'Should have 2 emotions');
  TestUtils.assert.equal(emotionTimeline.emotions[0].emotion, 'happy', 'First emotion should be happy');
  TestUtils.assert.equal(emotionTimeline.emotions[0].intensity, 0.8, 'First emotion intensity should be 0.8');
  TestUtils.assert.equal(emotionTimeline.emotions[1].emotion, 'sad', 'Second emotion should be sad');
}, 'emotion');

runner.addTest('Emotion Timeline - Getting Dominant Emotion', async () => {
  // Import module
  const { EmotionTimeline } = require('../src/emotion/emotion-timeline.js');

  // Create instance
  const emotionTimeline = new EmotionTimeline();
  emotionTimeline.initialize();

  // Add emotions
  emotionTimeline.addEmotion('happy', 0.8);
  emotionTimeline.addEmotion('sad', 0.5);
  emotionTimeline.addEmotion('happy', 0.6);

  // Test getting dominant emotion
  const dominant = emotionTimeline.getDominantEmotion();

  // Verify dominant emotion
  TestUtils.assert.equal(dominant.emotion, 'happy', 'Dominant emotion should be happy');
  TestUtils.assert.isTrue(dominant.intensity > 0.5, 'Dominant intensity should be greater than 0.5');
}, 'emotion');

// Voice Personality Tests
runner.addTest('Voice Personality - Initialization', async () => {
  // Import module
  const { VoicePersonality } = require('../src/voice/voice-personality.js');

  // Create instance
  const voicePersonality = new VoicePersonality();

  // Test initialization
  voicePersonality.initialize();

  // Verify initialization
  TestUtils.assert.isTrue(voicePersonality.isInitialized, 'Should be initialized');
  TestUtils.assert.equal(voicePersonality.settings.personality, 'cosmic', 'Default personality should be cosmic');
}, 'voice');

runner.addTest('Voice Personality - Dialect Traits', async () => {
  // Import module
  const { VoicePersonality } = require('../src/voice/voice-personality.js');

  // Create instance
  const voicePersonality = new VoicePersonality();
  voicePersonality.initialize();

  // Set subscription level to premium to access dialect features
  voicePersonality.setSubscriptionLevel('premium');

  // Test applying dialect traits
  voicePersonality.setCulturalContext('levantine');
  voicePersonality.applyDialectTraits('levantine');

  // Verify dialect traits
  TestUtils.assert.equal(voicePersonality.culturalContext, 'levantine', 'Cultural context should be levantine');
  TestUtils.assert.isTrue(Array.isArray(voicePersonality.settings.dialectResponsePatterns), 'Should have dialect response patterns');
}, 'voice');

runner.addTest('Voice Personality - Emotion Response', async () => {
  // Import module
  const { VoicePersonality } = require('../src/voice/voice-personality.js');

  // Create instance
  const voicePersonality = new VoicePersonality();
  voicePersonality.initialize();

  // Set subscription level to basic to access emotion features
  voicePersonality.setSubscriptionLevel('basic');

  // Enable emotion responsive setting
  voicePersonality.settings.emotionResponsive = true;

  // Test emotion response
  const mockEvent = { detail: { emotion: 'happy', intensity: 0.8 } };
  voicePersonality.handleEmotionUpdate(mockEvent);

  // Verify emotion response
  TestUtils.assert.isTrue(voicePersonality.settings.emotionResponsive, 'Emotion responsive should be enabled');
}, 'voice');

runner.addTest('Voice Personality - Response Processing', async () => {
  // Import module
  const { VoicePersonality } = require('../src/voice/voice-personality.js');

  // Create instance
  const voicePersonality = new VoicePersonality();
  voicePersonality.initialize();

  // Test response processing
  const baseResponse = 'This is a test response';
  const processedResponse = voicePersonality.processResponse(baseResponse);

  // Verify response processing
  TestUtils.assert.isTrue(typeof processedResponse === 'string', 'Should return a string');
  TestUtils.assert.isTrue(processedResponse.length > 0, 'Response should not be empty');
}, 'voice');

// PayPal Integration Tests
runner.addTest('PayPal Integration - Initialization', async () => {
  // Import module
  const { PayPalIntegration } = require('../src/integration/paypal-integration.js');

  // Create instance
  const paypalIntegration = new PayPalIntegration();

  // Test initialization
  paypalIntegration.initialize();

  // Verify initialization
  TestUtils.assert.isTrue(paypalIntegration.isInitialized, 'Should be initialized');
  TestUtils.assert.equal(paypalIntegration.config.currency, 'USD', 'Default currency should be USD');
}, 'integration');

runner.addTest('PayPal Integration - Subscription Plans', async () => {
  // Import module
  const { PayPalIntegration } = require('../src/integration/paypal-integration.js');

  // Create instance
  const paypalIntegration = new PayPalIntegration();
  paypalIntegration.initialize();

  // Test getting subscription plans
  const plans = paypalIntegration.getSubscriptionPlans();

  // Verify subscription plans
  TestUtils.assert.equal(typeof plans, 'object', 'Should return an object');
  TestUtils.assert.isTrue(Object.keys(plans).length > 0, 'Should have at least one plan');
  TestUtils.assert.isTrue(plans.basic !== undefined, 'Should have a basic plan');
  TestUtils.assert.isTrue(plans.premium !== undefined, 'Should have a premium plan');
}, 'integration');

runner.addTest('PayPal Integration - Get Plan By ID', async () => {
  // Import module
  const { PayPalIntegration } = require('../src/integration/paypal-integration.js');

  // Create instance
  const paypalIntegration = new PayPalIntegration();
  paypalIntegration.initialize();

  // Test getting plan by ID
  const basicPlan = paypalIntegration.getPlanById('basic');

  // Verify plan
  TestUtils.assert.equal(typeof basicPlan, 'object', 'Should return an object');
  TestUtils.assert.equal(basicPlan.name, 'Basic Plan', 'Should have correct name');
  TestUtils.assert.isTrue(basicPlan.price > 0, 'Should have a price greater than 0');
}, 'integration');

// WhatsApp Integration Tests
runner.addTest('WhatsApp Integration - Initialization', async () => {
  // Import module
  const { WhatsAppIntegration } = require('../src/integration/whatsapp-integration.js');

  // Create instance
  const whatsAppIntegration = new WhatsAppIntegration();

  // Test initialization
  whatsAppIntegration.initialize();

  // Verify initialization
  TestUtils.assert.isTrue(whatsAppIntegration.isInitialized, 'Should be initialized');
  TestUtils.assert.isFalse(whatsAppIntegration.isConnected, 'Should not be connected initially');
}, 'integration');

runner.addTest('WhatsApp Integration - Session Management', async () => {
  // Import module
  const { WhatsAppIntegration } = require('../src/integration/whatsapp-integration.js');

  // Create instance
  const whatsAppIntegration = new WhatsAppIntegration();
  whatsAppIntegration.initialize();

  // Test session management
  whatsAppIntegration.phoneNumber = '+1234567890';
  whatsAppIntegration.deviceInfo = { name: 'Test Device', platform: 'Android', version: '10.0' };
  whatsAppIntegration.isConnected = true;

  // Store session
  whatsAppIntegration.storeSession();

  // Clear session
  whatsAppIntegration.clearSession();

  // Verify session cleared
  TestUtils.assert.isNull(whatsAppIntegration.phoneNumber, 'Phone number should be null');
  TestUtils.assert.isNull(whatsAppIntegration.deviceInfo, 'Device info should be null');
  TestUtils.assert.isFalse(whatsAppIntegration.isConnected, 'Should not be connected after clearing session');
}, 'integration');

// Telegram Integration Tests
runner.addTest('Telegram Integration - Initialization', async () => {
  // Import module
  const { TelegramIntegration } = require('../src/integration/telegram-integration.js');

  // Create instance
  const telegramIntegration = new TelegramIntegration();

  // Test initialization
  telegramIntegration.initialize();

  // Verify initialization
  TestUtils.assert.isTrue(telegramIntegration.isInitialized, 'Should be initialized');
  TestUtils.assert.isFalse(telegramIntegration.isConnected, 'Should not be connected initially');
}, 'integration');

runner.addTest('Telegram Integration - Message Handlers', async () => {
  // Import module
  const { TelegramIntegration } = require('../src/integration/telegram-integration.js');

  // Create instance
  const telegramIntegration = new TelegramIntegration();
  telegramIntegration.initialize();

  // Test registering message handler
  const mockHandler = TestUtils.mock.fn();
  telegramIntegration.registerMessageHandler('message', mockHandler);

  // Verify handler registered
  TestUtils.assert.equal(telegramIntegration.messageHandlers.length, 1, 'Should have one message handler');
  TestUtils.assert.equal(telegramIntegration.messageHandlers[0].type, 'message', 'Handler type should be message');
}, 'integration');

// Cosmic Theme Tests
runner.addTest('Cosmic Theme - Initialization', async () => {
  // Import module
  const { CosmicTheme } = require('../src/theme/cosmic-theme.js');

  // Create instance
  const cosmicTheme = new CosmicTheme();

  // Test initialization
  cosmicTheme.initialize();

  // Verify initialization
  TestUtils.assert.isTrue(cosmicTheme.isInitialized, 'Should be initialized');
  TestUtils.assert.equal(cosmicTheme.settings.accentColor, 'neutral', 'Default accent color should be neutral');
}, 'ui');

runner.addTest('Cosmic Theme - Animation Speed', async () => {
  // Import module
  const { CosmicTheme } = require('../src/theme/cosmic-theme.js');

  // Create instance
  const cosmicTheme = new CosmicTheme();
  cosmicTheme.initialize();

  // Test setting animation speed
  cosmicTheme.settings.animationSpeed = 'fast';

  // Get animation speed
  const speed = cosmicTheme.getAnimationSpeed();

  // Verify animation speed
  TestUtils.assert.equal(speed, 'fast', 'Animation speed should be fast');
}, 'ui');

runner.addTest('Cosmic Theme - Background Color', async () => {
  // Import module
  const { CosmicTheme } = require('../src/theme/cosmic-theme.js');

  // Create instance
  const cosmicTheme = new CosmicTheme();
  cosmicTheme.initialize();

  // Test setting accent color
  cosmicTheme.settings.accentColor = 'cheerful';

  // Get background color
  const backgroundColor = cosmicTheme.getBackgroundColor();

  // Verify background color
  TestUtils.assert.equal(typeof backgroundColor, 'string', 'Should return a string');
  TestUtils.assert.isTrue(backgroundColor.startsWith('#'), 'Should be a hex color code');
  TestUtils.assert.equal(backgroundColor, '#ffecd2', 'Should return the correct color for cheerful');
}, 'ui');

// Smart Personal Assistant Tests
runner.addTest('Smart Assistant - Initialization', async () => {
  // Import module
  const { SmartPersonalAssistant } = require('../src/assistant/smart-personal-assistant.js');

  // Create instance
  const assistant = new SmartPersonalAssistant();

  // Test initialization
  assistant.initialize();

  // Verify initialization
  TestUtils.assert.isTrue(assistant.isInitialized, 'Should be initialized');
  TestUtils.assert.equal(assistant.settings.assistantName, 'Mashaaer', 'Default name should be Mashaaer');
}, 'assistant');

runner.addTest('Smart Assistant - Language Support', async () => {
  // Import module
  const { SmartPersonalAssistant } = require('../src/assistant/smart-personal-assistant.js');

  // Create instance
  const assistant = new SmartPersonalAssistant();
  assistant.initialize();

  // Test language code
  const arCode = assistant.getLanguageCode();

  // Change language
  assistant.settings.language = 'en';
  const enCode = assistant.getLanguageCode();

  // Verify language codes
  TestUtils.assert.isTrue(arCode.startsWith('ar-'), 'Arabic code should start with ar-');
  TestUtils.assert.isTrue(enCode.startsWith('en-'), 'English code should start with en-');
}, 'assistant');

runner.addTest('Smart Assistant - Response Generation', async () => {
  // Import module
  const { SmartPersonalAssistant } = require('../src/assistant/smart-personal-assistant.js');

  // Create instance
  const assistant = new SmartPersonalAssistant();
  assistant.initialize();

  // Test response generation
  const greetingResponse = assistant.generateResponseText('مرحبا');
  const weatherResponse = assistant.generateResponseText('كيف الطقس اليوم؟');

  // Verify responses
  TestUtils.assert.isTrue(typeof greetingResponse === 'string', 'Should return a string');
  TestUtils.assert.isTrue(greetingResponse.length > 0, 'Greeting response should not be empty');
  TestUtils.assert.isTrue(typeof weatherResponse === 'string', 'Should return a string');
  TestUtils.assert.isTrue(weatherResponse.length > 0, 'Weather response should not be empty');
}, 'assistant');

runner.addTest('Smart Assistant - Context Management', async () => {
  // Import module
  const { SmartPersonalAssistant } = require('../src/assistant/smart-personal-assistant.js');

  // Create instance
  const assistant = new SmartPersonalAssistant();
  assistant.initialize();

  // Test context management
  const message = {
    id: Date.now(),
    text: 'Hello',
    sender: 'user',
    timestamp: new Date().toISOString()
  };

  assistant.addToContext(message);

  // Verify context
  TestUtils.assert.equal(assistant.context.length, 1, 'Should have one message in context');
  TestUtils.assert.equal(assistant.context[0].text, 'Hello', 'Message text should be correct');
}, 'assistant');

// Utility Tests
runner.addTest('Markdown Export - Report Generation', async () => {
  // Import module
  const { generateMarkdownReport } = require('../src/utils/export/generateMarkdownReport.js');

  // Create mock analysis result
  const mockResult = {
    filename: 'test-file.js',
    analysis: {
      complexity: [
        { name: 'testFunction', complexity: 5 },
        { name: 'anotherFunction', complexity: 3 }
      ],
      duplication: [
        { count: 2, lines: '10-15' }
      ],
      codeSmells: [
        { message: 'Test code smell', line: 42 }
      ],
      dependencies: [
        'dependency1',
        'dependency2'
      ]
    },
    summary: {
      description: 'Test file description',
      message: 'Test analysis message',
      performance: {
        loadTime: '100ms',
        renderTime: '50ms'
      }
    }
  };

  // Generate markdown report
  const markdown = generateMarkdownReport(mockResult);

  // Verify markdown report includes all required sections
  TestUtils.assert.isTrue(typeof markdown === 'string', 'Should return a string');
  TestUtils.assert.includes(markdown, '# 📊 تقرير تحليل الكود', 'Should include report title');
  TestUtils.assert.includes(markdown, '## 📝 وصف الملف', 'Should include file description section');
  TestUtils.assert.includes(markdown, '## 📣 رسالة التحليل', 'Should include analysis message section');
  TestUtils.assert.includes(markdown, '## 🧠 تعقيد الدوال', 'Should include function complexity section');
  TestUtils.assert.includes(markdown, '## ♻️ دوال مكررة', 'Should include duplicated functions section');
  TestUtils.assert.includes(markdown, '## 🚫 تنبيهات الأنماط السيئة', 'Should include code smells section');
  TestUtils.assert.includes(markdown, '## 🧩 خريطة التبعيات', 'Should include dependencies section');
  TestUtils.assert.includes(markdown, '## ⚙️ تحليل الأداء', 'Should include performance analysis section');
  TestUtils.assert.includes(markdown, '## ✅ الخلاصة', 'Should include conclusion section');
}, 'utils');

// Run all tests
runner.runTests().catch(error => {
  console.error('Error running tests:', error);
});

// Export test results
module.exports = {
  testResults,
  TestUtils
};
