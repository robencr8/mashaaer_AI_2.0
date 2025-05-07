@echo off
echo Running Mashaaer Enhanced App Tests...
node scripts/test-app.js
if %ERRORLEVEL% EQU 0 (
  echo Test completed successfully.
) else (
  echo Test failed with error code %ERRORLEVEL%.
)
pause