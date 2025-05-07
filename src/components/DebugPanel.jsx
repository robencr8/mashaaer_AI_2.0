import React, { useState, useEffect, useRef } from 'react';
import useAppStore from '../stores/useAppStore.js';
import useCosmicTheme from '../hooks/useCosmicTheme.js';
import axios from 'axios';

/**
 * Debug Panel Component
 * 
 * A development tool for testing and debugging the application state.
 * This component is only visible in development mode.
 */
const DebugPanel = () => {
  // Get state and actions from the store
  const { 
    user, 
    theme, 
    accentColor, 
    voiceEnabled, 
    setUser, 
    setTheme, 
    setAccentColor, 
    toggleVoice, 
    reset 
  } = useAppStore();

  // Get cosmic theme settings and actions
  const { settings: cosmicSettings, updateSetting, getOptions, resetCosmicTheme } = useCosmicTheme();

  // Local state for form inputs and UI controls
  const [colorInput, setColorInput] = useState(accentColor);
  const [testUsername, setTestUsername] = useState('');
  const [showStateViewer, setShowStateViewer] = useState(false);
  const [snapshots, setSnapshots] = useState([]);
  const [autoRestoreEnabled, setAutoRestoreEnabled] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(true);
  const [testResults, setTestResults] = useState(null);
  const [showTestResults, setShowTestResults] = useState(false);
  const [testResultsLoading, setTestResultsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Get the complete current state
  const currentState = useAppStore.getState();

  // Function to fetch test results
  const fetchTestResults = async () => {
    setTestResultsLoading(true);
    try {
      const response = await axios.get('/test-report.html', { responseType: 'text' });
      setTestResults(response.data);
    } catch (error) {
      console.error('Error fetching test results:', error);
      setTestResults(null);
    } finally {
      setTestResultsLoading(false);
    }
  };

  // Run tests manually
  const runTests = async () => {
    setTestResultsLoading(true);
    try {
      // This is a simplified version - in a real app, you'd call an API endpoint
      // that runs the tests on the server
      alert('Running tests... This would normally call an API endpoint.');

      // After tests are run, fetch the results
      await fetchTestResults();
    } catch (error) {
      console.error('Error running tests:', error);
    } finally {
      setTestResultsLoading(false);
    }
  };

  // Load saved snapshots and settings on component mount
  useEffect(() => {
    // Load snapshots
    const savedSnapshots = localStorage.getItem('mashaaer-debug-snapshots');
    if (savedSnapshots) {
      try {
        setSnapshots(JSON.parse(savedSnapshots));
      } catch (error) {
        console.error('Error loading snapshots:', error);
      }
    }

    // Load auto-restore setting
    const autoRestore = localStorage.getItem('mashaaer-debug-auto-restore');
    if (autoRestore) {
      setAutoRestoreEnabled(autoRestore === 'true');
    }

    // Load debug panel visibility setting
    const debugPanelVisible = localStorage.getItem('mashaaer-debug-panel-visible');
    if (debugPanelVisible) {
      setShowDebugPanel(debugPanelVisible === 'true');
    }

    // Auto-restore last snapshot if enabled
    if (autoRestore === 'true' && savedSnapshots) {
      try {
        const parsedSnapshots = JSON.parse(savedSnapshots);
        if (parsedSnapshots.length > 0) {
          // Get the most recent snapshot
          const lastSnapshot = parsedSnapshots[parsedSnapshots.length - 1];
          restoreSnapshot(lastSnapshot);
          console.log('Auto-restored last snapshot:', lastSnapshot.timestamp);
        }
      } catch (error) {
        console.error('Error auto-restoring snapshot:', error);
      }
    }

    // Fetch test results if they exist
    fetchTestResults();

    // Listen for toggleDebugPanel event from DevToggle component
    const handleToggleEvent = (event) => {
      setShowDebugPanel(event.detail.visible);
    };

    window.addEventListener('toggleDebugPanel', handleToggleEvent);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('toggleDebugPanel', handleToggleEvent);
    };
  }, []);

  // Handle test login
  const handleTestLogin = () => {
    if (testUsername.trim()) {
      setUser({
        id: 'test-user-id',
        name: testUsername,
        email: `${testUsername.toLowerCase().replace(/\s+/g, '.')}@test.com`,
        role: 'tester'
      });
    }
  };

  // Save current state as a snapshot
  const saveSnapshot = () => {
    const newSnapshot = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      state: { ...currentState }
    };

    const updatedSnapshots = [...snapshots, newSnapshot];
    setSnapshots(updatedSnapshots);

    // Save to localStorage
    try {
      localStorage.setItem('mashaaer-debug-snapshots', JSON.stringify(updatedSnapshots));
    } catch (error) {
      console.error('Error saving snapshot:', error);
    }
  };

  // Restore a snapshot
  const restoreSnapshot = (snapshot) => {
    if (!snapshot || !snapshot.state) return;

    // Apply the snapshot state to the store
    if (snapshot.state.user !== undefined) setUser(snapshot.state.user);
    if (snapshot.state.theme !== undefined) setTheme(snapshot.state.theme);
    if (snapshot.state.accentColor !== undefined) {
      setAccentColor(snapshot.state.accentColor);
      setColorInput(snapshot.state.accentColor);
    }
    if (snapshot.state.voiceEnabled !== undefined && snapshot.state.voiceEnabled !== voiceEnabled) {
      toggleVoice();
    }
  };

  // Delete a snapshot
  const deleteSnapshot = (snapshotId) => {
    const updatedSnapshots = snapshots.filter(s => s.id !== snapshotId);
    setSnapshots(updatedSnapshots);

    // Update localStorage
    try {
      localStorage.setItem('mashaaer-debug-snapshots', JSON.stringify(updatedSnapshots));
    } catch (error) {
      console.error('Error updating snapshots:', error);
    }
  };

  // Load snapshot from file
  const loadSnapshotFromFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const fileContent = e.target.result;
        const parsedSnapshot = JSON.parse(fileContent);

        // Validate snapshot structure
        if (!parsedSnapshot.state) {
          throw new Error('Invalid snapshot format: missing state property');
        }

        // Create a new snapshot with current timestamp
        const newSnapshot = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          state: parsedSnapshot.state || parsedSnapshot
        };

        // Add to snapshots
        const updatedSnapshots = [...snapshots, newSnapshot];
        setSnapshots(updatedSnapshots);

        // Save to localStorage
        localStorage.setItem('mashaaer-debug-snapshots', JSON.stringify(updatedSnapshots));

        // Optionally restore the loaded snapshot
        restoreSnapshot(newSnapshot);

        console.log('Snapshot loaded from file:', newSnapshot.timestamp);
      } catch (error) {
        console.error('Error loading snapshot from file:', error);
        alert('Error loading snapshot: ' + error.message);
      }
    };

    reader.readAsText(file);

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Toggle auto-restore setting
  const toggleAutoRestore = () => {
    const newValue = !autoRestoreEnabled;
    setAutoRestoreEnabled(newValue);
    localStorage.setItem('mashaaer-debug-auto-restore', newValue.toString());
  };

  // Toggle debug panel visibility
  const toggleDebugPanelVisibility = () => {
    const newValue = !showDebugPanel;
    setShowDebugPanel(newValue);
    localStorage.setItem('mashaaer-debug-panel-visible', newValue.toString());
  };

  // Only render in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // If debug panel is hidden, only show the toggle button
  if (!showDebugPanel) {
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
        🛠️
      </div>
    );
  }

  return (
    <div className="debug-panel" style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '300px',
      padding: '15px',
      backgroundColor: '#1e1e1e',
      color: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: 9999,
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      border: `2px solid ${accentColor}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, fontSize: '16px' }}>🛠️ Debug Panel</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ 
            backgroundColor: theme === 'dark' ? '#333' : '#f0f0f0', 
            color: theme === 'dark' ? '#fff' : '#000',
            padding: '3px 8px', 
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            {process.env.NODE_ENV}
          </div>
          <div 
            onClick={toggleDebugPanelVisibility}
            style={{
              width: '24px',
              height: '24px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ✖️
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <p style={{ margin: '0 0 5px 0', fontSize: '12px', opacity: 0.7 }}>Current User:</p>
        <div style={{ 
          padding: '5px', 
          backgroundColor: 'rgba(0,0,0,0.2)', 
          borderRadius: '4px',
          wordBreak: 'break-all'
        }}>
          {user ? `${user.name} (${user.email})` : 'Not logged in'}
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', opacity: 0.7 }}>
          Test Login:
        </label>
        <div style={{ display: 'flex' }}>
          <input
            type="text"
            value={testUsername}
            onChange={(e) => setTestUsername(e.target.value)}
            placeholder="Enter test username"
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '4px 0 0 4px',
              border: 'none',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#fff'
            }}
          />
          <button
            onClick={handleTestLogin}
            style={{
              padding: '8px 12px',
              backgroundColor: accentColor,
              border: 'none',
              borderRadius: '0 4px 4px 0',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', opacity: 0.7 }}>
          Theme:
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setTheme('light')}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor: theme === 'light' ? accentColor : 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            Light
          </button>
          <button
            onClick={() => setTheme('dark')}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor: theme === 'dark' ? accentColor : 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            Dark
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', opacity: 0.7 }}>
          Accent Color:
        </label>
        <div style={{ display: 'flex' }}>
          <input
            type="text"
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '4px 0 0 4px',
              border: 'none',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#fff'
            }}
          />
          <button
            onClick={() => setAccentColor(colorInput)}
            style={{
              padding: '8px 12px',
              backgroundColor: accentColor,
              border: 'none',
              borderRadius: '0 4px 4px 0',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            Apply
          </button>
        </div>
        <div style={{ 
          display: 'flex', 
          marginTop: '10px', 
          gap: '5px' 
        }}>
          {['#7c3aed', '#ef4444', '#3b82f6', '#10b981', '#f59e0b'].map(color => (
            <div
              key={color}
              onClick={() => {
                setColorInput(color);
                setAccentColor(color);
              }}
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: color,
                borderRadius: '4px',
                cursor: 'pointer',
                border: color === accentColor ? '2px solid white' : 'none'
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <div
            onClick={toggleVoice}
            style={{
              width: '40px',
              height: '20px',
              backgroundColor: voiceEnabled ? accentColor : 'rgba(255,255,255,0.1)',
              borderRadius: '10px',
              position: 'relative',
              transition: 'background-color 0.3s',
              marginRight: '10px'
            }}
          >
            <div
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#fff',
                borderRadius: '50%',
                position: 'absolute',
                top: '2px',
                left: voiceEnabled ? '22px' : '2px',
                transition: 'left 0.3s'
              }}
            />
          </div>
          Voice Enabled
        </label>
      </div>

      {/* State Viewer */}
      <div style={{ marginBottom: '15px' }}>
        <div 
          onClick={() => setShowStateViewer(!showStateViewer)}
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '8px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '5px'
          }}
        >
          <span style={{ fontWeight: 'bold', fontSize: '12px' }}>
            {showStateViewer ? '🔽 Hide State' : '▶️ Show State'}
          </span>
        </div>

        {showStateViewer && (
          <div style={{ 
            padding: '8px', 
            backgroundColor: 'rgba(0,0,0,0.3)', 
            borderRadius: '4px',
            maxHeight: '200px',
            overflowY: 'auto',
            fontSize: '11px',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all'
          }}>
            {JSON.stringify(currentState, null, 2)}
          </div>
        )}
      </div>

      {/* Snapshots */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <span style={{ fontWeight: 'bold', fontSize: '12px' }}>Snapshots</span>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button
              onClick={saveSnapshot}
              style={{
                padding: '5px 10px',
                backgroundColor: accentColor,
                border: 'none',
                borderRadius: '4px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '11px'
              }}
            >
              Save
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '5px 10px',
                backgroundColor: accentColor,
                border: 'none',
                borderRadius: '4px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '11px'
              }}
            >
              Upload
            </button>
            <input 
              type="file"
              ref={fileInputRef}
              onChange={loadSnapshotFromFile}
              accept=".json"
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* Auto-restore toggle */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '10px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          padding: '5px 8px',
          borderRadius: '4px'
        }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            fontSize: '11px',
            flex: 1
          }}>
            <div
              onClick={toggleAutoRestore}
              style={{
                width: '30px',
                height: '16px',
                backgroundColor: autoRestoreEnabled ? accentColor : 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                position: 'relative',
                transition: 'background-color 0.3s',
                marginRight: '8px'
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '2px',
                  left: autoRestoreEnabled ? '16px' : '2px',
                  transition: 'left 0.3s'
                }}
              />
            </div>
            Auto-restore on startup
          </label>
        </div>

        {snapshots.length === 0 ? (
          <div style={{ 
            padding: '8px', 
            backgroundColor: 'rgba(0,0,0,0.2)', 
            borderRadius: '4px',
            fontSize: '11px',
            textAlign: 'center',
            fontStyle: 'italic'
          }}>
            No snapshots saved
          </div>
        ) : (
          <div style={{ 
            maxHeight: '150px',
            overflowY: 'auto'
          }}>
            {snapshots.map(snapshot => (
              <div 
                key={snapshot.id}
                style={{ 
                  padding: '8px', 
                  backgroundColor: 'rgba(0,0,0,0.2)', 
                  borderRadius: '4px',
                  marginBottom: '5px',
                  fontSize: '11px'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '5px'
                }}>
                  <span>
                    {new Date(snapshot.timestamp).toLocaleString()}
                  </span>
                  <div>
                    <button
                      onClick={() => restoreSnapshot(snapshot)}
                      style={{
                        padding: '3px 6px',
                        backgroundColor: accentColor,
                        border: 'none',
                        borderRadius: '3px',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '10px',
                        marginRight: '5px'
                      }}
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => deleteSnapshot(snapshot.id)}
                      style={{
                        padding: '3px 6px',
                        backgroundColor: '#ef4444',
                        border: 'none',
                        borderRadius: '3px',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '10px'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cosmic Theme Settings */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <span style={{ fontWeight: 'bold', fontSize: '12px' }}>✨ Cosmic Theme Settings</span>
        </div>

        {/* Accent Color */}
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '11px', opacity: 0.7 }}>
            Accent Color:
          </label>
          <select
            value={cosmicSettings.accentColor}
            onChange={(e) => updateSetting('accentColor', e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '12px'
            }}
          >
            {getOptions('accentColor').map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Animation Speed */}
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '11px', opacity: 0.7 }}>
            Animation Speed:
          </label>
          <select
            value={cosmicSettings.animationSpeed}
            onChange={(e) => updateSetting('animationSpeed', e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '12px'
            }}
          >
            {getOptions('animationSpeed').map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Star Density */}
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '11px', opacity: 0.7 }}>
            Star Density:
          </label>
          <select
            value={cosmicSettings.starDensity}
            onChange={(e) => updateSetting('starDensity', e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '12px'
            }}
          >
            {getOptions('starDensity').map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Star Shape */}
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '11px', opacity: 0.7 }}>
            Star Shape:
          </label>
          <select
            value={cosmicSettings.starShape}
            onChange={(e) => updateSetting('starShape', e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '12px'
            }}
          >
            {getOptions('starShape').map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Test Results */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <span style={{ fontWeight: 'bold', fontSize: '12px' }}>🧪 Test Results</span>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button
              onClick={fetchTestResults}
              style={{
                padding: '5px 10px',
                backgroundColor: accentColor,
                border: 'none',
                borderRadius: '4px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '11px'
              }}
            >
              Refresh
            </button>
            <button
              onClick={runTests}
              style={{
                padding: '5px 10px',
                backgroundColor: accentColor,
                border: 'none',
                borderRadius: '4px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '11px'
              }}
            >
              Run Tests
            </button>
          </div>
        </div>

        <div 
          onClick={() => setShowTestResults(!showTestResults)}
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '8px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '5px'
          }}
        >
          <span style={{ fontWeight: 'bold', fontSize: '12px' }}>
            {showTestResults ? '🔽 Hide Test Report' : '▶️ Show Test Report'}
          </span>
        </div>

        {showTestResults && (
          <div style={{ 
            padding: '8px', 
            backgroundColor: 'rgba(0,0,0,0.3)', 
            borderRadius: '4px',
            maxHeight: '300px',
            overflowY: 'auto',
            fontSize: '11px'
          }}>
            {testResultsLoading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ 
                  display: 'inline-block',
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid #fff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginBottom: '10px'
                }}></div>
                <p>Loading test results...</p>
              </div>
            ) : testResults ? (
              <div 
                dangerouslySetInnerHTML={{ __html: testResults }} 
                style={{ 
                  fontSize: '11px',
                  '& table': { width: '100%', borderCollapse: 'collapse' },
                  '& th, & td': { padding: '4px', border: '1px solid rgba(255,255,255,0.1)' },
                  '& th': { backgroundColor: 'rgba(255,255,255,0.05)' }
                }}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p>No test results available.</p>
                <p style={{ fontSize: '10px', opacity: 0.7, marginTop: '10px' }}>
                  Run tests to generate a report or check if test-report.html exists in the project root.
                </p>
              </div>
            )}
          </div>
        )}

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginTop: '10px' 
        }}>
          <a 
            href="/test-report.html" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              fontSize: '11px',
              color: accentColor,
              textDecoration: 'none'
            }}
          >
            Open full test report in new tab
          </a>
        </div>
      </div>

      <button
        onClick={() => {
          // Reset app store settings
          reset();
          // Reset cosmic theme settings
          resetCosmicTheme();
        }}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#ef4444',
          border: 'none',
          borderRadius: '4px',
          color: '#fff',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Reset All Settings
      </button>

      <div style={{ 
        marginTop: '15px', 
        fontSize: '11px', 
        opacity: 0.5, 
        textAlign: 'center' 
      }}>
        This panel is only visible in development mode
      </div>
    </div>
  );
};

export default DebugPanel;
