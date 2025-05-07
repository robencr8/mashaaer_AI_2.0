@echo off
echo Starting fix for npm test issues...
echo.

echo Removing node_modules and package-lock.json...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo.
echo Installing react-scripts v4.0.3 explicitly...
call npm install --save react-scripts@4.0.3

echo.
echo Reinstalling all dependencies...
call npm install

echo.
echo Running tests to verify the fix...
call npm test

echo.
echo Fix process completed!
echo If tests are still failing, please check the console output for errors.
pause