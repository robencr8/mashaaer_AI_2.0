import { ThemeService } from './theme/theme-service.js';
import { ConfigService } from './config/config-service.js';
import emotionService from './emotionService.js';

// Create instances of the services
const themeService = new ThemeService();
const configService = new ConfigService();

// Initialize configService
configService.initialize({});

// Add init method to themeService
themeService.init = function() {
  // Initialize themeService with its dependencies
  this.initialize(configService, emotionService);
  return this;
};

// Add applyCurrentTheme method to themeService
themeService.applyCurrentTheme = function() {
  if (window.cosmicTheme && typeof window.cosmicTheme.applyTheme === 'function') {
    window.cosmicTheme.applyTheme();
  } else {
    console.warn("⚠️ cosmicTheme غير متاح أو لا يحتوي على applyTheme()");
  }
};

// Export the instance as default
export default themeService;
