# Mashaaer Enhanced Project - Architectural Patterns

This document describes the architectural patterns used in the Mashaaer Enhanced Project, including logging, state management, error handling, and configuration.

## Logging Pattern

The Mashaaer Enhanced Project uses a centralized logging system implemented through the `LoggingService`. This service provides a consistent way to log messages across the application.

### Key Components

1. **LoggingService**: A service that provides logging methods and integrates with the configuration system.
2. **Logger Utility**: A utility class that handles the actual logging logic.

### Log Levels

The logging system supports the following log levels, in order of verbosity:

1. **DEBUG**: Detailed information for debugging purposes
2. **INFO**: General information about application operation
3. **WARN**: Warning messages that don't prevent the application from functioning
4. **ERROR**: Error messages that indicate a problem
5. **NONE**: No logging

### Usage

```javascript
// Get the logging service from the services context
const { loggingService } = useServices();

// Log messages at different levels
loggingService.debug('Detailed debug information', { additionalData: 'value' });
loggingService.info('General information');
loggingService.warn('Warning message');
loggingService.error('Error message', errorObject);

// Create a component-specific logger
const logger = loggingService.createComponentLogger('MyComponent');
logger.info('Component-specific log message');
```

### Configuration

The logging system can be configured through the configuration system:

```javascript
// In mashaaer.config.js
module.exports = {
  system: {
    logLevel: 'info', // 'debug', 'info', 'warn', 'error', 'none'
    debugMode: false, // When true, sets logLevel to 'debug'
  }
};
```

### Remote Logging

For production environments, logs can be sent to a remote logging service. This is configured through the configuration system:

```javascript
// In mashaaer.config.js
module.exports = {
  system: {
    remoteLogging: {
      enabled: true,
      endpoint: 'https://logging.example.com/api/logs',
      batchSize: 10, // Number of logs to batch before sending
      flushInterval: 5000, // Flush logs every 5 seconds
    }
  }
};
```

## State Management Pattern

The Mashaaer Enhanced Project recommends using Zustand for state management, although it currently uses React Context API for service provision.

### Key Components

1. **StateManagementService**: A service that provides guidance and implementation for global state management.
2. **Zustand Stores**: Individual stores for different aspects of the application state.

### Why Zustand?

Zustand is recommended for the following reasons:

1. Lightweight and simple API
2. No boilerplate code required
3. Works with React hooks
4. Can be used with or without React
5. Supports middleware for advanced use cases
6. Better performance than Redux for most use cases

### Implementation

```javascript
// src/stores/useAppStore.js
import create from 'zustand';

const useAppStore = create((set) => ({
  // State
  count: 0,
  user: null,
  theme: 'light',
  
  // Actions
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),
  reset: () => set({ count: 0 }),
}));

export default useAppStore;

// Usage in components
import useAppStore from '../stores/useAppStore';

function Counter() {
  const { count, increment, decrement } = useAppStore();
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}
```

### Store Organization

For larger applications, it's recommended to organize stores by domain:

1. **User Store**: User authentication and profile information
2. **UI Store**: UI state like theme, sidebar visibility, etc.
3. **Feature Stores**: Stores for specific features like emotion detection, voice, etc.

## Error Handling Pattern

The Mashaaer Enhanced Project uses a centralized error handling system implemented through the `ErrorService`. This service provides a consistent way to create, handle, and log errors across the application.

### Key Components

1. **ErrorService**: A service that provides error handling methods and integrates with the logging system.
2. **ErrorHandler Utility**: A utility class that handles the actual error handling logic.
3. **AppError Class**: A custom error class that extends the standard Error class with additional properties.
4. **Error Boundaries**: React components that catch JavaScript errors in their child component tree.

### Error Types

The error handling system defines the following error types:

1. **VALIDATION**: Errors related to data validation
2. **NETWORK**: Errors related to network requests
3. **AUTHENTICATION**: Errors related to user authentication
4. **AUTHORIZATION**: Errors related to user authorization
5. **NOT_FOUND**: Errors related to resources not being found
6. **SERVICE**: Errors related to service operations
7. **UNEXPECTED**: Unexpected errors

### Usage

```javascript
// Get the error service from the services context
const { errorService } = useServices();

// Create and handle errors
try {
  // Some operation that might fail
} catch (error) {
  errorService.handleError(error, 'MyComponent');
}

// Create specific error types
const validationError = errorService.createValidationError('Invalid input', { field: 'username' });
const networkError = errorService.createNetworkError('Failed to fetch data', { url: '/api/data' });

// Create a component-specific error handler
const errorHandler = errorService.createComponentErrorHandler('MyComponent');
errorHandler.handleError(error);
```

### Error Boundaries

Error boundaries are React components that catch JavaScript errors in their child component tree, log those errors, and display a fallback UI.

```jsx
// src/ui/components/ErrorBoundary.js
import React from 'react';
import { useErrorService } from '../../context/services-context';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error
    this.props.errorService.handleError(error, this.props.componentName || 'ErrorBoundary', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong. Please try again later.</div>;
    }

    return this.props.children;
  }
}

// Wrapper component to provide error service
export default function ErrorBoundaryWithService(props) {
  const errorService = useErrorService();
  return <ErrorBoundary {...props} errorService={errorService} />;
}

// Usage
<ErrorBoundary componentName="MyComponent" fallback={<div>Custom error message</div>}>
  <MyComponent />
</ErrorBoundary>
```

## Configuration Pattern

The Mashaaer Enhanced Project uses a centralized configuration system implemented through the `ConfigService`. This service provides a consistent way to manage configuration settings across the application.

### Key Components

1. **ConfigService**: A service that provides configuration methods and integrates with the configuration manager.
2. **ConfigManager**: A utility class that handles the actual configuration loading and management.

### Configuration Sources

The configuration system supports loading configuration from the following sources, in order of precedence:

1. **Environment Variables**: Configuration values set in environment variables
2. **Configuration Files**: Configuration values set in configuration files (mashaaer.config.js, .mashaaerrc, etc.)
3. **Default Configuration**: Default configuration values defined in the ConfigService

### Usage

```javascript
// Get the config service from the services context
const { configService } = useServices();

// Get configuration values
const logLevel = configService.get('system.logLevel', 'info');
const debugMode = configService.get('system.debugMode', false);

// Set configuration values
configService.set('system.logLevel', 'debug');

// Check if a feature is enabled
const isFeatureEnabled = configService.isFeatureEnabled('advancedEmotionDetection');
```

### Configuration Files

The configuration system supports the following configuration files:

1. **mashaaer.config.js**: JavaScript configuration file
2. **.mashaaerrc**: JSON or YAML configuration file
3. **package.json**: Configuration in the "mashaaer" property

Example mashaaer.config.js:

```javascript
module.exports = {
  theme: {
    accentColor: 'warm',
    starDensity: 'high',
  },
  assistant: {
    defaultDialect: 'khaliji',
    defaultTone: 'cheerful',
  },
  system: {
    logLevel: 'info',
    debugMode: false,
  }
};
```

### Environment Variables

The configuration system supports environment variables with the prefix `MASHAAER_`. For example, `MASHAAER_SYSTEM_LOG_LEVEL` would set the `system.logLevel` configuration value.

## Testing Approach

The Mashaaer Enhanced Project uses a comprehensive testing approach that includes unit tests, integration tests, and end-to-end tests.

### Unit Tests

Unit tests focus on testing individual components and services in isolation. They use Jest as the test runner and testing framework.

Example unit test for the LoggingService:

```javascript
// src/services/logging/__tests__/logging-service.test.js
import { LoggingService } from '../logging-service';
import { ConfigService } from '../../config/config-service';

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
  });

  test('should log info messages', () => {
    loggingService.info('Test info message');
    expect(consoleSpy.info).toHaveBeenCalled();
  });

  test('should not log debug messages when log level is info', () => {
    loggingService.debug('Test debug message');
    expect(consoleSpy.debug).not.toHaveBeenCalled();
  });

  test('should log debug messages when debug mode is enabled', () => {
    // Mock debug mode enabled
    configService.get = jest.fn().mockImplementation((key, defaultValue) => {
      if (key === 'system.logLevel') return 'info';
      if (key === 'system.debugMode') return true;
      return defaultValue;
    });

    // Re-initialize the logging service
    loggingService.initialize(configService);

    loggingService.debug('Test debug message');
    expect(consoleSpy.debug).toHaveBeenCalled();
  });
});
```

### Integration Tests

Integration tests focus on testing the interaction between multiple components and services. They use Jest and React Testing Library.

Example integration test for the ErrorBoundary component:

```javascript
// src/ui/components/__tests__/ErrorBoundary.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';
import { ServicesProvider } from '../../../context/services-context';

// Component that throws an error
const ThrowError = () => {
  throw new Error('Test error');
  return <div>This will not render</div>;
};

describe('ErrorBoundary', () => {
  // Suppress console errors during tests
  const originalConsoleError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalConsoleError;
  });

  test('should render fallback UI when an error occurs', () => {
    render(
      <ServicesProvider>
        <ErrorBoundary fallback={<div>Error occurred</div>}>
          <ThrowError />
        </ErrorBoundary>
      </ServicesProvider>
    );

    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });

  test('should render children when no error occurs', () => {
    render(
      <ServicesProvider>
        <ErrorBoundary fallback={<div>Error occurred</div>}>
          <div>No error</div>
        </ErrorBoundary>
      </ServicesProvider>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });
});
```

### End-to-End Tests

End-to-end tests focus on testing the entire application from the user's perspective. They use Cypress as the testing framework.

Example end-to-end test for the assistant interaction:

```javascript
// cypress/integration/assistant.spec.js
describe('Assistant Interaction', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should respond to user input', () => {
    // Type a message in the input field
    cy.get('.prompt-input')
      .type('مرحبا')
      .should('have.value', 'مرحبا');

    // Click the send button
    cy.get('.submit-button').click();

    // Wait for the response
    cy.get('.response-box', { timeout: 10000 })
      .should('not.contain', 'أهلاً! كيف يمكنني مساعدتك اليوم؟')
      .should('contain', 'مرحبا');
  });

  it('should show loading indicator while processing', () => {
    // Type a message in the input field
    cy.get('.prompt-input')
      .type('كيف حالك')
      .should('have.value', 'كيف حالك');

    // Click the send button
    cy.get('.submit-button').click();

    // Check for loading indicator
    cy.get('.loading-indicator').should('be.visible');

    // Wait for the response
    cy.get('.response-box', { timeout: 10000 })
      .should('be.visible');

    // Loading indicator should be gone
    cy.get('.loading-indicator').should('not.exist');
  });
});
```

## Conclusion

The architectural patterns described in this document provide a solid foundation for the Mashaaer Enhanced Project. By following these patterns, developers can ensure that the application is maintainable, testable, and scalable.

For more information on specific implementations, refer to the source code and comments in the respective files.