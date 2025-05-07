/**
 * Console Filter Utility
 * 
 * This utility filters console errors from external sources like browser extensions.
 * It helps developers focus on errors that are actually coming from the application code.
 */

/**
 * Initialize console error filtering
 * This function overrides the console.error method to filter out errors from external sources
 */
export function initializeConsoleFilter() {
  // Store the original console.error function
  const originalConsoleError = console.error;

  // Override console.error to filter out errors from external sources
  console.error = function(...args) {
    // Check if the error is related to external resources
    const errorString = args.join(' ');
    
    // Filter out errors from browser extensions
    if (
      errorString.includes('net::ERR_FILE_NOT_FOUND') && 
      (
        errorString.includes('extensionState.js') ||
        errorString.includes('heuristicsRedefinitions.js') ||
        errorString.includes('utils.js') ||
        errorString.includes('extension')
      )
    ) {
      // Optionally log a more helpful message at debug level
      if (window.mashaaerComponents?.systemReport?.isDebugMode()) {
        originalConsoleError.apply(console, ['[Filtered Extension Error]', ...args]);
      }
      return;
    }
    
    // Filter out Content Security Policy errors related to eval from extensions
    if (
      errorString.includes('Content Security Policy') && 
      errorString.includes('eval') &&
      !errorString.includes('localhost')
    ) {
      // Optionally log a more helpful message at debug level
      if (window.mashaaerComponents?.systemReport?.isDebugMode()) {
        originalConsoleError.apply(console, ['[Filtered CSP Error]', ...args]);
      }
      return;
    }

    // Pass through all other errors to the original console.error
    originalConsoleError.apply(console, args);
  };

  // Log that the console filter has been initialized
  console.log('Console error filter initialized');
}

/**
 * Get filtered console errors
 * This function returns a filtered version of the console that only shows errors from the application
 * 
 * @returns {Object} Filtered console object
 */
export function getFilteredConsole() {
  const filteredConsole = { ...console };
  
  filteredConsole.error = function(...args) {
    // Check if the error is related to external resources
    const errorString = args.join(' ');
    
    // Filter out errors from browser extensions
    if (
      errorString.includes('net::ERR_FILE_NOT_FOUND') && 
      (
        errorString.includes('extensionState.js') ||
        errorString.includes('heuristicsRedefinitions.js') ||
        errorString.includes('utils.js') ||
        errorString.includes('extension')
      )
    ) {
      return;
    }
    
    // Filter out Content Security Policy errors related to eval from extensions
    if (
      errorString.includes('Content Security Policy') && 
      errorString.includes('eval') &&
      !errorString.includes('localhost')
    ) {
      return;
    }

    // Pass through all other errors to the original console.error
    console.error.apply(console, args);
  };

  return filteredConsole;
}

export default {
  initializeConsoleFilter,
  getFilteredConsole
};