# Mashaaer Enhanced Project - System Bootstrapping

This document explains the system bootstrapping process for the Mashaaer Enhanced Project, including how to initialize both frontend and backend components.

## Overview

The Mashaaer Enhanced Project uses a comprehensive bootstrapping process to initialize all system components in the correct order, ensuring proper dependency management and error handling. The bootstrapping process includes:

1. Starting the backend server
2. Initializing backend components (MemoryStore, MemoryIndexer, SystemMetrics, etc.)
3. Starting the frontend application
4. Initializing frontend services (ConfigService, LoggingService, EmotionService, etc.)
5. Monitoring system health

## Bootstrapping Script

The project includes a PowerShell script (`bootstrap.ps1`) that automates the bootstrapping process. This script:

- Checks prerequisites (Node.js, npm, Python, pip)
- Installs dependencies for both frontend and backend
- Creates and activates a Python virtual environment
- Starts the Flask backend server
- Starts the React frontend application
- Opens the system metrics dashboard

### Usage

To bootstrap the entire system:

```powershell
# Run with administrator privileges
powershell -ExecutionPolicy Bypass -File bootstrap.ps1
```

## Frontend Bootstrapping

The frontend uses a service-based architecture with dependency injection. The bootstrapping process is managed by the `SystemBootstrapService`, which:

1. Checks backend connectivity
2. Initializes all frontend services in the correct order
3. Tracks initialization status
4. Provides system status reporting

### SystemBootstrapService

The `SystemBootstrapService` is responsible for initializing all frontend services. It ensures that services are initialized in the correct order, with proper dependency management.

```javascript
// Example usage in code
import { systemBootstrapService } from './services/bootstrap/system-bootstrap-service';

// Initialize all services
const services = await systemBootstrapService.initialize(config);

// Get system status
const status = systemBootstrapService.getSystemStatusReport();
```

### Service Initialization Order

Services are initialized in the following order to ensure proper dependency management:

1. ConfigService - Loads configuration from various sources
2. LoggingService - Provides logging capabilities
3. ErrorService - Handles error reporting and recovery
4. StateManagementService - Manages application state
5. ApiService - Handles API communication with the backend
6. MemoryService - Manages memory storage and retrieval
7. EmotionService - Handles emotion detection and tracking
8. ThemeService - Manages UI theme based on emotions
9. VoiceService - Handles voice input and output
10. AssistantService - Provides the core assistant functionality

## Backend Bootstrapping

The backend is a Flask application that initializes several components:

1. MemoryStore - Stores and retrieves memories
2. MemoryIndexer - Provides advanced memory indexing and searching
3. SystemMetrics - Collects system performance metrics
4. AI News routes and initialization
5. Emotion timeline API

The backend initialization happens in `app.py` when the Flask application starts.

## System Status Monitoring

The system includes a `SystemStatus` component that displays the current status of all services. This component:

- Shows which services are initialized and which are not
- Provides a summary of system health
- Allows retrying initialization of failed services
- Updates status information in real-time

To include the SystemStatus component in your application:

```jsx
import SystemStatus from './ui/components/SystemStatus';

// In your component's render method
<SystemStatus showDetailed={false} />
```

## Troubleshooting

If you encounter issues during bootstrapping:

1. Check the console for error messages
2. Verify that all prerequisites are installed
3. Check backend connectivity
4. Examine the SystemStatus component for failed services
5. Try restarting the bootstrapping process

## Advanced Configuration

The bootstrapping process can be configured through the `mashaaer.config.js` file or environment variables. See the [configuration documentation](/src/config/README.md) for details.

## Development Workflow

During development, you can use the following workflow:

1. Start the backend server:
   ```
   cd backend
   python -m flask run
   ```

2. Start the frontend development server:
   ```
   npm start
   ```

3. Monitor system status through the SystemStatus component

This approach allows you to develop and test individual components without bootstrapping the entire system.