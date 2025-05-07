# How to Start the Mashaaer Enhanced Application

This document provides instructions on how to start the Mashaaer Enhanced application.

## Quick Start

The easiest way to start the application is to use the provided `start-app.bat` script:

1. Double-click on `start-app.bat` in the project directory
2. The script will automatically use the most appropriate method to start the application

## What the Script Does

The `start-app.bat` script will:

1. Try to use `start-full.bat` (the most comprehensive start script)
2. If that's not available, it will try `run.bat`
3. If that's not available, it will try `enhanced-start.bat`
4. If that's not available, it will try `start.bat`
5. As a last resort, it will use `npm start`

This ensures that the application will start using the best available method, with fallbacks if any script is missing.

## Alternative Start Methods

If you prefer, you can also use any of these methods directly:

- `start-full.bat` - Starts the complete application (frontend and backend)
- `run.bat` - Runs the application using enhanced settings if available
- `enhanced-start.bat` - Starts with enhanced settings and fixes common issues
- `start.bat` - Basic start script
- `npm start` - Starts using npm (requires Node.js)

## Troubleshooting

If you encounter any issues:

1. Check the log files in the project directory
2. Try running `fix-npm-install.bat` if you have dependency issues
3. Try running `fix-react-dev-utils.bat` if you have issues with react-dev-utils
4. Try running `fix-tokenizers-install.bat` if you have issues with tokenizers

For more detailed information, refer to:
- README.md - Main documentation
- ENHANCED_START_GUIDE.md - Guide for enhanced start
- HOW_TO_RUN_FULL_APP.md - Guide for running the full application