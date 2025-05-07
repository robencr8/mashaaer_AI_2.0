@echo off
echo ===================================================
echo Mashaaer Enhanced - Fix Frontend Paths Utility
echo ===================================================
echo.
echo This script will update the launch.html template to reference the correct files with hashes.
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

echo.
echo Step 1: Finding CSS and JS files with hashes...

REM Extract filenames from index.html
echo Extracting filenames from index.html...
set "cssFilename="
set "jsFilename="

for /f "tokens=*" %%a in ('findstr /C:"href=\"/static/css/main" backend\static\index.html') do (
    for /f "tokens=2 delims=/" %%b in ("%%a") do (
        for /f "tokens=2 delims==" %%c in ("%%b") do (
            set "cssPath=%%c"
            set "cssPath=!cssPath:~1,-1!"
            for /f "tokens=3 delims=/" %%d in ("!cssPath!") do (
                set "cssFilename=%%d"
            )
        )
    )
)

for /f "tokens=*" %%a in ('findstr /C:"src=\"/static/js/main" backend\static\index.html') do (
    for /f "tokens=2 delims=/" %%b in ("%%a") do (
        for /f "tokens=2 delims==" %%c in ("%%b") do (
            set "jsPath=%%c"
            set "jsPath=!jsPath:~1,-1!"
            for /f "tokens=3 delims=/" %%d in ("!jsPath!") do (
                set "jsFilename=%%d"
            )
        )
    )
)

REM If extraction failed, use a simpler method
if "%cssFilename%"=="" (
    echo Using simpler extraction method...
    for /f "tokens=3 delims=/" %%a in ('findstr /C:"href=\"/static/css/main" backend\static\index.html') do (
        set "cssFilename=%%a"
        set "cssFilename=!cssFilename:~0,-1!"
    )
)

if "%jsFilename%"=="" (
    for /f "tokens=3 delims=/" %%a in ('findstr /C:"src=\"/static/js/main" backend\static\index.html') do (
        set "jsFilename=%%a"
        set "jsFilename=!jsFilename:~0,-2!"
    )
)

REM If still failed, use hardcoded values from the most recent build
if "%cssFilename%"=="" (
    echo Using hardcoded values from the most recent build...
    set "cssFilename=main.1d114b90.css"
)

if "%jsFilename%"=="" (
    set "jsFilename=main.522053f4.js"
)

echo Found CSS filename: %cssFilename%
echo Found JS filename: %jsFilename%

echo.
echo Step 2: Updating launch.html template...

REM Create the launch.html file
echo ^<!DOCTYPE html^> > backend\templates\launch.html
echo ^<html lang="en"^> >> backend\templates\launch.html
echo ^<head^> >> backend\templates\launch.html
echo     ^<meta charset="UTF-8"^> >> backend\templates\launch.html
echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^> >> backend\templates\launch.html
echo     ^<title^>Mashaaer Enhanced^</title^> >> backend\templates\launch.html
echo     ^<link rel="stylesheet" href="/static/static/css/%cssFilename%"^> >> backend\templates\launch.html
echo ^</head^> >> backend\templates\launch.html
echo ^<body^> >> backend\templates\launch.html
echo     ^<div id="root"^>^</div^> >> backend\templates\launch.html
echo     ^<script src="/static/cosmic-theme.js"^>^</script^> >> backend\templates\launch.html
echo     ^<script src="/static/static/js/%jsFilename%"^>^</script^> >> backend\templates\launch.html
echo ^</body^> >> backend\templates\launch.html
echo ^</html^> >> backend\templates\launch.html

echo.
echo ===================================================
echo Success! The launch.html template has been updated.
echo.
echo To run the application:
echo 1. Open a command prompt
echo 2. Navigate to the backend directory: cd backend
echo 3. Run the Flask application: python app.py
echo 4. Open your browser and go to: http://127.0.0.1:5000/launch
echo ===================================================
echo.
echo Press any key to exit...
pause > nul