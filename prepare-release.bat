@echo off
echo ======================================================
echo   Mashaaer Enhanced Project - Prepare Release
echo ======================================================
echo.
echo Running prepare-release.ps1...
echo.

powershell -ExecutionPolicy Bypass -File prepare-release.ps1

echo.
if %ERRORLEVEL% EQU 0 (
    echo Release preparation completed successfully.
) else (
    echo Release preparation failed with error code %ERRORLEVEL%.
)

echo.
echo Press any key to exit...
pause > nul