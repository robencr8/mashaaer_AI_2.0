@echo off
echo ===================================================
echo    Mashaaer Enhanced - Test Production Build
echo ===================================================
echo.

echo This script will test the production build locally.
echo.

REM Check if build directory exists
if not exist "build" (
    echo Error: Build directory not found. Please run build-for-production.bat first.
    pause
    exit /b 1
)

REM Check if backend directory exists
if not exist "backend" (
    echo Error: Backend directory not found.
    pause
    exit /b 1
)

echo Starting the backend server with waitress...
echo.
echo Opening a new terminal window for the backend server...
start cmd /k "cd backend && python -m waitress-serve --port=5000 app:app"

echo.
echo Waiting for backend server to start...
timeout /t 5 /nobreak > nul

echo.
echo Starting the frontend server...
echo.
npx serve -s build

if %ERRORLEVEL% neq 0 (
    echo Installing serve package...
    npm install -g serve
    serve -s build
)

echo.
echo Test completed. Press any key to stop the servers and exit...
pause

echo Stopping servers...
taskkill /f /im python.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1
echo Done.