# PWA and Offline Voice Caching

This document explains how to use the Progressive Web App (PWA) features and offline voice caching in Mashaaer Enhanced.

## Overview

Mashaaer Enhanced now supports Progressive Web App (PWA) features, including offline functionality and voice caching. This means that:

1. The application can be installed on your device and used like a native app
2. The application can work offline or with a poor internet connection
3. Voice responses are cached for offline use

## Production Mode

The PWA features and offline voice caching are only enabled in production mode. To build the application in production mode, run:

```bash
npm run build
```

This will create a production build of the application in the `build` directory. You can then serve the application using a static file server or copy the files to the Flask backend's static directory.

## How Voice Caching Works

When you request a voice response in production mode:

1. The application first checks if the voice response is already cached
2. If it is, the cached response is used
3. If not, the application requests the voice response from the Flask backend
4. The response is then cached for future use

This means that if you request the same voice response again, it will be served from the cache, even if you're offline.

## Service Worker

The service worker is responsible for caching static assets and voice responses. It is automatically registered when the application is loaded in production mode.

The service worker caches:

1. Static assets (HTML, CSS, JS, images)
2. Voice responses from the Flask TTS API

## Voice Cache API

The voice cache API provides functions for working with the voice cache:

```javascript
import { getCachedVoice, cacheVoice, clearVoiceCache, getVoiceCacheSize } from '../utils/voice-cache';

// Get a cached voice response
const cachedVoice = await getCachedVoice(text, emotion);

// Cache a voice response
await cacheVoice(text, emotion, audioBlob);

// Clear the voice cache
await clearVoiceCache();

// Get the size of the voice cache
const cacheSize = await getVoiceCacheSize();
```

## Testing Offline Functionality

To test the offline functionality:

1. Build and run the application in production mode
2. Use the application to generate some voice responses
3. Disconnect from the internet
4. Try to use the application again

You should be able to:
- View the application
- Use previously cached voice responses
- See appropriate offline messages for uncached content

## Limitations

- Voice caching only works in production mode
- Voice caching requires a modern browser that supports the Cache API
- Voice caching requires HTTPS (except on localhost)
- The voice cache has a limited size (depends on the browser and device)

## Troubleshooting

If you're having issues with the PWA features or voice caching:

1. Make sure you're using a modern browser
2. Make sure you're using HTTPS (except on localhost)
3. Make sure you're using the application in production mode
4. Try clearing the cache and reloading the application

## Implementation Details

The implementation consists of:

1. A service worker that caches static assets and voice responses
2. A voice cache module that provides functions for working with the voice cache
3. Updates to the requestTTS function to use the voice cache

The service worker is registered in index.js and is only active in production mode. The voice cache module provides functions for caching and retrieving voice responses. The requestTTS function checks the cache before making a request to the Flask backend.