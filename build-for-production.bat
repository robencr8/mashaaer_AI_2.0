@echo off
echo ===================================================
echo    Mashaaer Enhanced - Production Build Script
echo ===================================================
echo.

echo This script will build the application for production deployment.
echo.

echo Step 1: Building the React frontend for production...
echo.
call npm install
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to install npm dependencies.
    pause
    exit /b 1
)

call npm run build
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to build the React application.
    pause
    exit /b 1
)
echo Frontend build completed successfully.
echo.

echo Step 2: Preparing the backend for production...
echo.
cd backend
pip install -r requirements.txt
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to install Python dependencies.
    cd ..
    pause
    exit /b 1
)

echo Installing waitress for Windows production deployment...
pip install waitress
if %ERRORLEVEL% neq 0 (
    echo Warning: Failed to install waitress. You may need to install it manually.
)
cd ..
echo Backend preparation completed successfully.
echo.

echo Step 3: Creating deployment artifacts...
echo.

REM Create a zip file of the build directory for Netlify deployment
echo Creating frontend deployment package...
powershell -Command "Compress-Archive -Path build\* -DestinationPath frontend-deploy.zip -Force"
if %ERRORLEVEL% neq 0 (
    echo Warning: Failed to create frontend deployment package.
) else (
    echo Frontend deployment package created: frontend-deploy.zip
)

REM Create a zip file of the backend directory for Render/Fly.io deployment
echo Creating backend deployment package...
powershell -Command "Compress-Archive -Path backend\* -DestinationPath backend-deploy.zip -Force"
if %ERRORLEVEL% neq 0 (
    echo Warning: Failed to create backend deployment package.
) else (
    echo Backend deployment package created: backend-deploy.zip
)

echo.
echo Production build process completed.
echo.
echo The following files have been created:
echo - build/           : React production build (for Netlify)
echo - frontend-deploy.zip : Zipped frontend for manual upload
echo - backend-deploy.zip  : Zipped backend for manual upload
echo.
echo For deployment instructions, please refer to README_PROD.md
echo.
echo To test the production build locally:
echo 1. In one terminal: python -m waitress-serve --port=5000 backend:app
echo 2. In another terminal: npx serve -s build
echo.
pause