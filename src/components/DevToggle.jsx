import React, { useState, useEffect } from 'react';
import useAppStore from '../stores/useAppStore.js';

/**
 * DevToggle Component
 * 
 * A small floating button that toggles the visibility of the DebugPanel.
 * This component is only visible in development mode.
 */
const DevToggle = () => {
  const { accentColor } = useAppStore();
  const [showDebugPanel, setShowDebugPanel] = useState(true);
  
  // Load debug panel visibility setting on mount
  useEffect(() => {
    const debugPanelVisible = localStorage.getItem('mashaaer-debug-panel-visible');
    if (debugPanelVisible) {
      setShowDebugPanel(debugPanelVisible === 'true');
    }
  }, []);
  
  // Toggle debug panel visibility
  const toggleDebugPanelVisibility = () => {
    const newValue = !showDebugPanel;
    setShowDebugPanel(newValue);
    localStorage.setItem('mashaaer-debug-panel-visible', newValue.toString());
    
    // Dispatch a custom event that DebugPanel can listen for
    window.dispatchEvent(new CustomEvent('toggleDebugPanel', { detail: { visible: newValue } }));
  };
  
  // Only render in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div 
      onClick={toggleDebugPanelVisibility}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '40px',
        height: '40px',
        backgroundColor: accentColor,
        color: '#fff',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        zIndex: 9999,
        fontSize: '20px'
      }}
    >
      {showDebugPanel ? '🔽' : '🛠️'}
    </div>
  );
};

export default DevToggle;