@echo off
echo ===================================================
echo    Mashaaer Enhanced Project - Full Application Runner
echo ===================================================
echo.
echo This script will run the Mashaaer application in full with all components.
echo.

REM Execute the enhanced-start.bat script which handles all setup and starts the application
call "%~dp0enhanced-start.bat"

echo.
echo If the application didn't start properly, please check the log files
echo in the project directory for error messages.
pause