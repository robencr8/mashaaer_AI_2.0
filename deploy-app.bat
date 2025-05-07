@echo off
echo Mashaaer Enhanced Project - Deployment Tool
echo ==========================================
echo.
echo This script will help you deploy the application to a platform.
echo.
echo Please select a deployment platform:
echo 1. Netlify
echo 2. Vercel
echo 3. GitHub Pages
echo.
echo Enter your choice (1-3) or press Ctrl+C to cancel:
set /p choice=

if "%choice%"=="1" (
    echo.
    echo Deploying to Netlify...
    echo.
    echo Prerequisites:
    echo - Netlify CLI installed (npm install -g netlify-cli)
    echo - Logged in to Netlify (netlify login)
    echo.
    echo Press any key to continue or Ctrl+C to cancel...
    pause > nul
    npm run deploy:netlify
) else if "%choice%"=="2" (
    echo.
    echo Deploying to Vercel...
    echo.
    echo Prerequisites:
    echo - Vercel CLI installed (npm install -g vercel)
    echo - Logged in to Vercel (vercel login)
    echo.
    echo Press any key to continue or Ctrl+C to cancel...
    pause > nul
    npm run deploy:vercel
) else if "%choice%"=="3" (
    echo.
    echo Deploying to GitHub Pages...
    echo.
    echo Prerequisites:
    echo - gh-pages package installed (npm install --save-dev gh-pages)
    echo.
    echo Press any key to continue or Ctrl+C to cancel...
    pause > nul
    npm run deploy:gh-pages
) else (
    echo.
    echo Invalid choice. Please run the script again and select a valid option.
    echo.
    echo Press any key to exit...
    pause > nul
    exit /b 1
)

echo.
echo Deployment completed. Check the console output for any errors or success messages.
echo.
echo Press any key to exit...
pause > nul