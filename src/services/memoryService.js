import { MemoryService } from './memory/memory-service.js';
import { ConfigService } from './config/config-service.js';

// Create instances of the services
const memoryService = new MemoryService();
const configService = new ConfigService();

// Initialize configService
configService.initialize({});

// Add init method to memoryService
memoryService.init = function() {
  // Initialize memoryService with its dependencies
  this.initialize(configService);
  return this;
};

// Export the instance as default
export default memoryService;
