# Production Deployment Guide for Mashaaer Enhanced Project

This guide explains how to deploy the Mashaaer Enhanced Project in production mode.

## Prerequisites

Make sure you have the following installed:

- Python 3.10+ environment
- Node.js 18+
- PostgreSQL database
- Required API keys (OpenAI, ElevenLabs, Google, etc.)

## 1. Environment Setup

Create a `.env` file in the project root with your configuration:

```
# API Keys
OPENAI_API_KEY=your_openai_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_VOICE_ID=your_elevenlabs_voice_id_here

# Database Configuration
DATABASE_URL=postgresql://user:pass@host:5432/mashaaer

# Application Settings
DEFAULT_LANGUAGE=ar
DEBUG=false
ENABLE_FACIAL_RECOGNITION=false

# CORS Settings (for production)
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

You can use the `.env.example` file as a template.

## 2. Install Dependencies

### Python Dependencies

```bash
# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Linux/Mac
venv\Scripts\activate     # On Windows

# Install dependencies
pip install -r backend/requirements.txt
```

### Node.js Dependencies

```bash
# Install frontend dependencies
npm install
```

## 3. Build the Frontend

```bash
# Build the React application
npm run build
```

This will create a `build` directory with the production-ready frontend.

## 4. Initialize the Database

```bash
# Create database tables
python backend/db_init.py
```

Make sure your PostgreSQL database is running and accessible with the credentials specified in your `.env` file.

## 5. Production Deployment Options

### Option A: Run with Gunicorn (Recommended for Production)

```bash
# Copy the built frontend to the Flask static directory
xcopy /E /Y build\* backend\static\  # On Windows
cp -r build/* backend/static/        # On Linux/Mac

# Run with Gunicorn
gunicorn --bind 0.0.0.0:5000 --workers 4 --timeout 120 backend.app:app
```

### Option B: Docker Deployment

Build and run the Docker container:

```bash
# Build the Docker image
docker build -t mashaaer-enhanced .

# Run the container
docker run -p 5000:5000 --env-file .env mashaaer-enhanced
```

### Option C: VPS Deployment with Nginx

1. Deploy the application using Gunicorn as in Option A
2. Configure Nginx to proxy requests to the Gunicorn server:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Option D: Netlify Deployment

For the frontend only:

1. Set up a new site in Netlify
2. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
3. Deploy your backend separately and update the API endpoints in your frontend code

## 6. Final Security Checklist

Before going live, ensure:

- [ ] DEBUG=false in your .env file
- [ ] Database connection is secure and working
- [ ] All API keys are valid and secure
- [ ] CORS settings are properly configured for your domain
- [ ] HTTPS is enabled for production
- [ ] Temporary files and debug logs are removed

## Accessing the Application

Once deployed, you can access the application at:

```
http://yourdomain.com
```

Or locally at:

```
http://localhost:5000
```

## Troubleshooting

### Database Connection Issues

If you encounter database connection problems:

1. Verify your DATABASE_URL is correct
2. Ensure PostgreSQL is running
3. Check that the database user has the necessary permissions

### API Key Issues

If AI features aren't working:

1. Verify all API keys in your .env file
2. Check API usage limits and billing status
3. Test API connections individually

## Additional Information

For more detailed information about the Mashaaer Enhanced Project, refer to the main [README.md](README.md) file.
