@echo off
echo ===================================================
echo    Mashaaer Enhanced Project - Enhanced Starter
echo ===================================================
echo.
echo This script will ensure all components are properly initialized
echo and fix common issues with tokenizers and runtime.
echo.

REM Check if PowerShell is available
where powershell >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: PowerShell is required but not found.
    echo Please install PowerShell and try again.
    pause
    exit /b 1
)

echo Step 1: Fixing tokenizers installation...
powershell -ExecutionPolicy Bypass -Command "& '%~dp0fix-tokenizers-install.bat'"
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Tokenizers fix encountered issues but will continue...
)

echo.
echo Step 2: Running system diagnosis...
powershell -ExecutionPolicy Bypass -File "%~dp0diagnose.ps1"
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Diagnosis encountered issues but will continue...
)

echo.
echo Step 3: Setting up development environment...
REM Create .env.development if it doesn't exist
if not exist "%~dp0.env.development" (
    echo Creating development environment file...
    echo REACT_APP_AUTH_REQUIRED=false> "%~dp0.env.development"
    echo REACT_APP_SKIP_AUTH_FOR_VOICE=true>> "%~dp0.env.development"
    echo REACT_APP_BACKEND_URL=http://localhost:5000>> "%~dp0.env.development"
    echo REACT_APP_ENABLE_VOICE=true>> "%~dp0.env.development"
    echo REACT_APP_DEFAULT_VOICE_PROFILE=Aria>> "%~dp0.env.development"
)

echo.
echo Step 4: Starting Mashaaer Enhanced Project with enhanced settings...
powershell -ExecutionPolicy Bypass -Command "& {$env:REACT_APP_AUTH_REQUIRED='false'; $env:REACT_APP_SKIP_AUTH_FOR_VOICE='true'; $env:REACT_APP_ENABLE_VOICE='true'; $env:REACT_APP_DEFAULT_VOICE_PROFILE='Aria'; & '%~dp0start-mashaaer.ps1'}"

echo.
echo If you encounter any issues, please check the log files in the project directory.
pause
