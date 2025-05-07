/**
 * Logger Utility
 * 
 * A centralized logging system for the application.
 * Supports different log levels and can be configured via the config system.
 */

// Log levels in order of verbosity
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4
};

// Default options
const DEFAULT_OPTIONS = {
  level: 'info',
  enableConsole: true,
  prefix: '[Mashaaer]',
  enableTimestamp: true,
  remoteLogging: {
    enabled: false,
    endpoint: ''
  }
};

class Logger {
  constructor(options = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.currentLevel = LOG_LEVELS[this.options.level.toUpperCase()] || LOG_LEVELS.INFO;
  }

  /**
   * Set the logger options
   * @param {Object} options - Logger options
   * @param {string} options.level - Log level (debug, info, warn, error, none)
   * @param {boolean} options.enableConsole - Whether to log to console
   * @param {string} options.prefix - Prefix for log messages
   * @param {boolean} options.enableTimestamp - Whether to include timestamps
   * @param {Object} options.remoteLogging - Remote logging configuration
   * @param {boolean} options.remoteLogging.enabled - Whether to enable remote logging
   * @param {string} options.remoteLogging.endpoint - Remote logging endpoint URL
   */
  configure(options = {}) {
    this.options = { ...this.options, ...options };
    this.currentLevel = LOG_LEVELS[this.options.level.toUpperCase()] || this.currentLevel;
  }

  /**
   * Format a log message
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} data - Additional data to log
   * @returns {string} - Formatted log message
   * @private
   */
  _formatMessage(level, message, data) {
    const parts = [];

    if (this.options.prefix) {
      parts.push(this.options.prefix);
    }

    if (this.options.enableTimestamp) {
      parts.push(new Date().toISOString());
    }

    parts.push(`[${level.toUpperCase()}]`);
    parts.push(message);

    return parts.join(' ');
  }

  /**
   * Log a message if the current level allows it
   * @param {number} levelValue - Numeric log level
   * @param {string} levelName - Log level name
   * @param {string} message - Log message
   * @param {Object} data - Additional data to log
   * @private
   */
  _log(levelValue, levelName, message, data) {
    if (levelValue < this.currentLevel) return;

    const formattedMessage = this._formatMessage(levelName, message, data);

    if (this.options.enableConsole) {
      switch (levelName) {
        case 'debug':
          console.debug(formattedMessage, data || '');
          break;
        case 'info':
          console.info(formattedMessage, data || '');
          break;
        case 'warn':
          console.warn(formattedMessage, data || '');
          break;
        case 'error':
          console.error(formattedMessage, data || '');
          break;
      }
    }

    // Future extension point: send logs to a server or other destination
  }

  /**
   * Log a debug message
   * @param {string} message - Log message
   * @param {Object} data - Additional data to log
   */
  debug(message, data) {
    this._log(LOG_LEVELS.DEBUG, 'debug', message, data);
  }

  /**
   * Log an info message
   * @param {string} message - Log message
   * @param {Object} data - Additional data to log
   */
  info(message, data) {
    this._log(LOG_LEVELS.INFO, 'info', message, data);
  }

  /**
   * Log a warning message
   * @param {string} message - Log message
   * @param {Object} data - Additional data to log
   */
  warn(message, data) {
    this._log(LOG_LEVELS.WARN, 'warn', message, data);
  }

  /**
   * Log an error message
   * @param {string} message - Log message
   * @param {Object} data - Additional data to log
   */
  error(message, data) {
    this._log(LOG_LEVELS.ERROR, 'error', message, data);
  }
}

// Create and export a singleton instance
const logger = new Logger();

export default logger;

// Export the class for testing or custom instances
export { Logger };
