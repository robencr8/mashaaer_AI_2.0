@echo off
echo Testing PWA Offline Mode...
echo.
echo This script will:
echo - Start a local server to serve the build directory
echo - Open the application in your default browser
echo - Provide instructions for testing offline mode
echo.
echo Make sure you have built the application first with:
echo npm run build
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

npm run test:pwa-offline