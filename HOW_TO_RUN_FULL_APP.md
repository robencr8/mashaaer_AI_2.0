# How to Run Mashaaer Enhanced Project in Full

This guide explains how to run the Mashaaer Enhanced Project with all components fully activated.

## Quick Start

To run the application in full:

1. Double-click the `run-mashaaer-full.bat` file in the project root directory
   - If running from PowerShell or Command Prompt, use `.\run-mashaaer-full.bat`
2. Wait for the system to initialize (this may take a few minutes the first time)
3. Once the system is running, you should see both the backend and frontend active
4. The UI should be fully functional with voice capabilities enabled

## What This Script Does

The `run-mashaaer-full.bat` script:

1. Calls the `enhanced-start.bat` script which:
   - Fixes tokenizers installation issues
   - Runs system diagnosis to check for potential problems
   - Sets up the development environment with proper configuration
   - Starts both the frontend and backend components with all features enabled

## Troubleshooting

If you encounter issues:

1. **Backend Not Starting**: Check the log files in the project directory for error messages
2. **Voice Not Working**: Ensure your browser allows microphone access and audio playback
3. **UI Not Loading**: Check the browser console for error messages
4. **Tokenizers Issues**: The script should automatically fix tokenizers installation problems

## Alternative Methods

If you prefer more control over the startup process:

1. You can run `enhanced-start.bat` directly for the same functionality
2. For advanced users, you can run `start-mashaaer.ps1` from PowerShell with specific environment variables

For more detailed information about Mashaaer's features and capabilities, refer to the main [README.md](README.md) file or the [ENHANCED_START_GUIDE.md](ENHANCED_START_GUIDE.md).