@echo off
echo Running Mashaaer Enhanced with Python 3.13+...
echo.

REM Check if virtual environment exists
if not exist venv (
    echo Virtual environment not found. Please run setup-python313.bat first.
    exit /b 1
)

REM Activate the virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
if %ERRORLEVEL% neq 0 (
    echo Failed to activate virtual environment.
    exit /b 1
)

REM Set environment variables
set FLASK_APP=backend\app.py
set FLASK_ENV=development
set DEBUG=true

REM Run the Flask application
echo Starting Flask application...
echo Note: Some advanced features requiring transformers/tokenizers will be disabled.
echo To use all features, please install Python 3.10 and run the original setup script.
echo.
echo Press Ctrl+C to stop the application.
echo.

python backend\app.py

REM Deactivate the virtual environment
call deactivate

REM Keep the window open if there was an error
if %ERRORLEVEL% neq 0 (
    echo An error occurred while running the application.
    pause
    exit /b 1
)