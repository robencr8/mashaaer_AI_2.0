// Mashaaer Enhanced Service Worker
const CACHE_NAME = 'mashaaer-cache-v2';
const VOICE_CACHE_NAME = 'mashaaer-voice-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/static/js/main.js',
  '/static/css/main.css',
  '/cosmic-theme.js'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(STATIC_ASSETS);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME, VOICE_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // For API requests, try network first, then cache
  if (event.request.url.includes('/api/') || event.request.url.includes('/ask')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If the response is valid, clone it and store it in the cache
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
          }
          return response;
        })
        .catch(() => {
          // If network request fails, try to serve from cache
          return caches.match(event.request);
        })
    );
    return;
  }

  // For non-API requests, try cache first, then network
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          (response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Handle TTS API requests with caching
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/tts')) {
    event.respondWith(
      // Try to match the request in the voice cache
      caches.open(VOICE_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          // If we have a cached response, return it
          if (cachedResponse) {
            console.log('Found TTS response in cache:', event.request.url);
            return cachedResponse;
          }

          // Otherwise, fetch from network
          return fetch(event.request).then((response) => {
            // Clone the response to store in cache
            const responseToCache = response.clone();

            // Only cache successful responses
            if (response.ok) {
              // Extract the text and emotion from the request body to use as cache key
              return event.request.json().then((requestData) => {
                const { text, emotion } = requestData;
                const cacheKey = `tts-${text}-${emotion || 'neutral'}`;

                // Store the response in the voice cache
                cache.put(cacheKey, responseToCache);
                console.log('Cached TTS response for:', cacheKey);

                return response;
              }).catch(() => {
                // If we can't read the request body, just return the response without caching
                console.warn('Could not read TTS request body for caching');
                return response;
              });
            }

            return response;
          }).catch((error) => {
            console.error('Fetch failed for TTS request:', error);
            // Return a fallback response for offline TTS
            return new Response(
              new Blob([''], { type: 'audio/mpeg' }),
              { status: 200, statusText: 'Offline TTS Fallback' }
            );
          });
        });
      })
    );
    return;
  }

  // Handle other API requests with offline fallback
  if (event.request.url.includes('/api/') || event.request.url.includes('/ask')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return new Response(
            JSON.stringify({
              success: false,
              error: 'You are currently offline. Please check your connection.',
              isOffline: true
            }),
            {
              headers: { 'Content-Type': 'application/json' }
            }
          );
        })
    );
  }
});
