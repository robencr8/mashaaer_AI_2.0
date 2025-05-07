@echo off
echo ===================================================
echo    Mashaaer Enhanced Project - Build and Deploy
echo ===================================================
echo.
echo This script will build the React application and deploy it to the Flask backend.
echo.

REM Execute the PowerShell script with bypass execution policy
powershell -ExecutionPolicy Bypass -File "%~dp0build-and-copy.ps1"

echo.
echo If the build was successful, you can now run the Flask application to serve the React frontend.
echo Try accessing the application at:
echo   - http://localhost:5000/
echo   - http://localhost:5000/launch
echo   - http://localhost:5000/index
echo   - http://localhost:5000/static/index.html
echo.
echo To start the Flask application, run: python backend/app.py
echo.
pause