@echo off
echo Starting npm installation fix...
powershell -ExecutionPolicy Bypass -File "%~dp0fix-npm-install.ps1"
echo.
echo If the script completed successfully, you can now run start-mashaaer.ps1 to start the application.
echo.
pause