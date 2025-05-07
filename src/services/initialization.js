/**
 * Initialization Service
 * 
 * This service is responsible for initializing all other services in the application.
 * It uses the SystemBootstrapService to centralize the bootstrapping logic.
 * 
 * This implementation avoids the singleton pattern by not storing service instances
 * in module-level variables. Instead, it creates and initializes services on demand
 * and returns them to the caller, which is responsible for storing and providing them
 * to components that need them (typically through React context).
 */

import { systemBootstrapService } from './bootstrap/system-bootstrap-service.js';

/**
 * Initialize all services using the SystemBootstrapService
 * @param {Object} config - Configuration object
 * @returns {Object} - Object containing all initialized services
 */
export const initializeServices = async (config = {}) => {
  try {
    // Use the SystemBootstrapService to initialize all services
    const services = await systemBootstrapService.initialize(config);

    // Log system status
    console.log('System initialization status:', systemBootstrapService.getSystemStatusReport());

    return services;
  } catch (error) {
    console.error('Error initializing services:', error);
    throw error;
  }
};
