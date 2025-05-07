# Mashaaer Enhanced Project Setup Guide (Alpha Release)

This guide will help you run the Mashaaer Enhanced React project (Alpha Release v1.0.0-alpha.1) locally without errors.

> **Note**: This is an alpha release which includes experimental features that may require additional setup or troubleshooting.

## Prerequisites

- Node.js (version 14 or higher)
- npm (version 6 or higher)

## Automated Setup

We've created a PowerShell script that automates the setup process. To use it:

1. Open PowerShell in the project directory
2. Run the following command:

```powershell
.\setup-mashaaer.ps1
```

This script will:
- Clean the installation (remove node_modules and package-lock.json)
- Clean the npm cache
- Install dependencies
- Fix security issues
- Verify the react-scripts version

## Manual Setup

If you prefer to set up the project manually, follow these steps:

### 1. Clean Installation

```bash
# Remove existing node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Clean npm cache
npm cache clean --force

# Install dependencies
npm install
```

### 2. Fix Security Issues

```bash
# Fix security issues
npm audit fix

# Force fix security issues (may change some versions)
npm audit fix --force
```

### 3. Start the Project

```bash
# Start the development server
npm start
```

## Troubleshooting

If you encounter any issues:

### Module not found errors

If you see errors like "Module not found: process / stream / fs", the polyfills have been configured in the `config-overrides.js` file. Make sure you have all the required dependencies installed:

```bash
npm install browserify-fs buffer process stream-browserify assert events --save
```

### Other Issues

If you encounter other issues, try the following:

1. Clear your browser cache
2. Restart the development server
3. Check the browser console for specific error messages

## Building for Production

To create a production build:

```bash
npm run build
```

This will create a `build` folder with the optimized production build.

## Alpha Features Setup

This alpha release includes experimental features that are enabled by default in the configuration. You can modify these settings in the `mashaaer.config.js` file:

```javascript
// Alpha testing configuration in mashaaer.config.js
alpha: {
  enabled: true,
  features: [
    {
      id: 'advanced-emotion-detection',
      name: 'Advanced Emotion Detection',
      enabled: true,
      description: 'Enhanced emotion detection with improved accuracy and dialect support'
    },
    {
      id: 'memory-indexer',
      name: 'Memory Indexer',
      enabled: true,
      description: 'Advanced memory indexing and retrieval capabilities'
    },
    {
      id: 'voice-personality-v2',
      name: 'Voice Personality V2',
      enabled: true,
      description: 'Next generation voice personality with improved emotion response'
    }
  ],
  feedbackEnabled: true,
  telemetryEnabled: true,
  expirationDate: '2025-12-31'
}
```

### Troubleshooting Alpha Features

If you encounter issues with alpha features:

1. Check the System Status panel to ensure alpha testing is enabled
2. Verify that specific alpha features are enabled in the configuration
3. Look for errors in the browser console related to alpha features
4. Try disabling specific alpha features to isolate issues

## Backend Setup

This project includes a Python Flask backend that requires additional setup:

### 1. Install Python Dependencies

```bash
# Navigate to the project root directory
cd mashaaer-enhanced-project

# Install Python dependencies using the requirements.txt file
pip install -r requirements.txt
```

> **Note**: The root requirements.txt file references the backend/requirements.txt file, which contains all the necessary Python packages.

### 2. Troubleshooting Tokenizers Installation

If you encounter issues installing the `tokenizers` package (especially on Python 3.13+ or systems without Rust compiler), use our fix script:

```bash
.\fix-tokenizers-install.bat
```

Or if you prefer PowerShell:

```powershell
.\fix-tokenizers-install.ps1
```

This script will handle the installation in a way that works around the Rust compiler requirement.

### 3. Starting the Backend

```bash
# Start the Flask backend
cd backend
python app.py
```

## Additional Information

- The project uses react-app-rewired to customize the webpack configuration without ejecting
- Node.js polyfills are configured in the config-overrides.js file
- All necessary dependencies are listed in the package.json file
- Alpha features can be monitored in the System Status panel
- The backend uses Flask and requires Python 3.8+ with the dependencies listed in requirements.txt
