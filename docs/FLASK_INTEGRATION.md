# Flask Backend Integration

This document provides information about integrating the React frontend with the Flask backend in the Mashaaer Enhanced project.

## Overview

The Mashaaer Enhanced project now includes integration with a Flask backend to provide:
1. Advanced language model processing via the `/ask` endpoint
2. Text-to-speech functionality via the `/api/tts` endpoint
3. Offline fallback capabilities when the backend is unavailable

## API Endpoints

### `/ask` Endpoint

This endpoint processes user messages and returns responses from the language model.

#### Request Format
```json
{
  "prompt": "User message here",
  "userProfile": {
    "preferredTone": "cheerful",
    "language": "ar-SA",
    "emotionalState": "happy",
    "emotionalIntensity": 0.8
  }
}
```

#### Response Format
```json
{
  "success": true,
  "result": "Assistant response here",
  "metadata": {
    "model": "flask-backend",
    "emotion": "happy",
    "tone": "cheerful"
  }
}
```

### `/api/tts` Endpoint

This endpoint converts text to speech and returns an audio file.

#### Request Format
```json
{
  "text": "Text to convert to speech",
  "emotion": "happy"
}
```

#### Response
The response is an audio blob (audio/mpeg) that can be played directly in the browser.

## Setting Up the Flask Backend

1. Navigate to the Flask backend directory:
```
cd flask-backend
```

2. Create a virtual environment:
```
python -m venv venv
```

3. Activate the virtual environment:
```
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. Install dependencies:
```
pip install -r requirements.txt
```

5. Start the Flask server:
```
python app.py
```

The server will start on `http://localhost:5000` by default.

## Integration in React

The React frontend communicates with the Flask backend using the API service defined in `src/api/flask-api-service.js`. This service provides functions for:

1. Sending prompts to the Flask backend
2. Requesting text-to-speech conversion
3. Playing audio responses

### Example Usage

```javascript
import { sendPromptToFlask, requestTTS, playAudioBlob } from '../api/flask-api-service';

// Send a prompt to the Flask backend
const response = await sendPromptToFlask("مرحبا", {
  preferredTone: "cheerful",
  language: "ar-SA"
});

// Request TTS from the Flask backend
const audioBlob = await requestTTS("مرحبا", "happy");

// Play the audio
await playAudioBlob(audioBlob);
```

## Fallback Mechanism

The frontend includes a fallback mechanism for when the Flask backend is unavailable:

1. If the `/ask` endpoint fails, the frontend falls back to the local LLM multiengine
2. If the `/api/tts` endpoint fails, the frontend falls back to the Web Speech API

This ensures that the application can continue to function even when offline or when the backend is experiencing issues.

## Offline Support

The application includes a service worker that caches API responses, allowing it to work offline. When offline:

1. The service worker serves cached responses for API requests
2. The frontend falls back to local processing for new requests
3. The application displays a notification that it's operating in offline mode

## Troubleshooting

### CORS Issues
If you encounter CORS issues, ensure that the Flask backend has CORS enabled:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
```

### Connection Refused
If you see "Connection refused" errors:
1. Ensure the Flask server is running
2. Check that the port matches (default is 5000)
3. Verify that no firewall is blocking the connection

### Audio Playback Issues
If TTS audio doesn't play:
1. Check browser console for errors
2. Ensure the audio format is supported by the browser
3. Try toggling between Flask TTS and Web Speech API using the TTS button