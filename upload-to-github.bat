@echo off
echo ===================================================
echo    Mashaaer Enhanced Project - Upload to GitHub
echo ===================================================
echo.
echo This script will upload the distributable to GitHub Releases.
echo.
echo Prerequisites:
echo - GitHub repository for the project
echo - GitHub personal access token with 'repo' scope
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul
echo.

REM Execute the PowerShell script with bypass execution policy
powershell -ExecutionPolicy Bypass -File "%~dp0upload-to-github.ps1"

echo.
if %ERRORLEVEL% NEQ 0 (
    echo Failed to upload to GitHub. Please check the error messages above.
) else (
    echo Upload to GitHub completed successfully.
)

echo.
echo Press any key to exit...
pause > nul