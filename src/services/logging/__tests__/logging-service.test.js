/**
 * LoggingService Tests
 * 
 * This file contains tests for the LoggingService.
 */

import { LoggingService } from '../logging-service.js';
import { ConfigService } from '../../config/config-service.js';

// Mock the logger utility
jest.mock('../../../utils/logger', () => {
  const originalModule = jest.requireActual('../../../utils/logger');
  
  // Mock the default export and named exports
  return {
    __esModule: true,
    ...originalModule,
    default: {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      configure: jest.fn()
    },
    Logger: originalModule.Logger
  };
});

describe('LoggingService', () => {
  let loggingService;
  let configService;
  let consoleSpy;
  
  beforeEach(() => {
    // Mock the console methods
    consoleSpy = {
      debug: jest.spyOn(console, 'debug').mockImplementation(),
      info: jest.spyOn(console, 'info').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation(),
    };
    
    // Create a mock config service
    configService = new ConfigService();
    configService.get = jest.fn().mockImplementation((key, defaultValue) => {
      if (key === 'system.logLevel') return 'info';
      if (key === 'system.debugMode') return false;
      if (key === 'system.remoteLogging.enabled') return false;
      return defaultValue;
    });
    
    // Initialize the logging service
    loggingService = new LoggingService();
    loggingService.initialize(configService);
  });
  
  afterEach(() => {
    // Restore console methods
    consoleSpy.debug.mockRestore();
    consoleSpy.info.mockRestore();
    consoleSpy.warn.mockRestore();
    consoleSpy.error.mockRestore();
    
    // Clear all mocks
    jest.clearAllMocks();
  });
  
  test('should initialize with config service', () => {
    expect(loggingService.isInitialized).toBe(true);
    expect(loggingService.configService).toBe(configService);
  });
  
  test('should log info messages', () => {
    const message = 'Test info message';
    const data = { test: 'data' };
    
    loggingService.info(message, data);
    
    expect(loggingService.logger.info).toHaveBeenCalledWith(message, data);
  });
  
  test('should log warning messages', () => {
    const message = 'Test warning message';
    const data = { test: 'data' };
    
    loggingService.warn(message, data);
    
    expect(loggingService.logger.warn).toHaveBeenCalledWith(message, data);
  });
  
  test('should log error messages', () => {
    const message = 'Test error message';
    const data = { test: 'data' };
    
    loggingService.error(message, data);
    
    expect(loggingService.logger.error).toHaveBeenCalledWith(message, data);
  });
  
  test('should log debug messages when debug mode is enabled', () => {
    // Mock debug mode enabled
    configService.get = jest.fn().mockImplementation((key, defaultValue) => {
      if (key === 'system.logLevel') return 'info';
      if (key === 'system.debugMode') return true;
      if (key === 'system.remoteLogging.enabled') return false;
      return defaultValue;
    });
    
    // Re-initialize the logging service
    loggingService = new LoggingService();
    loggingService.initialize(configService);
    
    const message = 'Test debug message';
    const data = { test: 'data' };
    
    loggingService.debug(message, data);
    
    expect(loggingService.logger.debug).toHaveBeenCalledWith(message, data);
  });
  
  test('should create component logger', () => {
    const componentName = 'TestComponent';
    const componentLogger = loggingService.createComponentLogger(componentName);
    
    expect(componentLogger).toBeDefined();
    expect(typeof componentLogger.debug).toBe('function');
    expect(typeof componentLogger.info).toBe('function');
    expect(typeof componentLogger.warn).toBe('function');
    expect(typeof componentLogger.error).toBe('function');
    
    // Test component logger methods
    componentLogger.info('Component info message');
    expect(loggingService.logger.info).toHaveBeenCalledWith('[TestComponent] Component info message', undefined);
  });
  
  test('should set up remote logging when enabled', () => {
    // Mock remote logging enabled
    configService.get = jest.fn().mockImplementation((key, defaultValue) => {
      if (key === 'system.logLevel') return 'info';
      if (key === 'system.debugMode') return false;
      if (key === 'system.remoteLogging.enabled') return true;
      if (key === 'system.remoteLogging.endpoint') return 'https://logging.example.com/api/logs';
      if (key === 'system.remoteLogging.batchSize') return 10;
      if (key === 'system.remoteLogging.flushInterval') return 5000;
      return defaultValue;
    });
    
    // Spy on setupRemoteLogging
    const setupSpy = jest.spyOn(LoggingService.prototype, 'setupRemoteLogging');
    
    // Re-initialize the logging service
    loggingService = new LoggingService();
    loggingService.initialize(configService);
    
    expect(setupSpy).toHaveBeenCalledWith(10, 5000);
    
    // Restore the spy
    setupSpy.mockRestore();
  });
});