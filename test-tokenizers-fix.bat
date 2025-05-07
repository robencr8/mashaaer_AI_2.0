@echo off
setlocal enabledelayedexpansion

echo ========================================================================
echo Tokenizers Installation Fix Test Script
echo ========================================================================
echo.

:: Check if Python is installed
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Please install Python and try again.
    goto :error
)

:: Create a temporary virtual environment for testing
set TEST_ENV_DIR=test_venv
if exist %TEST_ENV_DIR% (
    echo [INFO] Removing existing test environment...
    rmdir /s /q %TEST_ENV_DIR%
)

echo [INFO] Creating test virtual environment...
python -m venv %TEST_ENV_DIR%
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to create test virtual environment
    goto :error
)

:: Activate the test virtual environment
echo [INFO] Activating test virtual environment...
call %TEST_ENV_DIR%\Scripts\activate.bat
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to activate test virtual environment
    goto :error
)

:: Upgrade pip
echo [INFO] Upgrading pip...
python -m pip install --upgrade pip
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Failed to upgrade pip, continuing anyway...
)

:: Get Python version
for /f "tokens=2" %%V in ('python --version 2^>^&1') do set PYTHON_VERSION=%%V
echo [INFO] Detected Python version: %PYTHON_VERSION%

:: Check Python version compatibility with tokenizers
for /f "tokens=1,2 delims=." %%a in ("%PYTHON_VERSION%") do (
    set PYTHON_MAJOR=%%a
    set PYTHON_MINOR=%%b
)

:: Get Python implementation details for wheel compatibility
for /f "tokens=*" %%i in ('python -c "import sys, platform; print(sys.implementation.name + ',' + platform.machine())"') do set PYTHON_INFO=%%i
for /f "tokens=1,2 delims=," %%a in ("%PYTHON_INFO%") do (
    set PYTHON_IMPL=%%a
    set PYTHON_ARCH=%%b
)

:: Map architecture to wheel format
set WHEEL_ARCH=win_amd64
if "%PYTHON_ARCH%"=="x86" set WHEEL_ARCH=win32

:: Create ABI tag (e.g., cp310-cp310)
set WHEEL_ABI_TAG=cp%PYTHON_MAJOR%%PYTHON_MINOR%-cp%PYTHON_MAJOR%%PYTHON_MINOR%
set WHEEL_TAG=%WHEEL_ABI_TAG%-%WHEEL_ARCH%

echo [INFO] Wheel compatibility tag: %WHEEL_TAG%

:: Construct the wheel URL based on Python version
set WHEEL_URL=https://huggingface.github.io/tokenizers/wheels/tokenizers-0.13.3-%WHEEL_TAG%.whl
echo [INFO] Using wheel compatible with Python %PYTHON_VERSION%: %WHEEL_URL%

:: Test the improved tokenizers installation approach
echo [INFO] Testing tokenizers installation with dynamic wheel URL...
pip install tokenizers==0.13.3 --only-binary=:all: --no-cache-dir --find-links %WHEEL_URL%

if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Tokenizers installed successfully using dynamic wheel URL!

    :: Verify that tokenizers is actually installed and working
    echo [INFO] Verifying tokenizers installation...
    python -c "import tokenizers; print(f'Tokenizers version: {tokenizers.__version__}')"

    if !ERRORLEVEL! EQU 0 (
        echo [SUCCESS] Tokenizers is properly installed and working!
    ) else (
        echo [ERROR] Tokenizers is installed but not working properly.
    )
) else (
    echo [ERROR] Failed to install tokenizers using dynamic wheel URL.

    :: Try with the base HuggingFace wheels directory
    echo [INFO] Testing with HuggingFace wheels directory...
    pip install tokenizers==0.13.3 --only-binary=:all: --no-cache-dir --find-links https://huggingface.github.io/tokenizers/wheels/

    if !ERRORLEVEL! EQU 0 (
        echo [SUCCESS] Tokenizers installed successfully using HuggingFace wheels directory!

        :: Verify that tokenizers is actually installed and working
        echo [INFO] Verifying tokenizers installation...
        python -c "import tokenizers; print(f'Tokenizers version: {tokenizers.__version__}')"

        if !ERRORLEVEL! EQU 0 (
            echo [SUCCESS] Tokenizers is properly installed and working!
        ) else (
            echo [ERROR] Tokenizers is installed but not working properly.
        )
    ) else (
        echo [ERROR] Failed to install tokenizers using HuggingFace wheels directory.

        :: Try the PyPI fallback method
        echo [INFO] Testing fallback method (PyPI index)...
        pip install tokenizers==0.13.3 --only-binary=:all: --no-cache-dir --index-url https://pypi.org/simple/

        if !ERRORLEVEL! EQU 0 (
            echo [SUCCESS] Tokenizers installed successfully using PyPI index!

            :: Verify that tokenizers is actually installed and working
            echo [INFO] Verifying tokenizers installation...
            python -c "import tokenizers; print(f'Tokenizers version: {tokenizers.__version__}')"

            if !ERRORLEVEL! EQU 0 (
                echo [SUCCESS] Tokenizers is properly installed and working!
            ) else (
                echo [ERROR] Tokenizers is installed but not working properly.
            )
        ) else (
            echo [ERROR] Failed to install tokenizers using all methods.
        )
    )
)

:: Deactivate the virtual environment
call deactivate

:: Clean up
echo [INFO] Cleaning up test environment...
rmdir /s /q %TEST_ENV_DIR%

echo.
echo [SUCCESS] Test completed.
goto :end

:error
echo.
echo [ERROR] An error occurred during the test.
echo Please check the error messages above for more information.
exit /b 1

:end
echo.
pause
