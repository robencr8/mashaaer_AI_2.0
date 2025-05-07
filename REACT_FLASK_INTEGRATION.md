# React-Flask Integration Guide

This guide explains how to integrate the React frontend with the Flask backend in the Mashaaer Enhanced Project.

## Overview

The integration process involves:
1. Building the React application
2. Copying the build output to the Flask backend's static directory
3. Creating template files in the Flask backend's templates directory
4. Configuring Flask routes to serve the React application

## Quick Start

The easiest way to build and deploy the React application to the Flask backend is to use the provided script:

```
build-and-deploy.bat
```

This script will:
1. Build the React application using `npm run build`
2. Copy the build output to the Flask backend's static directory
3. Create necessary template files in the Flask backend's templates directory

After running the script, you can start the Flask application to serve the React frontend using the provided script:

```
run-flask.bat
```

Or manually with:

```
python backend/app.py
```

## Access the Application

Once the Flask application is running, you can access the React frontend at any of these URLs:

- http://localhost:5000/ - Main entry point (uses templates/index.html)
- http://localhost:5000/launch - Alternative entry point (uses templates/launch.html)
- http://localhost:5000/index - Direct access to static/index.html
- http://localhost:5000/static/index.html - Direct access to static/index.html

## Manual Process

If you prefer to perform the integration manually, follow these steps:

### 1. Build the React Application

```
npm run build
```

This will create a `build` directory containing the compiled React application.

### 2. Copy Build Output to Flask Backend

Copy the contents of the `build` directory to the Flask backend's `static` directory:

```
xcopy /E /Y build\* backend\static\
```

### 3. Create Template Files

Create the following files in the Flask backend's `templates` directory:

**index.html**:
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

**launch.html**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mashaaer Enhanced</title>
    <link rel="stylesheet" href="/static/css/main.css">
</head>
<body>
    <div id="root"></div>
    <script>
        // Dynamically load the main JS file from static directory
        const script = document.createElement('script');
        script.src = '/static/js/main.js';
        document.body.appendChild(script);
    </script>
</body>
</html>
```

### 4. Configure Flask Routes

Ensure your Flask application has the following routes:

```python
from flask import Flask, render_template, send_from_directory

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    """Root route that serves the React application"""
    return render_template('index.html')

@app.route('/launch', methods=['GET'])
def launch():
    """Launch route that serves the React application"""
    return render_template('launch.html')

@app.route('/index', methods=['GET'])
def index_html():
    """Route to serve the static index.html file"""
    return send_from_directory('static', 'index.html')
```

## Development Workflow

During development, you can:

1. Run the React development server:
   ```
   npm start
   ```
   This will start the React development server at http://localhost:3000/

2. Run the Flask backend:
   ```
   python backend/app.py
   ```
   This will start the Flask server at http://localhost:5000/

3. When you're ready to deploy, run:
   ```
   build-and-deploy.bat
   ```
   This will build the React app and deploy it to the Flask backend.

## Troubleshooting

### React Build Issues

If you encounter issues building the React application:

1. Check for errors in the npm build output
2. Try running `npm install` to ensure all dependencies are installed
3. Check the React application's configuration files

### Flask Serving Issues

If the Flask application is not serving the React frontend correctly:

1. Ensure the static and templates directories exist in the backend directory
2. Check that the build output was copied correctly to the static directory
3. Verify that the Flask routes are configured correctly
4. Check the Flask server logs for any errors

### Path Issues

If you encounter path-related issues:

1. Ensure the React application is built with the correct public URL
2. Check that static file paths in the HTML files are correct
3. Verify that the Flask application is serving static files correctly

## Additional Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Flask Static Files](https://flask.palletsprojects.com/en/2.0.x/tutorial/static/)
- [Flask Templates](https://flask.palletsprojects.com/en/2.0.x/tutorial/templates/)
