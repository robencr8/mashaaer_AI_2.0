@echo off
setlocal

REM Set environment variables
set "REACT_APP_API_BASE_URL=http://localhost:5000"

REM Display the set environment variables
echo Environment variables set:
echo REACT_APP_API_BASE_URL=%REACT_APP_API_BASE_URL%

REM Build the application
echo Building the application...
npm run build

REM Serve the built application (optional)
echo.
echo Build complete. To serve the application, run:
echo serve -s build -l 4000

endlocal