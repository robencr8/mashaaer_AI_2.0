import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import Toast from './Toast.jsx';

// Create a unique ID for each toast
let toastCounter = 0;

/**
 * ToastContainer component to manage multiple toast notifications
 */
const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  // Remove a toast by ID
  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  // Add a new toast
  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = ++toastCounter;
    setToasts(prevToasts => [...prevToasts, { id, message, type, duration }]);
    return id;
  }, []);

  // Expose methods to add toasts globally
  useEffect(() => {
    // Create global toast methods
    window.toast = {
      success: (message, duration) => addToast(message, 'success', duration),
      error: (message, duration) => addToast(message, 'error', duration),
      info: (message, duration) => addToast(message, 'info', duration),
      remove: removeToast
    };

    // Cleanup
    return () => {
      delete window.toast;
    };
  }, [addToast, removeToast]);

  return ReactDOM.createPortal(
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;