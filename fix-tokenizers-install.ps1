# Fix script for tokenizers installation issues
# This script addresses the issue with tokenizers installation on Python 3.13+

Write-Host "Starting tokenizers installation fix..." -ForegroundColor Green

# Function to check Python version
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

# Check Python version
$pythonVersion = Get-PythonVersion
if ($pythonVersion) {
    Write-Host "Detected Python version: $($pythonVersion.FullVersion)" -ForegroundColor Green
    if (-not $pythonVersion.IsCompatibleWithTokenizers) {
        Write-Host "⚠️ Python $($pythonVersion.FullVersion) is not fully compatible with tokenizers package" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️ Could not determine Python version, proceeding with default installation" -ForegroundColor Yellow
}

# Create a temporary requirements file without tokenizers
$tempRequirementsFile = "temp_requirements.txt"
Write-Host "Creating temporary requirements file without tokenizers..." -ForegroundColor Yellow
Get-Content backend/requirements.txt | Where-Object { $_ -notmatch "tokenizers" } | Out-File $tempRequirementsFile

# Activate virtual environment if it exists, create it if it doesn't
if (-not (Test-Path ".\venv")) {
    Write-Host "Virtual environment not found. Creating one..." -ForegroundColor Yellow
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to create virtual environment" -ForegroundColor Red
        Remove-Item $tempRequirementsFile -ErrorAction SilentlyContinue
        exit 1
    }
}

# Activate the virtual environment
try {
    . .\venv\Scripts\Activate.ps1
    Write-Host "Virtual environment activated successfully" -ForegroundColor Green
} catch {
    Write-Host "Error activating virtual environment: $_" -ForegroundColor Red
    Remove-Item $tempRequirementsFile -ErrorAction SilentlyContinue
    exit 1
}

# Upgrade pip to the latest version
Write-Host "Upgrading pip to the latest version..." -ForegroundColor Yellow
python -m pip install --upgrade pip
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to upgrade pip" -ForegroundColor Red
}

# Try to install tokenizers with specific options to avoid Rust compilation
$tokenizersInstalled = $false

if ($pythonVersion -and $pythonVersion.IsCompatibleWithTokenizers) {
    Write-Host "Attempting to install tokenizers with pre-built wheel..." -ForegroundColor Yellow
    try {
        # Construct the wheel URL based on Python version
        $wheelTag = $pythonVersion.WheelTag
        $wheelUrl = "https://huggingface.github.io/tokenizers/wheels/tokenizers-0.13.3-$wheelTag.whl"

        Write-Host "Using wheel compatible with Python $($pythonVersion.FullVersion): $wheelUrl" -ForegroundColor Cyan

        # First attempt: Try to install pre-built wheel with direct URL to wheel
        Write-Host "Attempting to install tokenizers using direct wheel URL..." -ForegroundColor Yellow
        pip install tokenizers==0.13.3 --only-binary=:all: --no-cache-dir --find-links $wheelUrl
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Successfully installed tokenizers using direct wheel URL" -ForegroundColor Green
            $tokenizersInstalled = $true
        } else {
            Write-Host "Failed to install tokenizers using direct wheel URL" -ForegroundColor Yellow

            # Try with the base HuggingFace wheels directory
            Write-Host "Attempting to install tokenizers using HuggingFace wheels directory..." -ForegroundColor Yellow
            pip install tokenizers==0.13.3 --only-binary=:all: --no-cache-dir --find-links https://huggingface.github.io/tokenizers/wheels/
            if ($LASTEXITCODE -eq 0) {
                Write-Host "Successfully installed tokenizers using HuggingFace wheels directory" -ForegroundColor Green
                $tokenizersInstalled = $true
            } else {
                # Second attempt: Try with explicit index URL
                Write-Host "Attempting to install tokenizers using PyPI index..." -ForegroundColor Yellow
                pip install tokenizers==0.13.3 --only-binary=:all: --no-cache-dir --index-url https://pypi.org/simple/
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "Successfully installed tokenizers using PyPI index" -ForegroundColor Green
                    $tokenizersInstalled = $true
                } else {
                    Write-Host "Failed to install tokenizers using PyPI index" -ForegroundColor Yellow
                }
            }
        }
    } catch {
        Write-Host "Error installing tokenizers: $_" -ForegroundColor Red
    }

    if (-not $tokenizersInstalled) {
        Write-Host "Attempting to install tokenizers with alternative method..." -ForegroundColor Yellow
        try {
            # Second attempt: Try to install with pip download first
            $tempDir = ".\temp_wheels"
            if (-not (Test-Path $tempDir)) {
                New-Item -ItemType Directory -Path $tempDir | Out-Null
            }

            pip download tokenizers==0.13.3 --only-binary=:all: --no-cache-dir --dest $tempDir
            if ($LASTEXITCODE -eq 0) {
                $wheelFile = Get-ChildItem -Path $tempDir -Filter "tokenizers*.whl" | Select-Object -First 1
                if ($wheelFile) {
                    pip install $wheelFile.FullName
                    if ($LASTEXITCODE -eq 0) {
                        Write-Host "Successfully installed tokenizers from downloaded wheel" -ForegroundColor Green
                        $tokenizersInstalled = $true
                    }
                }
            }

            # Clean up temp directory
            if (Test-Path $tempDir) {
                Remove-Item -Recurse -Force $tempDir
            }
        } catch {
            Write-Host "Error installing tokenizers with alternative method: $_" -ForegroundColor Red
        }
    }
}

if (-not $tokenizersInstalled) {
    Write-Host "Could not install tokenizers. Proceeding without tokenizers." -ForegroundColor Yellow

    # If transformers is in the requirements, install it without dependencies first
    if (Get-Content $tempRequirementsFile | Where-Object { $_ -match "transformers" }) {
        Write-Host "Installing transformers without dependencies..." -ForegroundColor Yellow
        pip install transformers==4.30.2 --no-deps
    }
}

# Install the rest of the dependencies
Write-Host "Installing other dependencies..." -ForegroundColor Yellow
pip install -r $tempRequirementsFile
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install dependencies" -ForegroundColor Red
    Remove-Item $tempRequirementsFile -ErrorAction SilentlyContinue
    exit 1
} else {
    Write-Host "Successfully installed all other dependencies" -ForegroundColor Green
}

# Clean up temporary file
Remove-Item $tempRequirementsFile -ErrorAction SilentlyContinue

Write-Host "Tokenizers installation fix completed." -ForegroundColor Green
Write-Host "You can now run 'start-mashaaer.ps1' to start the application." -ForegroundColor Cyan
