import EnhancedEmotionDetection from '../src/emotion/enhanced-emotion-detection.js';
import SmartPersonalAssistant from '../src/assistant/smart-personal-assistant.js';

const emotionSystem = new EnhancedEmotionDetection();
emotionSystem.initialize();

const assistant = new SmartPersonalAssistant();
assistant.initialize();
