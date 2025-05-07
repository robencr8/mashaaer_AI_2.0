import React from 'react';
import { useErrorService } from '../../context/services-context.js';
import './ErrorBoundary.css';

/**
 * Error Boundary Component
 * 
 * This component catches JavaScript errors in its child component tree,
 * logs those errors, and displays a fallback UI.
 * 
 * Usage:
 * <ErrorBoundary componentName="MyComponent" fallback={<div>Custom error message</div>}>
 *   <MyComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error
    if (this.props.errorService) {
      this.props.errorService.handleError(error, this.props.componentName || 'ErrorBoundary', errorInfo);
    } else {
      console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return this.props.fallback || (
        <div className="error-boundary-fallback">
          <h2>Something went wrong.</h2>
          <p>Please try again later or contact support if the problem persists.</p>
          {this.props.showError && this.state.error && (
            <details>
              <summary>Error details</summary>
              <p>{this.state.error.toString()}</p>
            </details>
          )}
          {this.props.onReset && (
            <button onClick={() => {
              this.setState({ hasError: false, error: null });
              if (typeof this.props.onReset === 'function') {
                this.props.onReset();
              }
            }}>
              Try Again
            </button>
          )}
        </div>
      );
    }

    // When there's no error, render children normally
    return this.props.children;
  }
}

/**
 * Error Boundary with Service
 * 
 * This is a wrapper component that provides the error service to the ErrorBoundary component.
 * It uses the useErrorService hook to get the error service from the services context.
 */
export default function ErrorBoundaryWithService(props) {
  const errorService = useErrorService();
  return <ErrorBoundary {...props} errorService={errorService} />;
}

// Export the ErrorBoundary class component for testing
export { ErrorBoundary };
