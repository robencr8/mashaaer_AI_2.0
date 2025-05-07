@echo off
echo Testing fix for "application not working" issue...
powershell -ExecutionPolicy Bypass -File "%~dp0test-fix.ps1"
echo.
echo If the test completed successfully, you can now run start-mashaaer.ps1 to start the full application.
echo.
pause