/**
 * Improvement Plan Router
 * 
 * This module registers the route for the Improvement Plan component
 * and handles navigation to the improvement plan page.
 */

import ImprovementPlan from '../ui/pages/ImprovementPlan.jsx';
import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Initialize the improvement plan router
 * This function registers the /improvement-plan route with the application router
 */
export function initializeImprovementPlanRouter() {
  if (window.router) {
    // Register the /improvement-plan route
    window.router.registerRoute('/improvement-plan', () => {
      // Create a container for the improvement plan page if it doesn't exist
      let planContainer = document.getElementById('improvement-plan-container');
      if (!planContainer) {
        planContainer = document.createElement('div');
        planContainer.id = 'improvement-plan-container';
        document.body.appendChild(planContainer);
      }

      // Render the ImprovementPlan component in the container
      ReactDOM.render(<ImprovementPlan />, planContainer);
    });

    console.log('Improvement plan route registered');
  } else {
    console.error('Router not available, improvement plan route not registered');
  }
}

/**
 * Navigate to the improvement plan page
 */
export function navigateToImprovementPlan() {
  if (window.router) {
    // Navigate to the improvement plan page
    window.router.navigate('/improvement-plan');
  } else {
    console.error('Router not available, cannot navigate to improvement plan');
  }
}

// Initialize the router when this module is loaded
if (typeof window !== 'undefined') {
  // Wait for the DOM to be fully loaded
  window.addEventListener('DOMContentLoaded', () => {
    initializeImprovementPlanRouter();
  });
}