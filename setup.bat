@echo off
echo ===================================
echo    MASHAAER PROJECT SETUP SCRIPT
echo ===================================
echo.
echo This script will set up the Mashaaer Enhanced project.
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

echo.
echo Running setup script...
node scripts\setup.js

echo.
if %ERRORLEVEL% EQU 0 (
  echo Setup completed successfully!
) else (
  echo Setup encountered some issues. Please check the output above.
)

echo.
echo Press any key to exit...
pause > nul