/**
 * Help Page Router
 * 
 * This module registers the route for the Help Page component
 * and handles navigation to the help page.
 */

import HelpPage from '../components/HelpPage.jsx';
import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Initialize the help page router
 * This function registers the /help route with the application router
 */
export function initializeHelpPageRouter() {
  if (window.router) {
    // Register the /help route
    window.router.registerRoute('/help', () => {
      // Create a container for the help page if it doesn't exist
      let helpContainer = document.getElementById('help-page-container');
      if (!helpContainer) {
        helpContainer = document.createElement('div');
        helpContainer.id = 'help-page-container';
        document.body.appendChild(helpContainer);
      }

      // Render the HelpPage component in the container
      ReactDOM.render(<HelpPage />, helpContainer);
    });

    console.log('Help page route registered');
  } else {
    console.error('Router not available, help page route not registered');
  }
}

/**
 * Navigate to the help page
 * @param {string} language - Optional language parameter ('ar' or 'en')
 */
export function navigateToHelpPage(language) {
  if (window.router) {
    // Navigate to the help page with optional language parameter
    const route = language ? `/help?lang=${language}` : '/help';
    window.router.navigate(route);
  } else {
    console.error('Router not available, cannot navigate to help page');
  }
}

// Initialize the router when this module is loaded
if (typeof window !== 'undefined') {
  // Wait for the DOM to be fully loaded
  window.addEventListener('DOMContentLoaded', () => {
    initializeHelpPageRouter();
  });
}