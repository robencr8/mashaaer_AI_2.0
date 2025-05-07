import React from 'react';
import ReactDOM from 'react-dom/client';

// Import App
import App from './App.js';

// Import emotion-based themes
import './styles/emotion-themes.css';

// Import service worker registration
import * as serviceWorkerRegistration from './serviceWorkerRegistration.js';

// Import console filter utility
import { initializeConsoleFilter } from './utils/console-filter.js';

// Initialize console filter to hide errors from browser extensions
initializeConsoleFilter();

// Import ServicesProvider
import { ServicesProvider } from './context/services-context.js';

// Mount React App with ServicesProvider
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ServicesProvider>
    <App />
  </ServicesProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
