# Creating a Distributable Version of Mashaaer

This guide explains how to create a distributable version of the Mashaaer Enhanced application that can be easily shared with others.

## Overview

The Mashaaer Enhanced project includes scripts to create a distributable version of the application that includes:

1. The React frontend
2. The Flask backend
3. The Electron desktop application
4. A unified launcher that starts both the backend and frontend with a single click

The distributable can be created in two formats:
- An installer (EXE) for Windows
- A zipped portable version that can be extracted and run without installation

## Prerequisites

- Windows operating system
- PowerShell 5.0 or later
- Node.js and npm installed
- Python installed
- The Mashaaer Enhanced project cloned and set up

## Creating the Distributable

### Using the Batch File (Recommended)

The easiest way to create the distributable is to use the provided batch file:

1. Open a Command Prompt or PowerShell window
2. Navigate to the project root directory
3. Run the batch file:
   ```
   .\create-distributable.bat
   ```
4. Follow the prompts and wait for the process to complete

### Using PowerShell Directly

If you prefer to use PowerShell directly:

1. Open a PowerShell window
2. Navigate to the project root directory
3. Run the PowerShell script:
   ```powershell
   .\create-distributable.ps1
   ```
4. Wait for the process to complete

## Output Files

The script creates the following files in the `dist` directory:

1. **Installer**: `MashaaerEnhanced-Setup-1.0.0.exe` - A Windows installer that can be used to install the application
2. **Zip File**: `MashaaerEnhanced-1.0.0-full.zip` - A zipped version of the portable application
3. **Launcher**: `MashaaerEnhanced-1.0.0-launcher` - A directory containing the launcher files

## Distribution Options

### Option 1: Distribute the Installer

The installer is the easiest way for users to install the application. It creates desktop and start menu shortcuts and can be uninstalled through the Windows Control Panel.

To distribute the installer:
1. Share the `MashaaerEnhanced-Setup-1.0.0.exe` file with users
2. Instruct users to run the installer and follow the prompts
3. After installation, users can launch the application from the desktop shortcut or start menu

### Option 2: Distribute the Zip File

The zip file contains a portable version of the application that can be run without installation. This is useful for users who don't have administrator privileges or prefer not to install applications.

To distribute the zip file:
1. Share the `MashaaerEnhanced-1.0.0-full.zip` file with users
2. Instruct users to extract the zip file to a directory of their choice
3. After extraction, users can launch the application by double-clicking the `start-electron.bat` file

### Option 3: Distribute the Launcher Only

If users already have the application installed or have access to a shared installation, you can distribute just the launcher files. This is useful for creating shortcuts to a shared installation.

To distribute the launcher:
1. Share the contents of the `MashaaerEnhanced-1.0.0-launcher` directory with users
2. Instruct users to place the files in a directory where they have the application installed
3. Users can launch the application by double-clicking the `start-electron.bat` file

## Customization

### Changing the Version Number

To change the version number of the distributable:

1. Open the `create-distributable.ps1` file
2. Modify the `$appVersion` variable at the top of the file
3. Save the file and run the script again

### Changing the Application Name

To change the name of the distributable:

1. Open the `create-distributable.ps1` file
2. Modify the `$appName` variable at the top of the file
3. Save the file and run the script again

## Troubleshooting

### Script Execution Policy

If you encounter an error related to script execution policy when running the PowerShell script directly, you can bypass the policy by running:

```powershell
powershell -ExecutionPolicy Bypass -File create-distributable.ps1
```

### Build Errors

If you encounter errors during the build process:

1. Make sure all dependencies are installed by running `npm install` in the project root directory
2. Make sure Python is installed and available in the PATH
3. Check the error messages for specific issues and resolve them

### Packaging Errors

If you encounter errors during the packaging process:

1. Make sure Electron dependencies are installed by running `npm install` in the `packaging/electron` directory
2. Check the error messages for specific issues and resolve them

## Hosting the Distributable

After creating the distributable, you may want to host it for download. For detailed instructions on hosting options, see [HOSTING_DISTRIBUTABLE.md](HOSTING_DISTRIBUTABLE.md).

### Automated Upload Scripts

To make hosting easier, the project includes scripts for uploading the distributable to popular platforms:

#### GitHub Releases

To upload the distributable to GitHub Releases:

1. Run the batch file:
   ```
   .\upload-to-github.bat
   ```
2. Follow the prompts to enter your GitHub repository information and personal access token.

#### Google Drive

To upload the distributable to Google Drive:

1. Install the GoogleDrive PowerShell module:
   ```powershell
   Install-Module -Name GoogleDrive
   ```
2. Run the batch file:
   ```
   .\upload-to-gdrive.bat
   ```
3. Follow the prompts to authenticate with Google Drive.

## Conclusion

By following this guide, you can create a distributable version of the Mashaaer Enhanced application that can be easily shared with others. The distributable includes everything needed to run the application, including the React frontend, Flask backend, and Electron desktop application, all launched with a single click.

For information on hosting the distributable for download, see [HOSTING_DISTRIBUTABLE.md](HOSTING_DISTRIBUTABLE.md).
