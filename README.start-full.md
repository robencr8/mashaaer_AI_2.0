# Starting the Full Mashaaer Enhanced Application

This document explains how to start the complete Mashaaer Enhanced application, including both frontend and backend components.

## Quick Start

To start the full application with a single command, use the provided `start-full.bat` script:

```
.\start-full.bat
```

This script will:
1. Start the Flask backend server in a separate window
2. Start the React frontend application
3. Set up all necessary environment variables
4. Fix common issues with tokenizers and runtime

## What Happens Behind the Scenes

The `start-full.bat` script uses the existing application startup infrastructure:

1. It calls `run.bat`, which:
   - Tries to use `enhanced-start.bat` if available (recommended)
   - Falls back to `start.bat` if enhanced start is not available
   - Uses `npm start` as a last resort (frontend only)

2. The enhanced start script (`enhanced-start.bat`):
   - Fixes tokenizers installation issues
   - Runs system diagnosis
   - Sets up development environment variables
   - Starts both backend and frontend components

3. The main PowerShell script (`start-mashaaer.ps1`):
   - Sets up and verifies the Python virtual environment
   - Installs backend dependencies
   - Installs frontend dependencies
   - Starts the Flask backend server in a new window
   - Starts the React frontend in the current window

## Troubleshooting

If you encounter any issues:

1. Check the log files in the project directory (log_YYYY-MM-DD_HH-MM-SS.txt)
2. Make sure Python and Node.js are installed and in your PATH
3. Try running the enhanced start script directly: `.\enhanced-start.bat`
4. If backend issues persist, try running the backend manually:
   ```
   cd backend
   python app.py
   ```
5. If frontend issues persist, try running the frontend manually:
   ```
   npm start
   ```

## Requirements

- Python 3.x (Python 3.8-3.12 recommended for best compatibility)
- Node.js and npm
- PowerShell