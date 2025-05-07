# How to Start the Mashaaer Enhanced Application

This document provides instructions on how to start the Mashaaer Enhanced application.

## Quick Start Method

The easiest way to start the application is to use one of the following methods:

### Method 1: Using start-app.bat (Recommended)

1. Navigate to the project directory (`mashaaer-enhanced-project`)
2. Double-click on `start-app.bat` or run it from the command prompt
3. The script will automatically use the most appropriate method to start the application

### Method 2: Using setup-and-run scripts from parent directory

If you're in the parent directory (`mashaaer-enhanced-final-updated`), you can use:

1. For PowerShell: Run `.\setup-and-run.ps1`
2. For Command Prompt: Run `setup-and-run.bat`

These scripts will:
- Create a virtual environment
- Install all necessary dependencies
- Run the application

## What Happens When You Start the App

When you start the application:

1. The backend (Flask) server will start in a separate window
2. The frontend (React) will start in your default web browser
3. You can interact with the application through the web interface

## Alternative Start Methods

If the recommended methods don't work, you can try these alternatives:

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