// Services index file
// This file exports all services from the services directory

// Import services
import { initializeServices } from './initialization.js';
import { EmotionService } from './emotion/emotion-service.js';
import { AssistantService } from './assistant/assistant-service.js';
import { ApiService } from './api/api-service.js';
import { VoiceService } from './voice/voice-service.js';
import { MemoryService } from './memory/memory-service.js';
import { ConfigService } from './config/config-service.js';
import { ThemeService } from './theme/theme-service.js';
import { LoggingService } from './logging/logging-service.js';
import { ErrorService } from './error/error-service.js';
import { StateManagementService } from './state/state-management-service.js';
import { AlphaService } from './alpha/alpha-service.js';
import { SystemBootstrapService, systemBootstrapService } from './bootstrap/system-bootstrap-service.js';

// Export services
export {
  initializeServices,
  EmotionService,
  AssistantService,
  ApiService,
  VoiceService,
  MemoryService,
  ConfigService,
  ThemeService,
  LoggingService,
  ErrorService,
  StateManagementService,
  AlphaService,
  SystemBootstrapService,
  systemBootstrapService
};
