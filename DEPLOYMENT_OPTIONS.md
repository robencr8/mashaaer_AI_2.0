# Mashaaer Enhanced Project - Deployment Options

This document provides instructions for the deployment options mentioned in your request:

1. [Upload the build to a platform (Netlify, Vercel, GitHub)](#upload-the-build-to-a-platform)
2. [Generate the final .exe Electron app package](#generate-the-final-exe-electron-app-package)
3. [Simulate offline PWA mode or test Lighthouse performance](#simulate-offline-pwa-mode-or-test-lighthouse-performance)

## Upload the build to a platform

The project is configured for deployment to multiple platforms. Choose one of the following options:

**Windows users** can use the provided interactive deployment tools:
- Double-click `deploy-app.bat` (Batch file)
- Right-click `deploy-app.ps1` and select "Run with PowerShell" (PowerShell script)

These interactive scripts will guide you through deploying to Netlify, Vercel, or GitHub Pages. The PowerShell script includes additional features like checking for prerequisites and offering to install them if missing.

Alternatively, you can use the following commands directly:

### Netlify

```bash
npm run deploy:netlify
```

This command will:
1. Build the application for production
2. Deploy it to Netlify

Prerequisites:
- Install Netlify CLI: `npm install -g netlify-cli`
- Log in to Netlify: `netlify login`

### Vercel

```bash
npm run deploy:vercel
```

This command will:
1. Build the application for production
2. Deploy it to Vercel

Prerequisites:
- Install Vercel CLI: `npm install -g vercel`
- Log in to Vercel: `vercel login`

### GitHub Pages

```bash
npm run deploy:gh-pages
```

This command will:
1. Build the application for production
2. Deploy it to GitHub Pages

Prerequisites:
- Make sure the `gh-pages` package is installed: `npm install --save-dev gh-pages`

## Generate the final .exe Electron app package

To generate the Electron app package:

```bash
npm run package:electron
```

This command will:
1. Build the React application
2. Install Electron dependencies
3. Package the application for Windows
4. Create an installer and portable version

**Windows users** can also use the provided convenience script:
- Double-click `package-electron.bat` (Batch file)

The output will be in:
- `packaging/electron/dist/win-unpacked` (portable version)
- `packaging/electron/dist/MashaaerEnhanced-Setup-1.0.0.exe` (installer)

## Simulate offline PWA mode or test Lighthouse performance

To test the PWA's offline capabilities and performance:

### Using npm script

```bash
npm run test:pwa-offline
```

This script will:
- Start a local server to serve the build directory
- Open the application in your default browser
- Provide instructions for testing offline mode
- Guide you through running a Lighthouse audit
- Show how to install the PWA locally

### Windows convenience scripts

For Windows users, we've provided two convenience scripts:

1. **Batch file**: Double-click `test-pwa-offline.bat`
2. **PowerShell script**: Right-click `test-pwa-offline.ps1` and select "Run with PowerShell"

The PowerShell script includes additional checks and will offer to build the application if needed.

### Testing offline mode manually

1. Build the application:
   ```bash
   npm run build
   ```

2. Serve the build directory:
   ```bash
   npx serve -s build
   ```

3. Open Chrome and navigate to the application
4. Open DevTools (F12 or Ctrl+Shift+I)
5. Go to the "Application" tab
6. In the left sidebar, under "Service Workers", check "Offline"
7. Refresh the page to see how the app behaves offline

### Running Lighthouse audit manually

1. Open Chrome and navigate to the application
2. Open DevTools (F12 or Ctrl+Shift+I)
3. Go to the "Lighthouse" tab
4. Select the categories you want to audit (make sure "Progressive Web App" is checked)
5. Click "Generate report"

## Additional Information

For more detailed information about deployment options and configuration, please refer to the [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) file.
