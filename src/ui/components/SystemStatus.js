import React, { useState, useEffect } from 'react';
import { useServices } from '../../context/services-context.js';
import './SystemStatus.css';

/**
 * SystemStatus Component
 * 
 * This component displays the current status of all system services.
 * It shows which services are initialized and which are not.
 * It also provides a way to retry initialization of failed services.
 */
const SystemStatus = ({ showDetailed = false }) => {
  const services = useServices();
  const [status, setStatus] = useState({});
  const [alphaStatus, setAlphaStatus] = useState(null);
  const [expanded, setExpanded] = useState(showDetailed);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Get the bootstrap service and alpha service from the services object
  const bootstrapService = services.bootstrapService;
  const alphaService = services.alphaService;

  // Update status every 5 seconds
  useEffect(() => {
    const updateStatus = () => {
      if (bootstrapService) {
        setStatus(bootstrapService.getSystemStatusReport());
        setLastUpdated(new Date());
      }

      if (alphaService) {
        setAlphaStatus(alphaService.getAlphaStatus());
      }
    };

    // Initial update
    updateStatus();

    // Set up interval for updates
    const intervalId = setInterval(updateStatus, 5000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [bootstrapService, alphaService]);

  // Handle retry button click
  const handleRetry = async () => {
    if (bootstrapService) {
      try {
        await bootstrapService.initialize();
        setStatus(bootstrapService.getSystemStatusReport());
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error retrying initialization:', error);
      }
    }
  };

  // If no status or bootstrap service, show loading
  if (!status || !bootstrapService) {
    return <div className="system-status loading">Loading system status...</div>;
  }

  // Format the last updated time
  const formattedTime = lastUpdated.toLocaleTimeString();

  // Determine overall status class
  const statusClass = status.fullyInitialized ? 'healthy' : 'warning';

  return (
    <div className={`system-status ${statusClass}`}>
      <div className="status-header" onClick={() => setExpanded(!expanded)}>
        <h3>System Status</h3>
        <div className="status-summary">
          <span className={`status-indicator ${statusClass}`}></span>
          <span className="status-text">
            {status.fullyInitialized ? 'All Systems Operational' : 'Some Services Not Initialized'}
          </span>
          <span className="status-toggle">{expanded ? '▼' : '▶'}</span>
        </div>
      </div>

      {expanded && (
        <div className="status-details">
          <div className="status-metrics">
            <div className="metric">
              <span className="metric-label">Total Services:</span>
              <span className="metric-value">{status.servicesCount.total}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Initialized:</span>
              <span className="metric-value">{status.servicesCount.initialized}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Failed:</span>
              <span className="metric-value">{status.servicesCount.failed}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Last Updated:</span>
              <span className="metric-value">{formattedTime}</span>
            </div>
          </div>

          <div className="services-list">
            <h4>Services Status</h4>
            <ul>
              {Object.entries(status.servicesStatus).map(([serviceName, isInitialized]) => (
                <li key={serviceName} className={isInitialized ? 'initialized' : 'failed'}>
                  <span className="service-name">{serviceName}</span>
                  <span className="service-status">
                    {isInitialized ? 'Initialized' : 'Failed'}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Alpha Testing Status */}
          {alphaStatus && (
            <div className="alpha-testing">
              <h4>Alpha Testing Status</h4>
              <div className={`alpha-status ${alphaStatus.enabled ? 'enabled' : 'disabled'}`}>
                <span className="alpha-label">Alpha Testing:</span>
                <span className="alpha-value">{alphaStatus.enabled ? 'Enabled' : 'Disabled'}</span>
              </div>

              {alphaStatus.enabled && (
                <>
                  <div className="alpha-metrics">
                    <div className="metric">
                      <span className="metric-label">Features:</span>
                      <span className="metric-value">{alphaStatus.featuresCount}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Enabled:</span>
                      <span className="metric-value">{alphaStatus.enabledFeaturesCount}</span>
                    </div>
                    {alphaStatus.expirationDate && (
                      <div className="metric">
                        <span className="metric-label">Expires:</span>
                        <span className="metric-value">
                          {new Date(alphaStatus.expirationDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {alphaService && alphaService.getEnabledFeatures().length > 0 && (
                    <div className="alpha-features">
                      <h5>Enabled Alpha Features</h5>
                      <ul>
                        {alphaService.getEnabledFeatures().map(feature => (
                          <li key={feature.id} className="alpha-feature">
                            <span className="feature-name">{feature.name}</span>
                            <span className="feature-description">{feature.description}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {!status.fullyInitialized && (
            <div className="status-actions">
              <button className="retry-button" onClick={handleRetry}>
                Retry Initialization
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SystemStatus;
