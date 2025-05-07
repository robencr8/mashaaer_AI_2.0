# How to Run Mashaaer Enhanced Project

This document provides instructions on how to run the Mashaaer Enhanced Project application.

## Quick Start

The simplest way to run the application is to use the `run-app.bat` script:

1. Double-click on `run-app.bat` in the project root directory
2. The application will start automatically using the most appropriate method

Alternatively, you can use the `run.bat` script:

1. Double-click on `run.bat` in the project root directory
2. The application will start automatically using the most appropriate method

## Alternative Methods

If you prefer, you can use one of the following alternative methods to run the application:

### Unified Start Script

The `start-app.bat` script provides a unified way to start the application:

1. Double-click on `start-app.bat` in the project root directory
2. This script will:
   - Try to use `start-full.bat` (the most comprehensive start script)
   - If that's not available, it will try `run.bat`
   - If that's not available, it will try `enhanced-start.bat`
   - If that's not available, it will try `start.bat`
   - As a last resort, it will use `npm start`

### Enhanced Start (Recommended)

The enhanced start script provides the most comprehensive setup and configuration:

1. Double-click on `enhanced-start.bat` in the project root directory
2. This script will:
   - Fix tokenizers installation issues
   - Run system diagnosis
   - Set up development environment
   - Start the application with enhanced settings

### Standard Start

The standard start script provides basic functionality:

1. Double-click on `start.bat` in the project root directory
2. This script will:
   - Run directory diagnosis
   - Start the Mashaaer Enhanced Project

### Using npm

If you prefer to use npm directly:

```
npm start
```

This will start the React frontend application. Note that you may need to start the backend separately.

### Using PowerShell

If you prefer to use PowerShell directly:

```
powershell -ExecutionPolicy Bypass -File start-mashaaer.ps1
```

This will run the main startup script that handles both frontend and backend.

## Troubleshooting

If you encounter any issues running the application:

1. Check the log files in the project directory (look for files with names like `log_YYYY-MM-DD_HH-mm-ss.txt`)
2. Try using the unified start script (`start-app.bat`) which will attempt multiple start methods
3. Try running the application with the enhanced start script (`enhanced-start.bat`)
4. If installation issues persist, try running `fix-npm-install.bat` or `fix-tokenizers-install.bat`
5. Refer to the main README.md file and HOW_TO_START_APP.md for more detailed troubleshooting information
