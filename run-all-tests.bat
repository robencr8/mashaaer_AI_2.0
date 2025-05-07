@echo off
echo Running all Mashaaer Enhanced tests...
node scripts/run-all-tests.js
if %ERRORLEVEL% EQU 0 (
  echo All tests completed successfully.
) else (
  echo Some tests failed with error code %ERRORLEVEL%.
)
pause