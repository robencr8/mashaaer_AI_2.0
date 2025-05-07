# Mashaaer Enhanced - Production Deployment Guide

This document provides instructions for building and deploying the Mashaaer Enhanced application to production environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Building the Frontend](#building-the-frontend)
3. [Setting Up the Backend](#setting-up-the-backend)
4. [Deployment Options](#deployment-options)
   - [Frontend Deployment with Netlify](#frontend-deployment-with-netlify)
   - [Backend Deployment with Render](#backend-deployment-with-render)
   - [Alternative: Fly.io for Backend](#alternative-flyio-for-backend)
5. [Testing the Production Build](#testing-the-production-build)
6. [PWA Functionality](#pwa-functionality)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying to production, ensure you have:

- Node.js v18.x (recommended) or v16.x
- Python 3.10 (recommended for full functionality)
- Git
- Accounts on deployment platforms (Netlify, Render, or Fly.io)
- Access to the project repository

## Building the Frontend

To build the React frontend for production:

1. Navigate to the project directory:
   ```
   cd mashaaer-enhanced-project
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the production version:
   ```
   npm run build
   ```

4. The build output will be in the `build` directory, ready for deployment.

## Setting Up the Backend

To prepare the Flask backend for production:

1. Navigate to the backend directory:
   ```
   cd mashaaer-enhanced-project/backend
   ```

2. Install production dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Test the production setup with gunicorn:
   ```
   gunicorn app:app
   ```

   For Windows users, install and test with waitress:
   ```
   pip install waitress
   python -m waitress-serve --port=5000 app:app
   ```

## Deployment Options

### Frontend Deployment with Netlify

1. **Automatic Deployment with GitHub**:
   - Connect your GitHub repository to Netlify
   - Set the build command to `npm run build`
   - Set the publish directory to `build`
   - Netlify will automatically deploy when you push to the main branch

2. **Manual Deployment**:
   - Install Netlify CLI: `npm install -g netlify-cli`
   - Login to Netlify: `netlify login`
   - Deploy the build folder: `netlify deploy --prod --dir=build`

3. **Environment Variables**:
   - Set `REACT_APP_BACKEND_URL` to your backend URL
   - Set `REACT_APP_ENV` to `production`

### Backend Deployment with Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `cd backend && gunicorn app:app`
   - Environment Variables:
     - `FLASK_ENV`: `production`
     - `DEBUG`: `false`
     - `DATABASE_URL`: Your database URL (if applicable)
     - `CORS_ALLOWED_ORIGINS`: Your frontend URL (e.g., `https://mashaaer.netlify.app`)

### Alternative: Fly.io for Backend

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login to Fly: `fly auth login`
3. Create a new app: `fly apps create mashaaer-backend`
4. Create a `fly.toml` file in the backend directory:
   ```toml
   app = "mashaaer-backend"
   
   [build]
     builder = "paketobuildpacks/builder:base"
   
   [env]
     FLASK_ENV = "production"
     DEBUG = "false"
   
   [http_service]
     internal_port = 8080
     force_https = true
   ```
5. Deploy the app: `fly deploy`

## Testing the Production Build

Before deploying to production, test the build locally:

1. Install serve: `npm install -g serve`
2. Serve the build directory: `serve -s build`
3. In another terminal, run the backend with gunicorn or waitress
4. Test all functionality, especially API interactions

## PWA Functionality

The application is configured as a Progressive Web App (PWA) with:

- Offline functionality
- Installable on mobile devices
- Service worker for caching

To test PWA functionality:

1. Build and deploy the application
2. Open the deployed site in Chrome
3. Use Chrome DevTools > Application > Service Workers to verify registration
4. Test offline functionality by enabling "Offline" in the Network tab
5. On mobile, use "Add to Home Screen" to install the app

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure `CORS_ALLOWED_ORIGINS` is set correctly in backend environment
   - Check that the frontend is using the correct backend URL

2. **Service Worker Not Registering**:
   - Ensure the site is served over HTTPS
   - Check browser console for errors

3. **Database Connection Issues**:
   - Verify database credentials and connection string
   - Check if the database is accessible from the deployment environment

4. **Build Failures**:
   - Check Node.js and Python versions
   - Ensure all dependencies are installed

For more detailed troubleshooting, check the logs on your deployment platform.