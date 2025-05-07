# Python 3.13+ Compatibility for Mashaaer Enhanced

This document explains how to run Mashaaer Enhanced with Python 3.13+ and the limitations of doing so.

## Background

Mashaaer Enhanced was originally designed to work with Python 3.10. Some of the dependencies, particularly the `tokenizers` and `transformers` packages, are not compatible with Python 3.13+. This is because Python 3.13 removed the `pkgutil.ImpImporter` class that these packages depend on.

## Compatibility Solution

We've made the following changes to allow Mashaaer Enhanced to run with Python 3.13+:

1. Modified `local_model_manager.py` to gracefully handle the case where the `transformers` package is not available
2. Updated `requirements.txt` to comment out incompatible packages
3. Created setup and run scripts specifically for Python 3.13+

## Limitations

When running with Python 3.13+, the following features will be disabled:

- Local AI models (aragpt2, noor, jais, falcon)
- Any functionality that depends on the `transformers` or `tokenizers` packages

The application will still run, but will display a message when these features are requested, suggesting to use Python 3.10 for full functionality.

## Setup Instructions

### Using PowerShell (Recommended)

1. Open PowerShell
2. Navigate to the project directory
3. Run the setup script:
   ```
   .\setup-python313.ps1
   ```
4. Once setup is complete, run the application:
   ```
   .\run-python313.ps1
   ```

### Using Batch Files

1. Open Command Prompt
2. Navigate to the project directory
3. Run the setup script:
   ```
   setup-python313.bat
   ```
4. Once setup is complete, run the application:
   ```
   run-python313.bat
   ```

## Manual Setup

If you prefer to set up manually:

1. Create a virtual environment:
   ```
   python -m venv venv
   ```
2. Activate the virtual environment:
   - Windows PowerShell: `.\venv\Scripts\Activate.ps1`
   - Windows Command Prompt: `venv\Scripts\activate.bat`
3. Upgrade pip:
   ```
   python -m pip install --upgrade pip
   ```
4. Install dependencies:
   ```
   python -m pip install -r backend\requirements.txt
   ```
5. Run the application:
   ```
   python backend\app.py
   ```

## For Full Functionality

For full functionality, including local AI models, please install Python 3.10 and use the original setup scripts.

## Troubleshooting

If you encounter issues:

1. Make sure Python 3.13+ is installed and in your PATH
2. Check that you've activated the virtual environment before running the application
3. If you see errors about missing packages, try running the setup script again
4. If you need the full functionality, consider installing Python 3.10

## Technical Details

The main issue is with the `pkgutil.ImpImporter` class, which was deprecated in Python 3.4 and removed in Python 3.12. The `tokenizers` package (version 0.13.3) and its dependencies still rely on this class, causing errors when imported in Python 3.13+.

Our solution wraps the imports in a try-except block and provides fallback functionality when the imports fail, allowing the application to run with reduced functionality.