@echo off
echo Build and Copy Script for Mashaaer Enhanced Project
echo This script builds the React application and copies the output to the Flask backend
echo.

REM Set the source and destination directories
set sourceDir=.\build
set staticDestDir=.\backend\static
set templatesDestDir=.\backend\templates

REM Create a timestamp for logging
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c-%%a-%%b)
for /f "tokens=1-2 delims=: " %%a in ('time /t') do (set mytime=%%a-%%b)
set timestamp=%mydate%_%mytime%
set logFile=build-and-copy_%timestamp%.log

REM Initialize log file
echo [%timestamp%] Build and Copy Process Started > %logFile%

REM Step 1: Build the React application
echo [INFO] Step 1: Building React application...
echo [INFO] Step 1: Building React application... >> %logFile%
call npm run build
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to build React application. Error code: %ERRORLEVEL%
    echo [ERROR] Failed to build React application. Error code: %ERRORLEVEL% >> %logFile%
    exit /b 1
)
echo [INFO] React application built successfully
echo [INFO] React application built successfully >> %logFile%

REM Step 2: Check if build directory exists
echo [INFO] Step 2: Checking build directory...
echo [INFO] Step 2: Checking build directory... >> %logFile%
if not exist %sourceDir% (
    echo [ERROR] Build directory not found at %sourceDir%
    echo [ERROR] Build directory not found at %sourceDir% >> %logFile%
    exit /b 1
)
echo [INFO] Build directory found at %sourceDir%
echo [INFO] Build directory found at %sourceDir% >> %logFile%

REM Step 3: Copy files to static directory
echo [INFO] Step 3: Copying files to Flask static directory...
echo [INFO] Step 3: Copying files to Flask static directory... >> %logFile%

REM Clear the destination directory first
if exist %staticDestDir% (
    del /q /s %staticDestDir%\*
    echo [INFO] Cleared existing files in static directory
    echo [INFO] Cleared existing files in static directory >> %logFile%
)

REM Copy all files from build directory to static directory
xcopy %sourceDir%\* %staticDestDir% /E /I /Y
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Error copying files to static directory
    echo [ERROR] Error copying files to static directory >> %logFile%
    exit /b 1
)
echo [INFO] Files copied to static directory successfully
echo [INFO] Files copied to static directory successfully >> %logFile%

REM Step 4: Create index.html in templates directory
echo [INFO] Step 4: Creating index.html in templates directory...
echo [INFO] Step 4: Creating index.html in templates directory... >> %logFile%

REM Create a simple index.html file that redirects to the static/index.html
echo ^<!DOCTYPE html^> > %templatesDestDir%\index.html
echo ^<html^> >> %templatesDestDir%\index.html
echo ^<head^> >> %templatesDestDir%\index.html
echo     ^<meta charset="UTF-8"^> >> %templatesDestDir%\index.html
echo     ^<meta http-equiv="refresh" content="0;url=/static/index.html"^> >> %templatesDestDir%\index.html
echo     ^<title^>Mashaaer Enhanced^</title^> >> %templatesDestDir%\index.html
echo ^</head^> >> %templatesDestDir%\index.html
echo ^<body^> >> %templatesDestDir%\index.html
echo     ^<p^>If you are not redirected automatically, follow this ^<a href="/static/index.html"^>link to the application^</a^>.^</p^> >> %templatesDestDir%\index.html
echo ^</body^> >> %templatesDestDir%\index.html
echo ^</html^> >> %templatesDestDir%\index.html

echo [INFO] Created index.html in templates directory
echo [INFO] Created index.html in templates directory >> %logFile%

REM Step 5: Create launch.html in templates directory (alternative entry point)
echo [INFO] Step 5: Creating launch.html in templates directory...
echo [INFO] Step 5: Creating launch.html in templates directory... >> %logFile%

REM Create a launch.html file that loads the React application
echo ^<!DOCTYPE html^> > %templatesDestDir%\launch.html
echo ^<html lang="en"^> >> %templatesDestDir%\launch.html
echo ^<head^> >> %templatesDestDir%\launch.html
echo     ^<meta charset="UTF-8"^> >> %templatesDestDir%\launch.html
echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^> >> %templatesDestDir%\launch.html
echo     ^<title^>Mashaaer Enhanced^</title^> >> %templatesDestDir%\launch.html
echo     ^<link rel="stylesheet" href="/static/css/main.css"^> >> %templatesDestDir%\launch.html
echo ^</head^> >> %templatesDestDir%\launch.html
echo ^<body^> >> %templatesDestDir%\launch.html
echo     ^<div id="root"^>^</div^> >> %templatesDestDir%\launch.html
echo     ^<script^> >> %templatesDestDir%\launch.html
echo         // Dynamically load the main JS file from static directory >> %templatesDestDir%\launch.html
echo         const script = document.createElement('script'); >> %templatesDestDir%\launch.html
echo         script.src = '/static/js/main.js'; >> %templatesDestDir%\launch.html
echo         document.body.appendChild(script); >> %templatesDestDir%\launch.html
echo     ^</script^> >> %templatesDestDir%\launch.html
echo ^</body^> >> %templatesDestDir%\launch.html
echo ^</html^> >> %templatesDestDir%\launch.html

echo [INFO] Created launch.html in templates directory
echo [INFO] Created launch.html in templates directory >> %logFile%

echo.
echo [INFO] Build and copy process completed successfully!
echo [INFO] Build and copy process completed successfully! >> %logFile%
echo [INFO] The React application has been built and copied to the Flask backend.
echo [INFO] The React application has been built and copied to the Flask backend. >> %logFile%
echo [INFO] You can now run the Flask application to serve the React frontend.
echo [INFO] You can now run the Flask application to serve the React frontend. >> %logFile%

pause