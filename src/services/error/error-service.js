/**
 * Error Service
 * 
 * This service provides centralized error handling functionality for the application.
 * It integrates with the error handler utility and the logging service.
 */

import errorHandler, { ErrorTypes } from '../../utils/error-handler.js';

export class ErrorService {
  constructor() {
    this.isInitialized = false;
    this.errorHandler = errorHandler;
    this.loggingService = null;
    this.configService = null;
  }

  /**
   * Initialize the error service
   * @param {Object} configService - The configuration service
   * @param {Object} loggingService - The logging service
   * @returns {ErrorService} - This instance for chaining
   */
  initialize(configService, loggingService) {
    if (this.isInitialized) return this;

    this.configService = configService;
    this.loggingService = loggingService;

    // Set the logging service on the error handler
    this.errorHandler.setLoggingService(loggingService);

    // Configure error handling based on the application configuration
    // Uncomment and use this when implementing error reporting features
    // const errorReporting = this.configService.get('system.errorReporting', true);

    this.isInitialized = true;
    this.loggingService.info('Error service initialized');

    return this;
  }

  /**
   * Handle an error
   * @param {Error} error - The error to handle
   * @param {string} context - The context in which the error occurred
   * @param {Function} callback - Optional callback to execute after handling the error
   * @returns {Error} - The handled error
   */
  handleError(error, context = '', callback = null) {
    return this.errorHandler.handleError(error, context, callback);
  }

  /**
   * Create a new application error
   * @param {string} message - Error message
   * @param {string} type - Error type
   * @param {Object} details - Additional error details
   * @returns {AppError} - The created error
   */
  createError(message, type = ErrorTypes.UNEXPECTED, details = null) {
    return this.errorHandler.createError(message, type, details);
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
    return this.errorHandler.createAndHandleError(message, type, details, context, callback);
  }

  /**
   * Create a validation error
   * @param {string} message - Error message
   * @param {Object} details - Validation details
   * @returns {AppError} - The created error
   */
  createValidationError(message, details) {
    return this.errorHandler.createValidationError(message, details);
  }

  /**
   * Create a network error
   * @param {string} message - Error message
   * @param {Object} details - Network details
   * @returns {AppError} - The created error
   */
  createNetworkError(message, details) {
    return this.errorHandler.createNetworkError(message, details);
  }

  /**
   * Create an authentication error
   * @param {string} message - Error message
   * @param {Object} details - Authentication details
   * @returns {AppError} - The created error
   */
  createAuthenticationError(message, details) {
    return this.errorHandler.createAuthenticationError(message, details);
  }

  /**
   * Create an authorization error
   * @param {string} message - Error message
   * @param {Object} details - Authorization details
   * @returns {AppError} - The created error
   */
  createAuthorizationError(message, details) {
    return this.errorHandler.createAuthorizationError(message, details);
  }

  /**
   * Create a not found error
   * @param {string} message - Error message
   * @param {Object} details - Not found details
   * @returns {AppError} - The created error
   */
  createNotFoundError(message, details) {
    return this.errorHandler.createNotFoundError(message, details);
  }

  /**
   * Create a service error
   * @param {string} message - Error message
   * @param {Object} details - Service details
   * @returns {AppError} - The created error
   */
  createServiceError(message, details) {
    return this.errorHandler.createServiceError(message, details);
  }

  /**
   * Get error types
   * @returns {Object} - Error types
   */
  getErrorTypes() {
    return ErrorTypes;
  }

  /**
   * Create a component error handler
   * @param {string} componentName - The name of the component
   * @returns {Object} - An error handler for the component
   */
  createComponentErrorHandler(componentName) {
    return {
      handleError: (error, callback = null) => 
        this.handleError(error, componentName, callback),

      createAndHandleError: (message, type, details, callback = null) => 
        this.createAndHandleError(message, type, details, componentName, callback)
    };
  }
}
