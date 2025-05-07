@echo off
echo ===================================================
echo    Mashaaer Enhanced Project - Electron Launcher
echo ===================================================
echo.
echo This script will start the Mashaaer Enhanced application in Electron.
echo Both the Flask backend and Electron frontend will be launched.
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is required but not found.
    echo Please install Node.js and try again.
    pause
    exit /b 1
)

REM Check if Python is installed
where python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Python is required but not found.
    echo Please install Python and try again.
    pause
    exit /b 1
)

echo Starting Mashaaer Enhanced in Electron...
echo.
echo This will start both the Flask backend server and the Electron app.
echo Please wait while the application starts...
echo.

REM Run the start-electron npm script
npm run start-electron

echo.
echo If you encounter any issues, please check the electron-app-launcher.log file
echo in the project directory for error messages.
pause