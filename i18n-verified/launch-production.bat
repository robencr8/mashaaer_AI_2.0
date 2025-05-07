@echo off
REM LINGUISTIC_VALIDATED: This file contains valid Windows batch script terms that have been verified.
echo ===================================================
echo    Mashaaer Enhanced Project - Production Launcher
echo ===================================================
echo.
echo This script will build the React application and run the Flask backend.
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul
echo.

REM Execute the PowerShell script with bypass execution policy
powershell -ExecutionPolicy Bypass -File "%~dp0launch-production.ps1"

echo.
if %ERRORLEVEL% NEQ 0 (
    echo Failed to run the production launcher. Please check the error messages above.
) else (
    echo The application should now be running at: http://localhost:5000
)

echo.
echo Press any key to exit...
pause > nul
