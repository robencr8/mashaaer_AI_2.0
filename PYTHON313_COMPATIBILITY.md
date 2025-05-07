# Python 3.13+ Compatibility for Mashaaer Enhanced

This document explains how to run Mashaaer Enhanced with Python 3.13+ and the limitations of doing so.

## Important Notice

**Recommended Python Version: 3.11.x or 3.12.x**

While this guide provides instructions for Python 3.13+, we strongly recommend using Python 3.11.x or 3.12.x for the best compatibility and full functionality. Python 3.13+ has known compatibility issues with several key dependencies.

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

## Known Issues and Solutions

### PostgreSQL Development Headers

If you encounter an error like `pg_config executable not found` when installing `psycopg2-binary`, you need to install PostgreSQL development headers:

1. Download and install PostgreSQL from https://www.postgresql.org/download/windows/
2. During installation, make sure to select "Add PostgreSQL binaries to PATH"
3. If PostgreSQL is already installed but `pg_config` isn't in PATH:
   - Locate your PostgreSQL bin directory (usually C:\Program Files\PostgreSQL\<version>\bin)
   - Add this directory to your system environment PATH variable

### Flask and Werkzeug Dependency Conflicts

We've updated the dependencies in `backend/requirements.txt` to use compatible versions:
- Flask 3.1.0
- Werkzeug 3.1.3
- Flask-SQLAlchemy 3.0.3
- psycopg2-binary 2.9.9

If you still encounter conflicts, try:
```
pip uninstall flask flask-sqlalchemy werkzeug -y
pip install flask==3.1.0 flask-sqlalchemy==3.0.3 werkzeug==3.1.3
```

## Troubleshooting

If you encounter issues:

1. Make sure Python 3.13+ is installed and in your PATH
2. Check that you've activated the virtual environment before running the application
3. If you see errors about missing packages, try running the setup script again
4. If you need the full functionality, consider installing Python 3.11.x or 3.12.x

## Technical Details

The main issue is with the `pkgutil.ImpImporter` class, which was deprecated in Python 3.4 and removed in Python 3.12. The `tokenizers` package (version 0.13.3) and its dependencies still rely on this class, causing errors when imported in Python 3.13+.

Our solution wraps the imports in a try-except block and provides fallback functionality when the imports fail, allowing the application to run with reduced functionality.
