@echo off
echo Setting up Python 3.13+ compatibility for Mashaaer Enhanced...
echo.

REM Check Python version
python --version
if %ERRORLEVEL% neq 0 (
    echo Python not found. Please make sure Python is installed and in your PATH.
    exit /b 1
)

REM Create a virtual environment
echo Creating virtual environment...
python -m venv venv
if %ERRORLEVEL% neq 0 (
    echo Failed to create virtual environment. Please make sure Python is installed correctly.
    exit /b 1
)

REM Activate the virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
if %ERRORLEVEL% neq 0 (
    echo Failed to activate virtual environment.
    exit /b 1
)

REM Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip
if %ERRORLEVEL% neq 0 (
    echo Failed to upgrade pip.
    exit /b 1
)

REM Install feedparser specifically
echo Installing feedparser specifically...
python -m pip install feedparser==6.0.10
if %ERRORLEVEL% neq 0 (
    echo Warning: Failed to install feedparser. AI news functionality will be disabled.
)

REM Install compatible dependencies
echo Installing other compatible dependencies...
python -m pip install -r backend\requirements.txt
if %ERRORLEVEL% neq 0 (
    echo Warning: Some dependencies may have failed to install.
    echo This is expected for packages not compatible with Python 3.13+.
    echo Basic functionality should still work.
)

echo.
echo Setup complete!
echo Note: Some advanced features requiring transformers/tokenizers will be disabled.
echo To use all features, please install Python 3.10 and run the original setup script.
echo.
echo To activate the virtual environment, run:
echo venv\Scripts\activate.bat
echo.
echo To run the application, run:
echo python backend\app.py
echo.

REM Keep the window open
pause
