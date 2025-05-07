/**
 * Logging Service Tests
 * 
 * This file contains tests for the logging service.
 */

import { LoggingService } from '../../src/services/logging/logging-service';
import logger from '../../src/utils/logger';

// Mock the logger utility
jest.mock('../../src/utils/logger', () => ({
  configure: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}));

describe('LoggingService', () => {
  let loggingService;
  let mockConfigService;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock config service
    mockConfigService = {
      get: jest.fn((key, defaultValue) => {
        if (key === 'system.logLevel') return 'info';
        if (key === 'system.debugMode') return false;
        return defaultValue;
      })
    };

    // Create logging service
    loggingService = new LoggingService();
  });

  test('should initialize correctly', () => {
    // Initialize the service
    loggingService.initialize(mockConfigService);

    // Check if the logger was configured
    expect(logger.configure).toHaveBeenCalledWith({
      level: 'info',
      prefix: '[Mashaaer]',
      enableConsole: true,
      enableTimestamp: true
    });

    // Check if the service is initialized
    expect(loggingService.isInitialized).toBe(true);
  });

  test('should use debug level when debugMode is true', () => {
    // Mock debug mode
    mockConfigService.get = jest.fn((key, defaultValue) => {
      if (key === 'system.logLevel') return 'info';
      if (key === 'system.debugMode') return true;
      return defaultValue;
    });

    // Initialize the service
    loggingService.initialize(mockConfigService);

    // Check if the logger was configured with debug level
    expect(logger.configure).toHaveBeenCalledWith({
      level: 'debug',
      prefix: '[Mashaaer]',
      enableConsole: true,
      enableTimestamp: true
    });
  });

  test('should log messages at different levels', () => {
    // Initialize the service
    loggingService.initialize(mockConfigService);

    // Log messages
    loggingService.debug('Debug message');
    loggingService.info('Info message');
    loggingService.warn('Warning message');
    loggingService.error('Error message');

    // Check if the logger methods were called
    expect(logger.debug).toHaveBeenCalledWith('Debug message', undefined);
    expect(logger.info).toHaveBeenCalledWith('Info message', undefined);
    expect(logger.warn).toHaveBeenCalledWith('Warning message', undefined);
    expect(logger.error).toHaveBeenCalledWith('Error message', undefined);
  });

  test('should log service initialization', () => {
    // Initialize the service
    loggingService.initialize(mockConfigService);

    // Log service initialization
    loggingService.logServiceInit('Test Service');

    // Check if the info method was called
    expect(logger.info).toHaveBeenCalledWith('✅ Test Service initialized');
  });

  test('should create component logger', () => {
    // Initialize the service
    loggingService.initialize(mockConfigService);

    // Create component logger
    const componentLogger = loggingService.createComponentLogger('TestComponent');

    // Log messages using component logger
    componentLogger.debug('Debug message');
    componentLogger.info('Info message');
    componentLogger.warn('Warning message');
    componentLogger.error('Error message');

    // Check if the logger methods were called with component prefix
    expect(logger.debug).toHaveBeenCalledWith('[TestComponent] Debug message', undefined);
    expect(logger.info).toHaveBeenCalledWith('[TestComponent] Info message', undefined);
    expect(logger.warn).toHaveBeenCalledWith('[TestComponent] Warning message', undefined);
    expect(logger.error).toHaveBeenCalledWith('[TestComponent] Error message', undefined);
  });
});