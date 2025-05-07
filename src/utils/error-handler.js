/**
 * Error Handler Utility
 * 
 * A centralized error handling system for the application.
 * Defines common error types and provides a consistent way to create and handle errors.
 */

import logger from './logger.js';

// Define common error types
export const ErrorTypes = {
  VALIDATION: 'VALIDATION_ERROR',
  NETWORK: 'NETWORK_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  SERVICE: 'SERVICE_ERROR',
  UNEXPECTED: 'UNEXPECTED_ERROR'
};

/**
 * Custom application error class
 */
export class AppError extends Error {
  constructor(message, type = ErrorTypes.UNEXPECTED, details = null) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.details = details;
    this.timestamp = new Date();
    
    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Error handler class
 */
export class ErrorHandler {
  constructor(loggingService = null) {
    this.loggingService = loggingService;
  }

  /**
   * Set the logging service
   * @param {Object} loggingService - The logging service
   */
  setLoggingService(loggingService) {
    this.loggingService = loggingService;
  }

  /**
   * Log an error
   * @param {Error} error - The error to log
   * @param {string} context - The context in which the error occurred
   */
  logError(error, context = '') {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      type: error.type || 'UNKNOWN',
      details: error.details || null,
      context
    };

    if (this.loggingService) {
      this.loggingService.error(`Error in ${context || 'application'}:`, errorInfo);
    } else {
      // Fallback to logger utility if logging service is not available
      logger.error(`Error in ${context || 'application'}:`, errorInfo);
    }
  }

  /**
   * Handle an error
   * @param {Error} error - The error to handle
   * @param {string} context - The context in which the error occurred
   * @param {Function} callback - Optional callback to execute after handling the error
   */
  handleError(error, context = '', callback = null) {
    // Log the error
    this.logError(error, context);

    // Execute callback if provided
    if (callback && typeof callback === 'function') {
      callback(error);
    }

    // Return the error for further handling if needed
    return error;
  }

  /**
   * Create a new application error
   * @param {string} message - Error message
   * @param {string} type - Error type
   * @param {Object} details - Additional error details
   * @returns {AppError} - The created error
   */
  createError(message, type = ErrorTypes.UNEXPECTED, details = null) {
    return new AppError(message, type, details);
  }

  /**
   * Create and handle an error
   * @param {string} message - Error message
   * @param {string} type - Error type
   * @param {Object} details - Additional error details
   * @param {string} context - The context in which the error occurred
   * @param {Function} callback - Optional callback to execute after handling the error
   * @returns {AppError} - The created and handled error
   */
  createAndHandleError(message, type, details, context, callback) {
    const error = this.createError(message, type, details);
    return this.handleError(error, context, callback);
  }

  /**
   * Create a validation error
   * @param {string} message - Error message
   * @param {Object} details - Validation details
   * @returns {AppError} - The created error
   */
  createValidationError(message, details) {
    return this.createError(message, ErrorTypes.VALIDATION, details);
  }

  /**
   * Create a network error
   * @param {string} message - Error message
   * @param {Object} details - Network details
   * @returns {AppError} - The created error
   */
  createNetworkError(message, details) {
    return this.createError(message, ErrorTypes.NETWORK, details);
  }

  /**
   * Create an authentication error
   * @param {string} message - Error message
   * @param {Object} details - Authentication details
   * @returns {AppError} - The created error
   */
  createAuthenticationError(message, details) {
    return this.createError(message, ErrorTypes.AUTHENTICATION, details);
  }

  /**
   * Create an authorization error
   * @param {string} message - Error message
   * @param {Object} details - Authorization details
   * @returns {AppError} - The created error
   */
  createAuthorizationError(message, details) {
    return this.createError(message, ErrorTypes.AUTHORIZATION, details);
  }

  /**
   * Create a not found error
   * @param {string} message - Error message
   * @param {Object} details - Not found details
   * @returns {AppError} - The created error
   */
  createNotFoundError(message, details) {
    return this.createError(message, ErrorTypes.NOT_FOUND, details);
  }

  /**
   * Create a service error
   * @param {string} message - Error message
   * @param {Object} details - Service details
   * @returns {AppError} - The created error
   */
  createServiceError(message, details) {
    return this.createError(message, ErrorTypes.SERVICE, details);
  }
}

// Create and export a singleton instance
const errorHandler = new ErrorHandler();

export default errorHandler;