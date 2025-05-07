@echo off
setlocal enabledelayedexpansion

echo ========================================================================
echo Tokenizers Installation Fix Script
echo ========================================================================
echo.

:: Check if Python is installed
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Please install Python and try again.
    goto :error
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

set TOKENIZERS_COMPATIBLE=true
if %PYTHON_MAJOR% EQU 3 (
    if %PYTHON_MINOR% GEQ 13 (
        echo [WARNING] Python 3.13+ detected - tokenizers may not be compatible
        set TOKENIZERS_COMPATIBLE=false
    )
)

:: Create a temporary requirements file without tokenizers
echo [INFO] Creating temporary requirements file without tokenizers...
set TEMP_REQUIREMENTS=temp_requirements.txt
type nul > %TEMP_REQUIREMENTS%
for /f "tokens=*" %%a in (backend\requirements.txt) do (
    echo %%a | findstr /i "tokenizers" >nul
    if !ERRORLEVEL! NEQ 0 (
        echo %%a >> %TEMP_REQUIREMENTS%
    )
)

:: Check if virtual environment exists, create if it doesn't
if not exist "venv" (
    echo [INFO] Virtual environment not found. Creating one...
    python -m venv venv
    if !ERRORLEVEL! NEQ 0 (
        echo [ERROR] Failed to create virtual environment
        del %TEMP_REQUIREMENTS% >nul 2>&1
        goto :error
    )
)

:: Activate the virtual environment
echo [INFO] Activating virtual environment...
call venv\Scripts\activate.bat
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to activate virtual environment
    del %TEMP_REQUIREMENTS% >nul 2>&1
    goto :error
)

:: Upgrade pip to the latest version
echo [INFO] Upgrading pip to the latest version...
python -m pip install --upgrade pip
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Failed to upgrade pip, continuing anyway...
)

:: Try to install tokenizers with specific options to avoid Rust compilation
set TOKENIZERS_INSTALLED=false

if "%TOKENIZERS_COMPATIBLE%"=="true" (
    echo [INFO] Attempting to install tokenizers with pre-built wheel...

    :: Construct the wheel URL based on Python version
    set WHEEL_URL=https://huggingface.github.io/tokenizers/wheels/tokenizers-0.13.3-%WHEEL_TAG%.whl
    echo [INFO] Using wheel compatible with Python %PYTHON_VERSION%: %WHEEL_URL%

    :: First attempt: Try to install pre-built wheel with direct URL to wheel
    echo [INFO] Attempting to install tokenizers using direct wheel URL...
    pip install tokenizers==0.13.3 --only-binary=:all: --no-cache-dir --find-links %WHEEL_URL%
    if %ERRORLEVEL% EQU 0 (
        echo [SUCCESS] Successfully installed tokenizers using direct wheel URL
        set TOKENIZERS_INSTALLED=true
    ) else (
        echo [WARNING] Failed to install tokenizers using direct wheel URL

        :: Try with the base HuggingFace wheels directory
        echo [INFO] Attempting to install tokenizers using HuggingFace wheels directory...
        pip install tokenizers==0.13.3 --only-binary=:all: --no-cache-dir --find-links https://huggingface.github.io/tokenizers/wheels/
        if %ERRORLEVEL% EQU 0 (
            echo [SUCCESS] Successfully installed tokenizers using HuggingFace wheels directory
            set TOKENIZERS_INSTALLED=true
        ) else (
            :: Second attempt: Try with explicit index URL
            echo [INFO] Attempting to install tokenizers using PyPI index...
            pip install tokenizers==0.13.3 --only-binary=:all: --no-cache-dir --index-url https://pypi.org/simple/
            if %ERRORLEVEL% EQU 0 (
                echo [SUCCESS] Successfully installed tokenizers using PyPI index
                set TOKENIZERS_INSTALLED=true
            ) else (
                echo [WARNING] Failed to install tokenizers using PyPI index
            )
        )
    )

    :: Second attempt if first failed: Try to install with pip download first
    if "!TOKENIZERS_INSTALLED!"=="false" (
        echo [INFO] Attempting to install tokenizers with alternative method...

        :: Create temp directory for wheel
        set TEMP_WHEELS=temp_wheels
        if not exist %TEMP_WHEELS% mkdir %TEMP_WHEELS%

        :: Download the wheel
        pip download tokenizers==0.13.3 --only-binary=:all: --no-cache-dir --dest %TEMP_WHEELS%
        if %ERRORLEVEL% EQU 0 (
            :: Find the wheel file
            for /f "tokens=*" %%f in ('dir /b %TEMP_WHEELS%\tokenizers*.whl') do (
                :: Install the wheel
                pip install %TEMP_WHEELS%\%%f
                if !ERRORLEVEL! EQU 0 (
                    echo [SUCCESS] Successfully installed tokenizers from downloaded wheel
                    set TOKENIZERS_INSTALLED=true
                )
            )
        )

        :: Clean up temp directory
        if exist %TEMP_WHEELS% rmdir /s /q %TEMP_WHEELS%
    )
)

:: If tokenizers couldn't be installed
if "%TOKENIZERS_INSTALLED%"=="false" (
    echo [WARNING] Could not install tokenizers. Proceeding without tokenizers.

    :: If transformers is in the requirements, install it without dependencies first
    findstr /i "transformers" %TEMP_REQUIREMENTS% >nul
    if %ERRORLEVEL% EQU 0 (
        echo [INFO] Installing transformers without dependencies...
        pip install transformers==4.30.2 --no-deps
    )
)

:: Install the rest of the dependencies
echo [INFO] Installing other dependencies...
pip install -r %TEMP_REQUIREMENTS%
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    del %TEMP_REQUIREMENTS% >nul 2>&1
    goto :error
) else (
    echo [SUCCESS] Successfully installed all other dependencies
)

:: Clean up temporary file
del %TEMP_REQUIREMENTS% >nul 2>&1

echo.
echo [SUCCESS] Tokenizers installation fix completed.
echo You can now run 'start-mashaaer.ps1' to start the application.
goto :end

:error
echo.
echo [ERROR] An error occurred during the installation process.
echo Please check the error messages above for more information.
exit /b 1

:end
echo.
pause
