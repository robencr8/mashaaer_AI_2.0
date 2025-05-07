import { VoiceService } from './voice/voice-service.js';
import { ConfigService } from './config/config-service.js';
import emotionService from './emotionService.js';

// Create instances of the services
const voiceService = new VoiceService();
const configService = new ConfigService();

// Initialize configService
configService.initialize({});

// Add init method to voiceService
voiceService.init = function() {
  // Initialize voiceService with its dependencies
  this.initialize(configService, emotionService);
  return this;
};

// Export the instance as default
export default voiceService;
