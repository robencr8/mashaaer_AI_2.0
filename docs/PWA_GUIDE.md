# Progressive Web App (PWA) Guide

This document provides information about the Progressive Web App (PWA) features in the Mashaaer Enhanced project.

## Overview

The Mashaaer Enhanced project has been converted to a Progressive Web App (PWA), which provides:
1. Offline functionality
2. Installability on devices
3. App-like experience
4. Background synchronization

## Features

### Offline Functionality

The application can work offline thanks to the service worker, which:
- Caches static assets (HTML, CSS, JS, images)
- Caches API responses
- Provides fallback responses when offline
- Synchronizes data when back online

### Installability

The application can be installed on devices like a native app:
- On mobile devices, users can add it to their home screen
- On desktop, users can install it from the browser
- The app will have its own icon and launch screen

### App-like Experience

The application provides an app-like experience:
- Runs in a standalone window (no browser UI)
- Loads quickly from cache
- Works offline
- Provides push notifications (if enabled)

## How to Install

### On Mobile (Android)

1. Open the application in Chrome
2. Tap the menu button (three dots)
3. Select "Add to Home Screen"
4. Follow the prompts to install

### On Mobile (iOS)

1. Open the application in Safari
2. Tap the share button
3. Select "Add to Home Screen"
4. Follow the prompts to install

### On Desktop (Chrome)

1. Open the application in Chrome
2. Look for the install icon in the address bar (a plus sign or computer icon)
3. Click the icon and follow the prompts to install

### On Desktop (Edge)

1. Open the application in Edge
2. Look for the install icon in the address bar
3. Click the icon and follow the prompts to install

## Technical Implementation

### Service Worker

The service worker (`public/service-worker.js`) handles:
- Caching static assets during installation
- Intercepting fetch requests
- Serving cached responses when offline
- Providing fallback responses for API requests

### Manifest

The manifest file (`public/manifest.json`) provides:
- App name and description
- Icons in various sizes
- Theme colors
- Display mode (standalone)
- Orientation
- Language and direction

### Registration

The service worker is registered in `src/index.js` using the registration code in `src/serviceWorkerRegistration.js`.

## Offline Capabilities

### What Works Offline

- Viewing previously loaded conversations
- Sending new messages (will be queued for sending when online)
- Playing previously cached TTS audio
- Accessing all static content (UI, images, etc.)

### What Requires Internet

- Getting responses from the Flask backend (falls back to local processing)
- Generating new TTS audio (falls back to Web Speech API)
- Syncing new messages with the server

## Testing Offline Mode

To test the offline functionality:
1. Load the application while online
2. Interact with it to cache some responses
3. Disconnect from the internet (turn off Wi-Fi or use browser DevTools to simulate offline)
4. Continue using the application
5. Observe how it handles offline operation

## Troubleshooting

### App Not Installing

If you don't see the install option:
1. Make sure you're using a supported browser (Chrome, Edge, Safari, etc.)
2. Ensure you've visited the site at least twice
3. Check that you haven't already installed the app

### Offline Content Not Available

If content isn't available offline:
1. Make sure you've visited the content while online first
2. Check that the service worker is registered (look in DevTools > Application > Service Workers)
3. Clear the cache and reload if necessary

### Updates Not Appearing

If updates to the app aren't appearing:
1. Close all tabs of the application
2. Reopen the application
3. The service worker will update in the background

## Advanced Configuration

The service worker can be configured for different caching strategies:
- Cache-first: Fastest, but may serve stale content
- Network-first: Most up-to-date, but slower when online
- Stale-while-revalidate: Quick response with potentially stale content, updated in background

The current implementation uses:
- Cache-first for static assets
- Network-first for API requests
- Stale-while-revalidate for other requests