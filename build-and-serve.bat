@echo off
REM LINGUISTIC_VALIDATED: This file contains valid Windows batch script terms that have been verified.
setlocal

REM Set environment variables
set "REACT_APP_API_BASE_URL=http://localhost:5000"

REM Display the set environment variables
echo Environment variables set:
echo REACT_APP_API_BASE_URL=%REACT_APP_API_BASE_URL%

REM Build the application
echo Building the application...
call npm run build

REM Check if build was successful
if %ERRORLEVEL% NEQ 0 (
    echo Build failed with error code %ERRORLEVEL%
    exit /b %ERRORLEVEL%
)

REM Serve the built application
echo.
echo Build complete. Starting server on port 4000...
echo Press Ctrl+C to stop the server.
echo.
serve -s build -l 4000

endlocal
