import { EmotionService } from './emotion/emotion-service.js';
import { ConfigService } from './config/config-service.js';
import { MemoryService } from './memory/memory-service.js';

// Create instances of the services
const emotionService = new EmotionService();
const configService = new ConfigService();
const memoryService = new MemoryService();

// Initialize configService first
configService.initialize({});

// Initialize memoryService
memoryService.initialize(configService);

// Add init method to emotionService
emotionService.init = function() {
  // Initialize emotionService with its dependencies
  this.initialize(configService, memoryService);
  return this;
};

// Export the instance as default
export default emotionService;
