# Tokenizers Installation Fix

## Issue Description

The `tokenizers` Python package (used by `transformers`) requires Rust compiler for building from source. This can cause installation failures, especially on:

1. Systems without Rust compiler installed
2. Python 3.13+ (tokenizers is not fully compatible with Python 3.13 and above)

The error typically looks like:

```
error: `cargo rustc --lib --message-format=json-render-diagnostics --manifest-path Cargo.toml --release -v --features pyo3/extension-module --crate-type cdylib --` failed with code 101
ERROR: Failed building wheel for tokenizers
```

## Solution

Scripts `fix-tokenizers-install.bat` and `fix-tokenizers-install.ps1` have been created to address this issue. These scripts:

1. Check your Python version for compatibility with tokenizers
2. Create a modified requirements file that excludes tokenizers
3. Try multiple methods to install tokenizers with pre-built wheels (if your Python version is compatible):
   - First attempt: Using direct URL to pre-built wheel from HuggingFace
   - Second attempt: Using PyPI index with binary-only option
   - Third attempt: Downloading the wheel first and then installing it
4. Fall back to installing transformers without dependencies if tokenizers can't be installed
5. Install the rest of the dependencies

## How to Use

If you encounter issues with tokenizers installation, follow these steps:

### Option 1: Using Command Prompt (Recommended for most users)

1. Open Command Prompt
2. Navigate to the project directory
3. Run the batch fix script:

```cmd
fix-tokenizers-install.bat
```

### Option 2: Using PowerShell

1. Open PowerShell
2. Navigate to the project directory
3. Run the PowerShell fix script:

```powershell
.\fix-tokenizers-install.ps1
```

4. After either script completes successfully, you can start the application normally:

```powershell
.\start-mashaaer.ps1
```

> **Note**: The batch file (Option 1) now provides a complete standalone solution without requiring PowerShell, making it more accessible for users who might have restrictions on running PowerShell scripts.

## For Python 3.13+ Users

If you're using Python 3.13 or above, the script will automatically detect this and use a compatibility mode that skips tokenizers installation. Some features of the transformers library might have limited functionality, but the core application will still work.

## Manual Alternative

If you prefer to fix the issue manually, you can:

1. Activate your virtual environment
2. Install transformers without dependencies:
   ```
   pip install transformers==4.30.2 --no-deps
   ```
3. Install all other dependencies from requirements.txt except tokenizers:
   ```
   pip install flask==2.0.1 werkzeug==2.0.3 flask-cors==3.0.10 python-dotenv==0.19.0 feedparser==6.0.10 requests==2.28.2 torch==2.6.0 pyttsx3==2.90 psutil==5.9.5 numpy>=1.17.0 regex!=2019.12.17 pyyaml>=5.1 huggingface-hub>=0.14.1 tqdm>=4.27.0
   ```

## Troubleshooting

If you still encounter issues after running the fix script:

1. Make sure you have the latest version of pip:
   ```
   python -m pip install --upgrade pip
   ```

2. Try recreating your virtual environment:
   ```
   Remove-Item -Recurse -Force .\venv
   python -m venv venv
   ```

3. Run the fix script again
