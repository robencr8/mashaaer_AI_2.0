@echo off
echo ===================================================
echo Mashaaer Enhanced - Frontend Build Utility
echo ===================================================
echo.
echo This script will build the React frontend and copy it to the Flask backend
echo to fix the blank page issue.
echo.
echo Please make sure you have Node.js and npm installed before proceeding.
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

echo.
echo Step 1: Installing dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to install dependencies.
    echo Please make sure Node.js and npm are installed correctly.
    pause
    exit /b 1
)

echo.
echo Step 2: Building React frontend...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to build React frontend.
    pause
    exit /b 1
)

echo.
echo Step 3: Copying build files to Flask backend...
if not exist build (
    echo Error: Build directory not found.
    pause
    exit /b 1
)

if not exist backend\static (
    mkdir backend\static
    echo Created backend\static directory.
)

xcopy /E /I /Y build\* backend\static
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to copy build files to backend\static.
    pause
    exit /b 1
)

echo.
echo Step 4: Creating template files...
if not exist backend\templates (
    mkdir backend\templates
    echo Created backend\templates directory.
)

echo ^<!DOCTYPE html^> > backend\templates\index.html
echo ^<html^> >> backend\templates\index.html
echo ^<head^> >> backend\templates\index.html
echo     ^<meta charset="UTF-8"^> >> backend\templates\index.html
echo     ^<meta http-equiv="refresh" content="0;url=/static/index.html"^> >> backend\templates\index.html
echo     ^<title^>Mashaaer Enhanced^</title^> >> backend\templates\index.html
echo ^</head^> >> backend\templates\index.html
echo ^<body^> >> backend\templates\index.html
echo     ^<p^>If you are not redirected automatically, follow this ^<a href="/static/index.html"^>link to the application^</a^>.^</p^> >> backend\templates\index.html
echo ^</body^> >> backend\templates\index.html
echo ^</html^> >> backend\templates\index.html

echo.
echo ===================================================
echo Success! The frontend has been built and copied to the backend.
echo.
echo To run the application:
echo 1. Open a command prompt
echo 2. Navigate to the backend directory: cd backend
echo 3. Run the Flask application: python app.py
echo 4. Open your browser and go to: http://127.0.0.1:5000
echo ===================================================
echo.
echo Press any key to exit...
pause > nul