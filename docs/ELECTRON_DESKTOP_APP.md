# Creating a Desktop Version of Mashaaer with Electron

This guide explains how to create a desktop version of the Mashaaer Enhanced application using Electron.

## Overview

Electron is a framework that allows you to build cross-platform desktop applications using web technologies like JavaScript, HTML, and CSS. This guide will walk you through the process of packaging the Mashaaer Enhanced application as a desktop application for Windows, macOS, and Linux.

## Prerequisites

- Node.js and npm installed
- PowerShell (for Windows) or Terminal (for macOS/Linux)
- The Mashaaer Enhanced project cloned and set up

## Step 1: Build the React Application

First, you need to build the React application:

```powershell
# Navigate to the project root
cd path\to\mashaaer-enhanced-project

# Install dependencies if not already installed
npm install

# Build the React application
npm run build
```

## Step 2: Package the Application with Electron

The project includes an Electron packaging script that will create a desktop application:

```powershell
# Navigate to the Electron packaging directory
cd packaging\electron

# Install Electron dependencies
npm install

# Run the packaging script for Windows
.\package-electron.ps1
```

This will create an installer in the `packaging\electron\dist` directory.

## Step 3: Install and Run the Desktop Application

1. Navigate to `packaging\electron\dist`
2. Run the installer (`MashaaerEnhanced-Setup-1.0.0.exe`)
3. Follow the installation instructions
4. Launch the application from the desktop shortcut or start menu

## Auto-Launch Electron and Backend in One Click

For development and testing, you can launch both the Electron app and the Flask backend server with a single command:

### Using the Batch File (Windows)

Simply double-click the `start-electron.bat` file in the project root directory. This will:

1. Check if Node.js and Python are installed
2. Start the Flask backend server
3. Launch the Electron app
4. Log all output to `electron-app-launcher.log` for debugging

### Using npm

Run the following command from the project root:

```bash
npm run start-electron
```

This will start both the Flask backend server and the Electron app in one process.

## Customizing the Electron Application

If you want to customize the Electron application, you can modify the following files:

- `packaging\electron\main.js` - The main Electron process
- `packaging\electron\preload.js` - Preload script for secure communication between processes
- `packaging\electron\package.json` - Configuration for the Electron application

### Changing the Application Icon

To change the application icon:

1. Replace the `icon.ico` file in the `packaging\electron` directory with your own icon
2. Make sure the icon is in ICO format for Windows, ICNS format for macOS, or PNG format for Linux

### Modifying the Build Configuration

You can modify the build configuration in the `package.json` file:

```json
"build": {
  "appId": "com.mashaaer.enhanced",
  "productName": "Mashaaer Enhanced",
  "directories": {
    "output": "dist"
  },
  // Other configuration options...
}
```

## Building for Other Platforms

### macOS

```powershell
# Navigate to the Electron packaging directory
cd packaging\electron

# Install dependencies
npm install

# Build for macOS
npm run build:mac
```

### Linux

```powershell
# Navigate to the Electron packaging directory
cd packaging\electron

# Install dependencies
npm install

# Build for Linux
npm run build:linux
```

## Troubleshooting

### Common Issues

1. **Missing dependencies**: Make sure you have installed all dependencies with `npm install`
2. **Build errors**: Check the console output for specific error messages
3. **Icon not showing**: Make sure the icon file is in the correct format and location
4. **Flask server not starting**: Check that the Flask server is properly configured in `main.js`

### Getting Help

If you encounter any issues, please check the following resources:

- [Electron Documentation](https://www.electronjs.org/docs)
- [Electron Builder Documentation](https://www.electron.build/)
- Project README files

## Conclusion

You now have a desktop version of the Mashaaer Enhanced application that can be distributed and installed on Windows, macOS, and Linux. This provides a more native experience for users and allows the application to be used offline.
