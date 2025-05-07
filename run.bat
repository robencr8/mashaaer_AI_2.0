@echo off
echo ===================================================
echo    Mashaaer Enhanced Project - Run Application
echo ===================================================
echo.
echo This script will run the Mashaaer Enhanced application.
echo.

REM Check if enhanced-start.bat exists
if exist "%~dp0enhanced-start.bat" (
    echo Starting application with enhanced settings...
    call "%~dp0enhanced-start.bat"
) else (
    echo Enhanced start script not found, using standard start...
    if exist "%~dp0start.bat" (
        call "%~dp0start.bat"
    ) else (
        echo Standard start script not found, using npm start...
        npm start
    )
)

echo.
echo If you encounter any issues, please check the log files in the project directory.
pause