@echo off
echo ===================================================
echo    Mashaaer Enhanced Project - Upload to Google Drive
echo ===================================================
echo.
echo This script will upload the distributable to Google Drive.
echo.
echo Prerequisites:
echo - GoogleDrive PowerShell module installed
echo - Google account with access to Google Drive
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul
echo.

REM Execute the PowerShell script with bypass execution policy
powershell -ExecutionPolicy Bypass -File "%~dp0upload-to-gdrive.ps1"

echo.
if %ERRORLEVEL% NEQ 0 (
    echo Failed to upload to Google Drive. Please check the error messages above.
) else (
    echo Upload to Google Drive completed successfully.
)

echo.
echo Press any key to exit...
pause > nul