@echo off
echo ===================================================
echo    Mashaaer Enhanced - Fix for MODULE_NOT_FOUND Error
echo ===================================================
echo.
echo This script will fix the MODULE_NOT_FOUND error related to lodash
echo that commonly occurs with Node.js v22+ and react-scripts/html-webpack-plugin.
echo.
echo The script will:
echo  1. Check your Node.js version for compatibility
echo  2. Clean node_modules and package-lock.json
echo  3. Reinstall dependencies with proper configuration
echo  4. Verify critical packages including lodash modules
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0fix-lodash-error.ps1"

echo.
echo If the script completed successfully, you can now run the application with:
echo  - npm start
echo  - npm run dev
echo  - .\start-app.bat
echo.
pause