/**
 * Logging Service
 * 
 * This service provides centralized logging functionality for the application.
 * It integrates with the configuration system to determine log levels and other settings.
 * It also supports remote logging for production environments.
 */

import logger from '../../utils/logger.js';

export class LoggingService {
  constructor() {
    this.isInitialized = false;
    this.logger = logger;
    this.configService = null;
    this.logQueue = [];
    this.isFlushingLogs = false;
    this.flushInterval = null;
  }

  /**
   * Initialize the logging service
   * @param {Object} configService - The configuration service
   * @returns {LoggingService} - This instance for chaining
   */
  initialize(configService) {
    if (this.isInitialized) return this;

    this.configService = configService;

    // Configure the logger based on the application configuration
    const logLevel = this.configService.get('system.logLevel', 'info');
    const debugMode = this.configService.get('system.debugMode', false);

    // Check if remote logging is enabled
    const remoteLoggingEnabled = this.configService.get('system.remoteLogging.enabled', false);
    const remoteLoggingEndpoint = this.configService.get('system.remoteLogging.endpoint', '');
    const batchSize = this.configService.get('system.remoteLogging.batchSize', 10);
    const flushInterval = this.configService.get('system.remoteLogging.flushInterval', 5000);

    this.logger.configure({
      level: debugMode ? 'debug' : logLevel,
      prefix: '[Mashaaer]',
      enableConsole: true,
      enableTimestamp: true,
      remoteLogging: {
        enabled: remoteLoggingEnabled,
        endpoint: remoteLoggingEndpoint
      }
    });

    // Set up remote logging if enabled
    if (remoteLoggingEnabled && remoteLoggingEndpoint) {
      this.setupRemoteLogging(batchSize, flushInterval);
    }

    this.isInitialized = true;
    this.logger.info('Logging service initialized');

    return this;
  }

  /**
   * Set up remote logging
   * @param {number} batchSize - Number of logs to batch before sending
   * @param {number} flushInterval - Flush logs every X milliseconds
   * @private
   */
  setupRemoteLogging(batchSize, flushInterval) {
    // Set up flush interval
    this.flushInterval = setInterval(() => {
      this.flushLogs();
    }, flushInterval);

    // Override logger methods to queue logs for remote logging
    const originalDebug = this.logger.debug;
    const originalInfo = this.logger.info;
    const originalWarn = this.logger.warn;
    const originalError = this.logger.error;

    this.logger.debug = (message, data) => {
      originalDebug.call(this.logger, message, data);
      this.queueLog('debug', message, data);
    };

    this.logger.info = (message, data) => {
      originalInfo.call(this.logger, message, data);
      this.queueLog('info', message, data);
    };

    this.logger.warn = (message, data) => {
      originalWarn.call(this.logger, message, data);
      this.queueLog('warn', message, data);
    };

    this.logger.error = (message, data) => {
      originalError.call(this.logger, message, data);
      this.queueLog('error', message, data);
    };

    // Flush logs on window unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flushLogs(true);
      });
    }
  }

  /**
   * Queue a log for remote logging
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   * @private
   */
  queueLog(level, message, data) {
    if (!this.isInitialized) return;

    const remoteLoggingEnabled = this.configService.get('system.remoteLogging.enabled', false);
    if (!remoteLoggingEnabled) return;

    this.logQueue.push({
      level,
      message,
      data,
      timestamp: new Date().toISOString()
    });

    const batchSize = this.configService.get('system.remoteLogging.batchSize', 10);
    if (this.logQueue.length >= batchSize) {
      this.flushLogs();
    }
  }

  /**
   * Flush logs to remote logging service
   * @param {boolean} sync - Whether to flush synchronously (for beforeunload)
   * @private
   */
  async flushLogs(sync = false) {
    if (!this.isInitialized || this.isFlushingLogs || this.logQueue.length === 0) return;

    const remoteLoggingEnabled = this.configService.get('system.remoteLogging.enabled', false);
    const remoteLoggingEndpoint = this.configService.get('system.remoteLogging.endpoint', '');

    if (!remoteLoggingEnabled || !remoteLoggingEndpoint) return;

    this.isFlushingLogs = true;
    const logsToSend = [...this.logQueue];
    this.logQueue = [];

    try {
      const sendLogs = () => {
        return fetch(remoteLoggingEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            logs: logsToSend,
            source: 'mashaaer-frontend',
            version: process.env.REACT_APP_VERSION || '1.0.0'
          })
        });
      };

      if (sync && typeof navigator !== 'undefined' && navigator.sendBeacon) {
        // Use sendBeacon for synchronous sending (beforeunload)
        const blob = new Blob([JSON.stringify({
          logs: logsToSend,
          source: 'mashaaer-frontend',
          version: process.env.REACT_APP_VERSION || '1.0.0'
        })], { type: 'application/json' });

        navigator.sendBeacon(remoteLoggingEndpoint, blob);
      } else {
        // Use fetch for asynchronous sending
        await sendLogs();
      }
    } catch (error) {
      console.error('Error sending logs to remote service:', error);
      // Put the logs back in the queue
      this.logQueue = [...logsToSend, ...this.logQueue];
    } finally {
      this.isFlushingLogs = false;
    }
  }

  /**
   * Log a debug message
   * @param {string} message - The message to log
   * @param {Object} data - Additional data to log
   */
  debug(message, data) {
    this.logger.debug(message, data);
  }

  /**
   * Log an info message
   * @param {string} message - The message to log
   * @param {Object} data - Additional data to log
   */
  info(message, data) {
    this.logger.info(message, data);
  }

  /**
   * Log a warning message
   * @param {string} message - The message to log
   * @param {Object} data - Additional data to log
   */
  warn(message, data) {
    this.logger.warn(message, data);
  }

  /**
   * Log an error message
   * @param {string} message - The message to log
   * @param {Object} data - Additional data to log
   */
  error(message, data) {
    this.logger.error(message, data);
  }

  /**
   * Log a service initialization
   * @param {string} serviceName - The name of the service
   */
  logServiceInit(serviceName) {
    this.info(`✅ ${serviceName} initialized`);
  }

  /**
   * Log a service error
   * @param {string} serviceName - The name of the service
   * @param {Error} error - The error that occurred
   */
  logServiceError(serviceName, error) {
    this.error(`❌ Error in ${serviceName}:`, error);
  }

  /**
   * Create a logger for a specific component or service
   * @param {string} componentName - The name of the component or service
   * @returns {Object} - A logger instance with methods prefixed with the component name
   */
  createComponentLogger(componentName) {
    return {
      debug: (message, data) => this.debug(`[${componentName}] ${message}`, data),
      info: (message, data) => this.info(`[${componentName}] ${message}`, data),
      warn: (message, data) => this.warn(`[${componentName}] ${message}`, data),
      error: (message, data) => this.error(`[${componentName}] ${message}`, data)
    };
  }
}
