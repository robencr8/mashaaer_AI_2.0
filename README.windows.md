# Windows Environment Setup Guide

This guide provides instructions for setting up and running the Mashaaer Enhanced project on Windows systems, with a focus on properly setting environment variables.

## Issue with Environment Variables in Windows PowerShell

In Windows PowerShell, setting environment variables directly in the command line (e.g., `VITE_API_BASE_URL=http://127.0.0.1:5000`) will result in an error because PowerShell uses a different syntax for environment variables compared to Unix-like systems.

## Solution: Using Provided Scripts

To simplify the process of setting environment variables and running the application on Windows, we've provided several scripts:

### Batch Files (for Command Prompt)

1. **start-with-env.bat** - Starts the development server with the correct environment variables
   ```
   start-with-env.bat
   ```

2. **build-with-env.bat** - Builds the application with the correct environment variables
   ```
   build-with-env.bat
   ```

3. **build-and-serve.bat** - Builds the application and serves it on port 4000
   ```
   build-and-serve.bat
   ```

### PowerShell Scripts

1. **start-with-env.ps1** - Starts the development server with the correct environment variables
   ```powershell
   .\start-with-env.ps1
   ```

2. **build-and-serve.ps1** - Builds the application and serves it on port 4000
   ```powershell
   .\build-and-serve.ps1
   ```

## Manual Environment Variable Setup

If you prefer to set environment variables manually:

### In Command Prompt

```
set "REACT_APP_API_BASE_URL=http://localhost:5000"
npm run start
```

### In PowerShell

```powershell
$env:REACT_APP_API_BASE_URL = "http://localhost:5000"
npm run start
```

## Environment Variables in .env File

The application is configured to read environment variables from the `.env` file. The following variables are available:

- `REACT_APP_API_BASE_URL` - The base URL for the Flask API (default: http://localhost:5000)

You can modify these values in the `.env` file to change the default configuration.

## Troubleshooting

If you encounter issues with environment variables:

1. Make sure you're using the correct syntax for your shell (Command Prompt or PowerShell)
2. Try using the provided scripts instead of setting variables manually
3. Check that the `.env` file contains the correct values
4. Restart your terminal/shell to ensure environment changes take effect