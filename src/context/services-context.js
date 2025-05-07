/**
 * Services Context
 * 
 * This context provides access to all services throughout the React component tree.
 * It uses React's Context API to make services available to all components without prop drilling.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeServices } from '../services/index.js';

// Create the context
const ServicesContext = createContext(null);

/**
 * Services Provider Component
 * 
 * This component initializes all services and provides them to the component tree.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.initialConfig - Initial configuration for services
 * @param {React.ReactNode} props.children - Child components
 */
export const ServicesProvider = ({ initialConfig = {}, children }) => {
  const [services, setServices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initServices = async () => {
      try {
        setLoading(true);
        const initializedServices = await initializeServices(initialConfig);
        setServices(initializedServices);
        setLoading(false);
      } catch (err) {
        console.error('Error initializing services:', err);
        setError(err);
        setLoading(false);
      }
    };

    initServices();
  }, [initialConfig]);

  if (loading) {
    return <div>Loading services...</div>;
  }

  if (error) {
    return <div>Error initializing services: {error.message}</div>;
  }

  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
};

/**
 * Hook to use services in components
 * @returns {Object} - Object containing all services
 */
export const useServices = () => {
  const services = useContext(ServicesContext);

  if (!services) {
    throw new Error('useServices must be used within a ServicesProvider');
  }

  return services;
};

/**
 * Hook to use a specific service in components
 * @param {string} serviceName - Name of the service to use
 * @returns {Object} - The requested service
 */
export const useService = (serviceName) => {
  const services = useServices();

  if (!services[serviceName]) {
    throw new Error(`Service "${serviceName}" not found`);
  }

  return services[serviceName];
};

// Export specific service hooks for convenience
export const useConfigService = () => useService('configService');
export const useLoggingService = () => useService('loggingService');
export const useErrorService = () => useService('errorService');
export const useStateManagementService = () => useService('stateManagementService');
export const useApiService = () => useService('apiService');
export const useMemoryService = () => useService('memoryService');
export const useEmotionService = () => useService('emotionService');
export const useThemeService = () => useService('themeService');
export const useVoiceService = () => useService('voiceService');
export const useAssistantService = () => useService('assistantService');
