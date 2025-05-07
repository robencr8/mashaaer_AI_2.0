@echo off
echo ===================================================
echo    Mashaaer Enhanced Project - Flask Server
echo ===================================================
echo.
echo This script will start the Flask server to serve the React frontend.
echo.

REM Activate virtual environment if it exists
if exist "venv\Scripts\activate.bat" (
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
)

echo Starting Flask server...
python backend\app.py

echo.
echo If you encounter any issues, please check the Flask server logs.
echo.
pause