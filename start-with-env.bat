@echo off
setlocal

REM Set environment variables
set "REACT_APP_API_BASE_URL=http://localhost:5000"

REM Display the set environment variables
echo Environment variables set:
echo REACT_APP_API_BASE_URL=%REACT_APP_API_BASE_URL%

REM Run the application
echo Starting the application...
npm run start

endlocal