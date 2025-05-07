# Test script for tokenizers installation fix
# This script tests the improved approach for installing tokenizers

Write-Host "Testing tokenizers installation fix..." -ForegroundColor Green

# Create a temporary virtual environment for testing
$testEnvDir = ".\test_venv"
if (Test-Path $testEnvDir) {
    Write-Host "Removing existing test environment..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $testEnvDir
}

Write-Host "Creating test virtual environment..." -ForegroundColor Yellow
python -m venv $testEnvDir
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to create test virtual environment" -ForegroundColor Red
    exit 1
}

# Activate the test virtual environment
try {
    . $testEnvDir\Scripts\Activate.ps1
    Write-Host "Test virtual environment activated successfully" -ForegroundColor Green
} catch {
    Write-Host "Error activating test virtual environment: $_" -ForegroundColor Red
    exit 1
}

# Upgrade pip
Write-Host "Upgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to upgrade pip" -ForegroundColor Red
}

# Get Python version information for wheel compatibility
function Get-PythonVersion {
    try {
        $versionOutput = python --version 2>&1
        if ($versionOutput -match "Python (\d+)\.(\d+)\.(\d+)") {
            $major = [int]$Matches[1]
            $minor = [int]$Matches[2]
            $patch = [int]$Matches[3]

            # Get Python implementation details for wheel compatibility
            $pythonInfo = python -c "import sys, platform; print(f'{sys.implementation.name},{platform.machine()}')"
            $pythonImpl, $pythonArch = $pythonInfo.Split(',')

            # Map architecture to wheel format
            $wheelArch = switch ($pythonArch) {
                "AMD64" { "win_amd64" }
                "x86_64" { "win_amd64" }
                "x86" { "win32" }
                default { "win_amd64" } # Default to win_amd64 if unknown
            }

            # Create ABI tag (e.g., cp310-cp310)
            $abiTag = "cp$major$minor-cp$major$minor"

            return @{
                Major = $major
                Minor = $minor
                Patch = $patch
                FullVersion = "$major.$minor.$patch"
                IsCompatibleWithTokenizers = ($major -lt 3 -or ($major -eq 3 -and $minor -lt 13))
                WheelAbiTag = $abiTag
                WheelArch = $wheelArch
                WheelTag = "$abiTag-$wheelArch"
            }
        }
        return $null
    } catch {
        Write-Host "Error getting Python version: $_" -ForegroundColor Red
        return $null
    }
}

# Get Python version
$pythonVersion = Get-PythonVersion
if ($pythonVersion) {
    Write-Host "Detected Python version: $($pythonVersion.FullVersion)" -ForegroundColor Green
    Write-Host "Wheel compatibility tag: $($pythonVersion.WheelTag)" -ForegroundColor Cyan
} else {
    Write-Host "Could not determine Python version" -ForegroundColor Red
    exit 1
}

# Construct the wheel URL based on Python version
$wheelTag = $pythonVersion.WheelTag
$wheelUrl = "https://huggingface.github.io/tokenizers/wheels/tokenizers-0.13.3-$wheelTag.whl"
Write-Host "Using wheel URL: $wheelUrl" -ForegroundColor Cyan

# Test the improved tokenizers installation approach
Write-Host "Testing tokenizers installation with dynamic wheel URL..." -ForegroundColor Yellow
pip install tokenizers==0.13.3 --only-binary=:all: --no-cache-dir --find-links $wheelUrl

if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: Tokenizers installed successfully using dynamic wheel URL!" -ForegroundColor Green

    # Verify that tokenizers is actually installed and working
    Write-Host "Verifying tokenizers installation..." -ForegroundColor Yellow
    python -c "import tokenizers; print(f'Tokenizers version: {tokenizers.__version__}')"

    if ($LASTEXITCODE -eq 0) {
        Write-Host "SUCCESS: Tokenizers is properly installed and working!" -ForegroundColor Green
    } else {
        Write-Host "ERROR: Tokenizers is installed but not working properly." -ForegroundColor Red
    }
} else {
    Write-Host "ERROR: Failed to install tokenizers using dynamic wheel URL." -ForegroundColor Red

    # Try with the base HuggingFace wheels directory
    Write-Host "Testing with HuggingFace wheels directory..." -ForegroundColor Yellow
    pip install tokenizers==0.13.3 --only-binary=:all: --no-cache-dir --find-links https://huggingface.github.io/tokenizers/wheels/

    if ($LASTEXITCODE -eq 0) {
        Write-Host "SUCCESS: Tokenizers installed successfully using HuggingFace wheels directory!" -ForegroundColor Green

        # Verify that tokenizers is actually installed and working
        Write-Host "Verifying tokenizers installation..." -ForegroundColor Yellow
        python -c "import tokenizers; print(f'Tokenizers version: {tokenizers.__version__}')"

        if ($LASTEXITCODE -eq 0) {
            Write-Host "SUCCESS: Tokenizers is properly installed and working!" -ForegroundColor Green
        } else {
            Write-Host "ERROR: Tokenizers is installed but not working properly." -ForegroundColor Red
        }
    } else {
        # Try the fallback method
        Write-Host "Testing fallback method (PyPI index)..." -ForegroundColor Yellow
        pip install tokenizers==0.13.3 --only-binary=:all: --no-cache-dir --index-url https://pypi.org/simple/

        if ($LASTEXITCODE -eq 0) {
            Write-Host "SUCCESS: Tokenizers installed successfully using PyPI index!" -ForegroundColor Green

            # Verify that tokenizers is actually installed and working
            Write-Host "Verifying tokenizers installation..." -ForegroundColor Yellow
            python -c "import tokenizers; print(f'Tokenizers version: {tokenizers.__version__}')"

            if ($LASTEXITCODE -eq 0) {
                Write-Host "SUCCESS: Tokenizers is properly installed and working!" -ForegroundColor Green
            } else {
                Write-Host "ERROR: Tokenizers is installed but not working properly." -ForegroundColor Red
            }
        } else {
            Write-Host "ERROR: Failed to install tokenizers using all methods." -ForegroundColor Red
        }
    }
}

# Deactivate the virtual environment
deactivate

# Clean up
Write-Host "Cleaning up test environment..." -ForegroundColor Yellow
Remove-Item -Recurse -Force $testEnvDir

Write-Host "Test completed." -ForegroundColor Green
