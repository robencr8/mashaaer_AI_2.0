import React, { useState, useEffect } from 'react';
import './Toast.css';

/**
 * Toast notification component
 * @param {Object} props - Component props
 * @param {string} props.message - The message to display
 * @param {string} props.type - The type of toast (success, error, info)
 * @param {number} props.duration - Duration in milliseconds before auto-dismiss
 * @param {function} props.onClose - Function to call when toast is closed
 */
const Toast = ({ message, type = 'info', duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        if (onClose) onClose();
      }, 300); // Wait for fade-out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300); // Wait for fade-out animation
  };

  return (
    <div className={`toast ${type} ${visible ? 'visible' : 'hidden'}`}>
      <div className="toast-content">
        <div className="toast-icon"></div>
        <div className="toast-message">{message}</div>
      </div>
      <button className="toast-close" onClick={handleClose}>×</button>
    </div>
  );
};

export default Toast;