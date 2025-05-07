# Frontend Build Guide for Mashaaer Enhanced

This guide explains how to build the React frontend and copy it to the Flask backend for serving.

## Problem

If you see a blank page when accessing the application, it might be because the React frontend build files are not properly copied to the Flask backend's static directory. The following error messages in the logs indicate this issue:

```
GET /static/js/main.d9eb5e2a.js HTTP/1.1" 404 -
GET /static/css/main.1d114b90.css HTTP/1.1" 404 -
```

This means Flask is looking for the build files in the `backend/static/js` and `backend/static/css` directories but can't find them.

## Solution

We need to build the React frontend and copy the build files to the Flask backend's static directory. We've provided two scripts to automate this process:

1. `frontend-build.bat` - Batch file for Windows Command Prompt users
2. `frontend-build.ps1` - PowerShell script for Windows PowerShell users

### Using Command Prompt

1. Open Command Prompt
2. Navigate to the project directory
3. Run the script:
   ```
   frontend-build.bat
   ```

### Using PowerShell

1. Open PowerShell
2. Navigate to the project directory
3. Run the script:
   ```
   .\frontend-build.ps1
   ```

## What the Scripts Do

Both scripts perform the following steps:

1. Install dependencies using `npm install`
2. Build the React frontend using `npm run build`
3. Copy the build files to the Flask backend's static directory
4. Create a template file in the Flask backend's templates directory that redirects to the static/index.html file

## Manual Steps

If you prefer to do this manually, follow these steps:

1. Navigate to the project directory
2. Install dependencies:
   ```
   npm install
   ```
3. Build the React frontend:
   ```
   npm run build
   ```
4. Copy the build files to the Flask backend's static directory:
   ```
   xcopy /E /I /Y build backend\static
   ```
5. Create a simple index.html file in the templates directory that redirects to the static/index.html:
   ```html
   <!DOCTYPE html>
   <html>
   <head>
       <meta charset="UTF-8">
       <meta http-equiv="refresh" content="0;url=/static/index.html">
       <title>Mashaaer Enhanced</title>
   </head>
   <body>
       <p>If you are not redirected automatically, follow this <a href="/static/index.html">link to the application</a>.</p>
   </body>
   </html>
   ```

## Running the Application

After building and copying the React frontend, you can run the Flask application:

```
cd backend
python app.py
```

Then open your browser and navigate to:
```
http://127.0.0.1:5000
```

You should now see the React frontend properly rendered by the Flask backend.

## Troubleshooting

If you still see a blank page:

1. Check if the build directory was created successfully
2. Check if the files were copied to the backend/static directory
3. Check the browser console for any JavaScript errors
4. Check the Flask server logs for any errors
5. Make sure the Flask server is running and accessible at http://127.0.0.1:5000