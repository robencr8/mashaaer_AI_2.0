@echo off
echo ===================================================
echo    Mashaaer Enhanced Project - Create Distributable
echo ===================================================
echo.
echo This script will create a zipped distributable version of the Mashaaer Enhanced application.
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul
echo.

REM Execute the PowerShell script with bypass execution policy
powershell -ExecutionPolicy Bypass -File "%~dp0create-distributable.ps1"

echo.
if %ERRORLEVEL% NEQ 0 (
    echo Failed to create distributable. Please check the error messages above.
) else (
    echo Distributable created successfully. Check the dist directory for the output files.
)

echo.
echo Press any key to exit...
pause > nul