# Mashaaer Enhanced Project Deployment Guide

This guide provides instructions for deploying the Mashaaer Enhanced Project to various platforms and configuring different environments.

## Table of Contents

- [Environment Configuration](#environment-configuration)
- [Deployment Options](#deployment-options)
  - [Netlify](#netlify)
  - [Vercel](#vercel)
  - [GitHub Pages](#github-pages)
- [Electron Desktop App](#electron-desktop-app)
- [PWA (Progressive Web App)](#pwa-progressive-web-app)

## Environment Configuration

The project supports multiple environments through environment-specific configuration files:

- `.env.development` - Development environment configuration
- `.env.staging` - Staging environment configuration
- `.env.production` - Production environment configuration

### Building for Different Environments

Use the following npm scripts to build the application for different environments:

```bash
# Development build
npm run build

# Staging build
npm run build:staging

# Production build
npm run build:production
```

## Deployment Options

### Netlify

The project is configured for deployment to Netlify with the `netlify.toml` file.

#### Deploying to Netlify

1. Install the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Deploy to Netlify:
   ```bash
   npm run deploy:netlify
   ```

Alternatively, you can connect your GitHub repository to Netlify for automatic deployments.

#### Netlify Configuration

The `netlify.toml` file includes:

- Build command and publish directory
- Environment-specific configurations for production, deploy previews, and branch deploys
- SPA routing configuration
- Security headers
- Cache control settings

### Vercel

The project is configured for deployment to Vercel with the `vercel.json` file.

#### Deploying to Vercel

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy to Vercel:
   ```bash
   npm run deploy:vercel
   ```

Alternatively, you can connect your GitHub repository to Vercel for automatic deployments.

#### Vercel Configuration

The `vercel.json` file includes:

- Build command and output directory
- Routing configuration for SPA
- Security headers
- Cache control settings
- Environment variables

### GitHub Pages

The project is configured for deployment to GitHub Pages with a GitHub Actions workflow.

#### Deploying to GitHub Pages

1. Install the gh-pages package (if not already installed):
   ```bash
   npm install --save-dev gh-pages
   ```

2. Deploy to GitHub Pages:
   ```bash
   npm run deploy:gh-pages
   ```

Alternatively, the GitHub Actions workflow will automatically deploy the application when changes are pushed to the main branch.

#### GitHub Pages Configuration

The `.github/workflows/github-pages-deploy.yml` file includes:

- Workflow trigger configuration (push to main branch)
- Node.js setup
- Build steps with environment variables
- Deployment to the gh-pages branch

## Electron Desktop App

The project can be packaged as a desktop application using Electron.

### Packaging the Electron App

```bash
npm run package:electron
```

This will:
1. Build the React application
2. Install Electron dependencies
3. Package the application for Windows
4. Create an installer and portable version

### Electron Configuration

The Electron configuration is located in the `packaging/electron` directory:

- `main.js` - Main Electron process
- `preload.js` - Preload script for the renderer process
- `package.json` - Electron app configuration
- `package-electron.ps1` - PowerShell script for packaging

## PWA (Progressive Web App)

The project is configured as a Progressive Web App (PWA) with offline capabilities.

### PWA Features

- **Manifest**: The `public/manifest.json` file defines the app's appearance and behavior when installed.
- **Service Worker**: The `public/service-worker.js` file provides offline capabilities and caching.
- **Icons**: Various sized icons are provided for different devices and platforms.

### Testing PWA Features

1. Build the application:
   ```bash
   npm run build:production
   ```

2. Test offline capabilities and run Lighthouse audit:
   ```bash
   npm run test:pwa-offline
   ```

   This script will:
   - Start a local server to serve the build directory
   - Open the application in your default browser
   - Provide instructions for testing offline mode
   - Guide you through running a Lighthouse audit
   - Show how to install the PWA locally

   **Windows users** can also use the provided convenience scripts:
   - Double-click `test-pwa-offline.bat` (Batch file)
   - Right-click `test-pwa-offline.ps1` and select "Run with PowerShell"

   The PowerShell script includes additional checks and will offer to build the application if needed.

3. Alternatively, you can manually serve the build directory:
   ```bash
   npx serve -s build
   ```

   Then open the application in Chrome and use the Lighthouse tab in DevTools to audit PWA features.

### Installing the PWA

Users can install the PWA by:

1. Visiting the deployed application in a supported browser (Chrome, Edge, etc.)
2. Clicking the install button in the address bar or using the "Add to Home Screen" option in the browser menu.
