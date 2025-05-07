import { ApiService } from './api/api-service.js';
import { ConfigService } from './config/config-service.js';

// Create instances of the services
const apiService = new ApiService();
const configService = new ConfigService();

// Initialize configService
configService.initialize({});

// Add init method to apiService
apiService.init = function() {
  // Initialize apiService with its dependencies
  this.initialize(configService);
  return this;
};

// Export the instance as default
export default apiService;
