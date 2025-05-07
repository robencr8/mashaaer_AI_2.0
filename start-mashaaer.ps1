# Start script for Mashaaer Enhanced Project
# This script starts both the backend (Flask) and frontend (React) servers

# Create log file with timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$logFile = "log_$timestamp.txt"

# Initialize log file
"[$timestamp] Mashaaer Enhanced Project Startup Log" | Out-File $logFile

# Function to write to log file and console
function Write-Log {
    param (
        [Parameter(Mandatory=$true)]
        [string]$Message,

        [Parameter(Mandatory=$false)]
        [string]$ForegroundColor = "White",

        [Parameter(Mandatory=$false)]
        [string]$Type = "INFO"
    )

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] [$Type] $Message"

    # Write to console with color
    Write-Host $Message -ForegroundColor $ForegroundColor

    # Write to log file
    $logMessage | Out-File -Append $logFile

    # Return success for piping
    return $true
}

Write-Log "Starting Mashaaer Enhanced Project..." "Green" "INFO"

# Function to check if a command exists
function Test-CommandExists {
    param ($command)
    $exists = $null -ne (Get-Command $command -ErrorAction SilentlyContinue)
    return $exists
}

# Function to get Python version
function Get-PythonVersion {
    try {
        $versionOutput = python --version 2>&1
        if ($versionOutput -match "Python (\d+)\.(\d+)\.(\d+)") {
            $major = [int]$Matches[1]
            $minor = [int]$Matches[2]
            $patch = [int]$Matches[3]
            return @{
                Major = $major
                Minor = $minor
                Patch = $patch
                FullVersion = "$major.$minor.$patch"
                IsCompatibleWithTokenizers = ($major -lt 3 -or ($major -eq 3 -and $minor -lt 13))
            }
        }
        return $null
    } catch {
        Write-Log "Error getting Python version: $_" "Red" "ERROR"
        return $null
    }
}

# Check if Python is installed
if (-not (Test-CommandExists "python")) {
    Write-Log "Error: Python is not installed or not in PATH. Please install Python and try again." "Red" "ERROR"
    "❌ Python dependency check failed" | Out-File -Append $logFile
    exit 1
}
Write-Log "✅ Python dependency check passed" "Green" "INFO"

# Check Python version
$pythonVersion = Get-PythonVersion
if ($pythonVersion) {
    Write-Log "Detected Python version: $($pythonVersion.FullVersion)" "Green" "INFO"
    if (-not $pythonVersion.IsCompatibleWithTokenizers) {
        Write-Log "⚠️ Python $($pythonVersion.FullVersion) is not fully compatible with tokenizers package" "Yellow" "WARNING"
        "⚠️ Python $($pythonVersion.FullVersion) detected - tokenizers compatibility mode will be enabled" | Out-File -Append $logFile
    }
} else {
    Write-Log "⚠️ Could not determine Python version, proceeding with default installation" "Yellow" "WARNING"
    "⚠️ Python version detection failed" | Out-File -Append $logFile
}

# Check if Node.js is installed
if (-not (Test-CommandExists "npm")) {
    Write-Log "Error: Node.js is not installed or not in PATH. Please install Node.js and try again." "Red" "ERROR"
    "❌ Node.js dependency check failed" | Out-File -Append $logFile
    exit 1
}
Write-Log "✅ Node.js dependency check passed" "Green" "INFO"

# Function to test if pip is working properly
function Test-PipFunctionality {
    try {
        # Try to run pip --version and capture any errors
        $pipVersion = & .\venv\Scripts\pip.exe --version 2>&1
        # If the command was successful, $LASTEXITCODE will be 0
        if ($LASTEXITCODE -eq 0) {
            Write-Log "pip is working properly: $pipVersion" "Green" "INFO"
            "✅ pip functionality check passed" | Out-File -Append $logFile
            return $true
        } else {
            Write-Log "pip command failed with exit code $LASTEXITCODE" "Red" "ERROR"
            "❌ pip functionality check failed with exit code $LASTEXITCODE" | Out-File -Append $logFile
            return $false
        }
    } catch {
        Write-Log "Error testing pip functionality: $_" "Red" "ERROR"
        "❌ pip functionality check failed with exception" | Out-File -Append $logFile
        return $false
    }
}

# Function to recreate virtual environment
function Recreate-VirtualEnvironment {
    Write-Log "Recreating virtual environment..." "Yellow" "WARNING"

    # Deactivate the current virtual environment if it's active
    if (Test-Path Env:VIRTUAL_ENV) {
        Write-Log "Deactivating current virtual environment..." "Yellow" "INFO"
        deactivate
    }

    # Remove the existing virtual environment
    if (Test-Path ".\venv") {
        Write-Log "Removing existing virtual environment..." "Yellow" "INFO"
        Remove-Item -Recurse -Force .\venv
        if ($LASTEXITCODE -ne 0) {
            Write-Log "Failed to remove virtual environment" "Red" "ERROR"
            "❌ Virtual environment removal failed" | Out-File -Append $logFile
        }
    }

    # Create a new virtual environment
    Write-Log "Creating new virtual environment..." "Yellow" "INFO"
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Log "Failed to create virtual environment" "Red" "ERROR"
        "❌ Virtual environment creation failed" | Out-File -Append $logFile
        exit 1
    }

    # Activate the new virtual environment
    Write-Log "Activating new virtual environment..." "Yellow" "INFO"

    # Check if activate.ps1 exists
    if (Test-Path ".\venv\Scripts\Activate.ps1") {
        try {
            # Use dot-sourcing to run the activation script in the current scope
            . .\venv\Scripts\Activate.ps1

            # Check if activation was successful by looking for the VIRTUAL_ENV environment variable
            if (-not (Test-Path Env:VIRTUAL_ENV)) {
                Write-Log "Failed to activate new virtual environment: VIRTUAL_ENV environment variable not set" "Red" "ERROR"
                "❌ New virtual environment activation failed" | Out-File -Append $logFile
                exit 1
            }
        } catch {
            Write-Log "Error activating new virtual environment: $_" "Red" "ERROR"
            "❌ New virtual environment activation failed with exception" | Out-File -Append $logFile
            exit 1
        }
    } else {
        Write-Log "Failed to activate new virtual environment: Activate.ps1 not found" "Red" "ERROR"
        "❌ New virtual environment activation failed - Activate.ps1 not found" | Out-File -Append $logFile
        exit 1
    }

    # Upgrade pip to the latest version
    Write-Log "Upgrading pip to the latest version..." "Yellow" "INFO"
    python -m pip install --upgrade pip
    if ($LASTEXITCODE -ne 0) {
        Write-Log "Failed to upgrade pip" "Red" "ERROR"
        "❌ pip upgrade failed" | Out-File -Append $logFile
    } else {
        "✅ Virtual environment recreated successfully" | Out-File -Append $logFile
    }
}

# Step 1: Setup and verify virtual environment
Write-Log "Step 1: Setting up virtual environment..." "Cyan" "INFO"

# Check if virtual environment exists, create if it doesn't
if (-not (Test-Path ".\venv")) {
    Write-Log "❌ Virtual environment not found. Creating one now..." "Yellow" "WARNING"
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Log "Failed to create virtual environment" "Red" "ERROR"
        "❌ Virtual environment creation failed" | Out-File -Append $logFile
        exit 1
    }
    "✅ Virtual environment created successfully" | Out-File -Append $logFile
}

# Check if Activate.ps1 exists, recreate environment if it doesn't
if (-not (Test-Path ".\venv\Scripts\Activate.ps1")) {
    Write-Log "❌ Virtual environment activation script not found. Recreating environment..." "Yellow" "WARNING"
    Recreate-VirtualEnvironment
}

# Activate the virtual environment
Write-Log "Activating virtual environment..." "Yellow" "INFO"

# Check if activate.ps1 exists
if (Test-Path ".\venv\Scripts\Activate.ps1") {
    try {
        # Use dot-sourcing to run the activation script in the current scope
        . .\venv\Scripts\Activate.ps1

        # Check if activation was successful by looking for the VIRTUAL_ENV environment variable
        if (Test-Path Env:VIRTUAL_ENV) {
            Write-Log "Virtual environment activated successfully" "Green" "INFO"
            "✅ Virtual environment activated successfully" | Out-File -Append $logFile
        } else {
            Write-Log "Failed to activate virtual environment: VIRTUAL_ENV environment variable not set" "Red" "ERROR"
            "❌ Virtual environment activation failed" | Out-File -Append $logFile
            exit 1
        }
    } catch {
        Write-Log "Error activating virtual environment: $_" "Red" "ERROR"
        "❌ Virtual environment activation failed with exception" | Out-File -Append $logFile
        exit 1
    }
} else {
    Write-Log "Failed to activate virtual environment: Activate.ps1 not found" "Red" "ERROR"
    "❌ Virtual environment activation failed - Activate.ps1 not found" | Out-File -Append $logFile
    exit 1
}

# Check if pip is working properly
if (-not (Test-PipFunctionality)) {
    Write-Log "pip.exe is corrupted or not working properly. Recreating virtual environment..." "Red" "ERROR"
    Recreate-VirtualEnvironment

    # Check again after recreation
    if (-not (Test-PipFunctionality)) {
        Write-Log "pip is still not working properly after recreating the virtual environment." "Red" "ERROR"
        Write-Log "Please try manually running: python -m pip install --upgrade pip" "Yellow" "WARNING"
        "❌ pip functionality check failed even after recreation" | Out-File -Append $logFile
        exit 1
    }
}

# Step 2: Install backend dependencies
Write-Log "Step 2: Installing backend dependencies..." "Cyan" "INFO"

# Check if Python version is compatible with tokenizers
$skipTokenizers = $false
$useTokenizersCompatMode = $false
if ($pythonVersion -and -not $pythonVersion.IsCompatibleWithTokenizers) {
    $skipTokenizers = $true
    $useTokenizersCompatMode = $true
    Write-Log "Python $($pythonVersion.FullVersion) detected - will use tokenizers compatibility mode" "Yellow" "WARNING"
}

try {
    if ($skipTokenizers) {
        Write-Log "Installing dependencies without tokenizers due to Python version compatibility..." "Yellow" "INFO"

        # Install transformers without dependencies
        Write-Log "Installing transformers with --no-deps flag..." "Yellow" "INFO"
        pip install transformers==4.30.2 --no-deps

        # Install other dependencies excluding tokenizers
        Write-Log "Installing other dependencies..." "Yellow" "INFO"
        Get-Content backend/requirements.txt | Where-Object { $_ -notmatch "tokenizers" } | ForEach-Object {
            if ($_ -match "^\s*[^#]") {  # Skip comments and empty lines
                Write-Log "Installing: $_" "Yellow" "INFO"
                pip install $_
            }
        }

        Write-Log "Backend dependencies installed in compatibility mode (without tokenizers)" "Green" "INFO"
        "✅ Backend dependencies installed in compatibility mode" | Out-File -Append $logFile
    } else {
        # Standard installation for compatible Python versions using the tokenizers fix script
        if (Test-Path "fix-tokenizers-install.ps1") {
            Write-Log "Using tokenizers fix script to install dependencies..." "Yellow" "INFO"
            & .\fix-tokenizers-install.ps1
            if ($LASTEXITCODE -ne 0) {
                throw "fix-tokenizers-install.ps1 failed with exit code $LASTEXITCODE"
            }
        } else {
            Write-Log "Warning: fix-tokenizers-install.ps1 not found, falling back to direct installation" "Yellow" "WARNING"
            pip install -r backend/requirements.txt
            if ($LASTEXITCODE -ne 0) {
                throw "pip install failed with exit code $LASTEXITCODE"
            }
        }
        Write-Log "Backend dependencies installed successfully" "Green" "INFO"
        "✅ Backend dependencies installed successfully" | Out-File -Append $logFile
    }
} catch {
    Write-Log "Error installing backend dependencies: $_" "Red" "ERROR"
    "❌ Backend dependencies installation failed" | Out-File -Append $logFile
    Write-Log "Attempting to fix by recreating the virtual environment..." "Yellow" "WARNING"
    Recreate-VirtualEnvironment

    # Try installing dependencies again
    Write-Log "Retrying installation of backend dependencies..." "Yellow" "INFO"

    if ($skipTokenizers) {
        # Retry installation in compatibility mode
        Write-Log "Retrying installation in compatibility mode (without tokenizers)..." "Yellow" "INFO"

        # Install transformers without dependencies
        Write-Log "Installing transformers with --no-deps flag..." "Yellow" "INFO"
        pip install transformers==4.30.2 --no-deps

        # Install other dependencies excluding tokenizers
        Write-Log "Installing other dependencies..." "Yellow" "INFO"
        Get-Content backend/requirements.txt | Where-Object { $_ -notmatch "tokenizers" } | ForEach-Object {
            if ($_ -match "^\s*[^#]") {  # Skip comments and empty lines
                Write-Log "Installing: $_" "Yellow" "INFO"
                pip install $_
            }
        }

        if ($LASTEXITCODE -eq 0) {
            Write-Log "Backend dependencies installed in compatibility mode after recreation" "Green" "INFO"
            "✅ Backend dependencies installed in compatibility mode after recreation" | Out-File -Append $logFile
        } else {
            Write-Log "Failed to install backend dependencies even in compatibility mode." "Red" "ERROR"
            "❌ Backend dependencies installation failed even in compatibility mode" | Out-File -Append $logFile
            exit 1
        }
    } else {
        # Try using the tokenizers fix script
        if (Test-Path "fix-tokenizers-install.ps1") {
            Write-Log "Using tokenizers fix script to install dependencies after recreation..." "Yellow" "INFO"
            & .\fix-tokenizers-install.ps1
            if ($LASTEXITCODE -eq 0) {
                Write-Log "Backend dependencies installed successfully using fix script after recreation" "Green" "INFO"
                "✅ Backend dependencies installed successfully using fix script after recreation" | Out-File -Append $logFile
            } else {
                # If the fix script fails, fall back to the manual approach
                Write-Log "Fix script failed. Falling back to manual tokenizers workaround..." "Yellow" "WARNING"

                # Try installing transformers with no-deps and then the rest separately
                Write-Log "Installing transformers with --no-deps flag..." "Yellow" "INFO"
                pip install transformers==4.30.2 --no-deps

                # Install other dependencies excluding transformers and tokenizers
                Write-Log "Installing other dependencies..." "Yellow" "INFO"
                Get-Content backend/requirements.txt | Where-Object { $_ -notmatch "transformers" -and $_ -notmatch "tokenizers" } | ForEach-Object {
                    if ($_ -match "^\s*[^#]") {  # Skip comments and empty lines
                        Write-Log "Installing: $_" "Yellow" "INFO"
                        pip install $_
                    }
                }

                Write-Log "Dependencies installed with manual workaround for tokenizers/Rust issue" "Green" "INFO"
                "✅ Dependencies installed with manual tokenizers/Rust workaround" | Out-File -Append $logFile
            }
        } else {
            # If the fix script doesn't exist, use the original approach
            Write-Log "Fix script not found. Using manual tokenizers workaround..." "Yellow" "WARNING"

            # First try to install tokenizers separately with --only-binary flag
            Write-Log "Installing tokenizers with --only-binary flag to avoid Rust compiler issues..." "Yellow" "INFO"
            pip install tokenizers==0.13.3 --only-binary=:all:

            # Then install the rest of the dependencies
            pip install -r backend/requirements.txt
            if ($LASTEXITCODE -ne 0) {
                # Check if the error is related to tokenizers/Rust
                $errorOutput = pip install -r backend/requirements.txt 2>&1
                if ($errorOutput -match "cargo rustc|tokenizers|rust" -or $errorOutput -match "error code 101") {
                    Write-Log "Detected tokenizers/Rust compiler issue. Attempting alternative installation..." "Yellow" "WARNING"
                    "⚠️ Tokenizers/Rust compiler issue detected" | Out-File -Append $logFile

                    # Try installing transformers with no-deps and then the rest separately
                    Write-Log "Installing transformers with --no-deps flag..." "Yellow" "INFO"
                    pip install transformers==4.30.2 --no-deps

                    # Install other dependencies excluding transformers and tokenizers
                    Write-Log "Installing other dependencies..." "Yellow" "INFO"
                    Get-Content backend/requirements.txt | Where-Object { $_ -notmatch "transformers" -and $_ -notmatch "tokenizers" } | ForEach-Object {
                        if ($_ -match "^\s*[^#]") {  # Skip comments and empty lines
                            Write-Log "Installing: $_" "Yellow" "INFO"
                            pip install $_
                        }
                    }

                    Write-Log "Dependencies installed with workaround for tokenizers/Rust issue" "Green" "INFO"
                    "✅ Dependencies installed with tokenizers/Rust workaround" | Out-File -Append $logFile
                } else {
                    Write-Log "Failed to install backend dependencies even after recreating the virtual environment." "Red" "ERROR"
                    "❌ Backend dependencies installation failed even after recreation" | Out-File -Append $logFile
                    exit 1
                }
            } else {
                Write-Log "Backend dependencies installed successfully after recreation" "Green" "INFO"
                "✅ Backend dependencies installed successfully after recreation" | Out-File -Append $logFile
            }
        }
    }
}

# Step 3: Install frontend dependencies
Write-Log "Step 3: Installing frontend dependencies..." "Cyan" "INFO"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Log "Failed to install frontend dependencies" "Red" "ERROR"
    "❌ Frontend dependencies installation failed" | Out-File -Append $logFile
    exit 1
} else {
    Write-Log "Frontend dependencies installed successfully" "Green" "INFO"
    "✅ Frontend dependencies installed successfully" | Out-File -Append $logFile
}

# Step 4: Start the backend server in a new PowerShell window
Write-Log "Step 4: Starting Flask backend server..." "Cyan" "INFO"

# Create a robust backend startup command with smart virtual environment handling
$backendCommand = @"
cd '$PWD'
Write-Host 'Starting Flask backend server...' -ForegroundColor Cyan

# Smart virtual environment check
if (-not (Test-Path '.\venv\Scripts\Activate.ps1')) {
    Write-Host '❌ Virtual environment activation script not found. Creating virtual environment...' -ForegroundColor Yellow
    python -m venv venv
    if (`$LASTEXITCODE -ne 0) {
        Write-Host 'Failed to create virtual environment' -ForegroundColor Red
        exit 1
    }
}

# Activate virtual environment with dot-sourcing
try {
    . .\venv\Scripts\Activate.ps1
    Write-Host '✅ Virtual environment activated successfully' -ForegroundColor Green
} catch {
    Write-Host 'Error activating virtual environment: ' + `$_ -ForegroundColor Red
    exit 1
}

# Start Flask app
Write-Host 'Starting Flask application...' -ForegroundColor Cyan
python backend/app.py
"@

try {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCommand -WindowStyle Normal
    Write-Log "Backend server started in a new window" "Green" "INFO"
    "✅ Backend server started successfully" | Out-File -Append $logFile
} catch {
    Write-Log "Failed to start backend server: $_" "Red" "ERROR"
    "❌ Backend server failed to start" | Out-File -Append $logFile
    exit 1
}

# Wait for the backend to start
Write-Log "Waiting for backend server to start..." "Yellow" "INFO"
Start-Sleep -Seconds 5

# Step 5: Start the frontend server in the current window
Write-Log "Step 5: Starting React frontend..." "Cyan" "INFO"
"✅ All setup steps completed successfully. Starting frontend..." | Out-File -Append $logFile
npm start
if ($LASTEXITCODE -ne 0) {
    Write-Log "Failed to start frontend server" "Red" "ERROR"
    "❌ Frontend server failed to start" | Out-File -Append $logFile
    exit 1
}

# Note: The script will continue running until the frontend server is stopped with Ctrl+C
