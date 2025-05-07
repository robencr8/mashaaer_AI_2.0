/**
 * Mashaaer Enhanced Project
 * WhatsApp Integration Module
 * 
 * This module provides integration with WhatsApp for messaging and notifications
 * with features like:
 * - QR code linking
 * - Message sending and receiving
 * - Media sharing
 * - Notification delivery
 */

class WhatsAppIntegration {
  constructor() {
    this.config = {
      apiEndpoint: '/api/whatsapp',
      webhookUrl: '/api/webhooks/whatsapp',
      qrCodeRefreshInterval: 30000, // 30 seconds
      reconnectInterval: 60000, // 1 minute
      maxReconnectAttempts: 5
    };
    
    this.isInitialized = false;
    this.isConnected = false;
    this.qrCodeElement = null;
    this.qrCodeRefreshTimer = null;
    this.reconnectTimer = null;
    this.reconnectAttempts = 0;
    this.phoneNumber = null;
    this.deviceInfo = null;
  }

  /**
   * Initialize WhatsApp integration
   * @param {Object} config - Configuration options
   */
  initialize(config = {}) {
    if (this.isInitialized) return this;
    
    // Apply configuration
    this.config = { ...this.config, ...config };
    
    // Initialize event listeners
    this.initEventListeners();
    
    // Check for existing session
    this.checkExistingSession();
    
    this.isInitialized = true;
    console.log('WhatsApp Integration initialized');
    
    return this;
  }

  /**
   * Initialize event listeners
   */
  initEventListeners() {
    // Listen for connection requests
    document.addEventListener('connectWhatsApp', this.handleConnectRequest.bind(this));
    
    // Listen for disconnection requests
    document.addEventListener('disconnectWhatsApp', this.handleDisconnectRequest.bind(this));
    
    // Listen for message sending requests
    document.addEventListener('sendWhatsAppMessage', this.handleSendMessageRequest.bind(this));
    
    // Listen for QR code refresh requests
    document.addEventListener('refreshWhatsAppQR', this.handleQRRefreshRequest.bind(this));
  }

  /**
   * Check for existing WhatsApp session
   */
  checkExistingSession() {
    // Try to get session from memory.db first
    if (window.memoryDB) {
      const session = window.memoryDB.get('whatsapp_session');
      if (session) {
        this.restoreSession(session);
        return;
      }
    }
    
    // Otherwise try localStorage
    const storedSession = localStorage.getItem('whatsapp_session');
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        this.restoreSession(session);
      } catch (e) {
        console.error('Error parsing WhatsApp session:', e);
      }
    }
  }

  /**
   * Restore WhatsApp session
   * @param {Object} session - Session data
   */
  restoreSession(session) {
    // Validate session
    if (!session || !session.phoneNumber) {
      console.warn('Invalid WhatsApp session data');
      return;
    }
    
    // Set session data
    this.phoneNumber = session.phoneNumber;
    this.deviceInfo = session.deviceInfo;
    
    // Verify session with server
    this.verifySession()
      .then(isValid => {
        if (isValid) {
          this.isConnected = true;
          console.log(`WhatsApp session restored for ${this.phoneNumber}`);
          
          // Dispatch connection event
          document.dispatchEvent(new CustomEvent('whatsAppConnected', {
            detail: {
              phoneNumber: this.phoneNumber,
              deviceInfo: this.deviceInfo
            }
          }));
        } else {
          console.warn('WhatsApp session invalid or expired');
          this.clearSession();
        }
      })
      .catch(error => {
        console.error('Error verifying WhatsApp session:', error);
        this.clearSession();
      });
  }

  /**
   * Verify WhatsApp session with server
   * @returns {Promise<boolean>} Promise that resolves to session validity
   */
  verifySession() {
    // In a real implementation, this would call the server API
    // For this implementation, we'll simulate the API call
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate 80% success rate
        const isValid = Math.random() < 0.8;
        resolve(isValid);
      }, 500);
    });
  }

  /**
   * Clear WhatsApp session
   */
  clearSession() {
    this.phoneNumber = null;
    this.deviceInfo = null;
    this.isConnected = false;
    
    // Clear from localStorage
    localStorage.removeItem('whatsapp_session');
    
    // Clear from memory.db if available
    if (window.memoryDB) {
      window.memoryDB.delete('whatsapp_session');
    }
    
    console.log('WhatsApp session cleared');
  }

  /**
   * Handle connect request
   * @param {Event} event - Connect event
   */
  handleConnectRequest(event) {
    const { containerId } = event.detail || {};
    
    // If already connected, show status
    if (this.isConnected) {
      this.showConnectionStatus();
      return;
    }
    
    // If container ID provided, show QR code
    if (containerId) {
      const container = document.getElementById(containerId);
      if (container) {
        this.showQRCode(container);
      } else {
        console.error(`Container not found: ${containerId}`);
        this.showError('QR code container not found');
      }
    } else {
      // Otherwise show phone number input
      this.showPhoneNumberInput();
    }
  }

  /**
   * Handle disconnect request
   */
  handleDisconnectRequest() {
    // If not connected, do nothing
    if (!this.isConnected) {
      this.showMessage('Not connected to WhatsApp');
      return;
    }
    
    // Show confirmation dialog
    this.showConfirmationDialog(
      'Disconnect WhatsApp',
      'Are you sure you want to disconnect your WhatsApp account?',
      () => this.disconnect()
    );
  }

  /**
   * Handle send message request
   * @param {Event} event - Send message event
   */
  handleSendMessageRequest(event) {
    const { recipient, message, media } = event.detail || {};
    
    // Validate parameters
    if (!recipient) {
      console.error('No recipient provided');
      this.showError('Recipient is required');
      return;
    }
    
    if (!message && !media) {
      console.error('No message or media provided');
      this.showError('Message or media is required');
      return;
    }
    
    // If not connected, show error
    if (!this.isConnected) {
      this.showError('Not connected to WhatsApp');
      return;
    }
    
    // Send message
    this.sendMessage(recipient, message, media);
  }

  /**
   * Handle QR code refresh request
   */
  handleQRRefreshRequest() {
    // If already connected, show status
    if (this.isConnected) {
      this.showConnectionStatus();
      return;
    }
    
    // If QR code element exists, refresh it
    if (this.qrCodeElement) {
      this.refreshQRCode();
    } else {
      this.showError('No QR code to refresh');
    }
  }

  /**
   * Show QR code for WhatsApp Web connection
   * @param {HTMLElement} container - Container element
   */
  showQRCode(container) {
    // Clear container
    container.innerHTML = '';
    
    // Create QR code element
    const qrElement = document.createElement('div');
    qrElement.className = 'whatsapp-qr-container';
    qrElement.innerHTML = `
      <div class="qr-header">
        <h3>Connect to WhatsApp</h3>
        <p>Scan this QR code with your phone</p>
      </div>
      <div class="qr-code-wrapper">
        <div class="qr-loading">Generating QR code...</div>
        <div class="qr-code"></div>
      </div>
      <div class="qr-instructions">
        <ol>
          <li>Open WhatsApp on your phone</li>
          <li>Tap Menu <span class="icon">⋮</span> or Settings <span class="icon">⚙️</span></li>
          <li>Select WhatsApp Web</li>
          <li>Point your phone to this screen to scan the code</li>
        </ol>
      </div>
      <div class="qr-actions">
        <button class="refresh-qr-btn">Refresh QR Code</button>
        <button class="cancel-qr-btn">Cancel</button>
      </div>
    `;
    
    // Add event listeners
    qrElement.querySelector('.refresh-qr-btn').addEventListener('click', () => {
      this.refreshQRCode();
    });
    
    qrElement.querySelector('.cancel-qr-btn').addEventListener('click', () => {
      this.cancelQRCode();
      container.innerHTML = '';
    });
    
    // Add to container
    container.appendChild(qrElement);
    
    // Store QR code element
    this.qrCodeElement = qrElement.querySelector('.qr-code');
    
    // Generate QR code
    this.generateQRCode();
    
    // Set up refresh timer
    this.qrCodeRefreshTimer = setInterval(() => {
      this.refreshQRCode();
    }, this.config.qrCodeRefreshInterval);
  }

  /**
   * Generate QR code
   */
  generateQRCode() {
    // Show loading
    if (this.qrCodeElement) {
      this.qrCodeElement.innerHTML = '';
      this.qrCodeElement.parentElement.querySelector('.qr-loading').style.display = 'block';
    }
    
    // In a real implementation, this would call the server API
    // For this implementation, we'll simulate the API call
    
    setTimeout(() => {
      // Hide loading
      if (this.qrCodeElement) {
        this.qrCodeElement.parentElement.querySelector('.qr-loading').style.display = 'none';
      }
      
      // Generate a fake QR code (in a real implementation, this would be from the server)
      this.renderQRCode('https://wa.me/whatsapp-web-auth?code=ABCDEF123456');
      
      // Set up connection check
      this.checkConnection();
    }, 1500);
  }

  /**
   * Render QR code
   * @param {string} data - QR code data
   */
  renderQRCode(data) {
    if (!this.qrCodeElement) return;
    
    // In a real implementation, this would use a QR code library
    // For this implementation, we'll create a simple visual representation
    
    const size = 10;
    const qrSize = size * size;
    
    let html = '<div class="fake-qr-code">';
    
    // Create a deterministic pattern based on the data
    const hash = this.simpleHash(data);
    
    for (let i = 0; i < qrSize; i++) {
      const isBlack = (hash[i % hash.length] + i) % 3 === 0;
      html += `<div class="qr-pixel ${isBlack ? 'black' : 'white'}"></div>`;
    }
    
    // Add WhatsApp logo in center
    html += '<div class="qr-logo">WA</div>';
    
    html += '</div>';
    
    this.qrCodeElement.innerHTML = html;
  }

  /**
   * Simple hash function for demo purposes
   * @param {string} str - String to hash
   * @returns {Array} Array of numbers
   */
  simpleHash(str) {
    const result = [];
    for (let i = 0; i < str.length; i++) {
      result.push(str.charCodeAt(i));
    }
    return result;
  }

  /**
   * Refresh QR code
   */
  refreshQRCode() {
    // Clear existing QR code
    if (this.qrCodeElement) {
      this.qrCodeElement.innerHTML = '';
    }
    
    // Generate new QR code
    this.generateQRCode();
  }

  /**
   * Cancel QR code
   */
  cancelQRCode() {
    // Clear refresh timer
    if (this.qrCodeRefreshTimer) {
      clearInterval(this.qrCodeRefreshTimer);
      this.qrCodeRefreshTimer = null;
    }
    
    // Clear QR code element
    this.qrCodeElement = null;
  }

  /**
   * Check connection status
   */
  checkConnection() {
    // In a real implementation, this would poll the server
    // For this implementation, we'll simulate the connection process
    
    // Simulate 30% chance of successful connection after 3 seconds
    setTimeout(() => {
      if (Math.random() < 0.3) {
        this.handleSuccessfulConnection({
          phoneNumber: '+1234567890',
          deviceInfo: {
            name: 'Sample Phone',
            platform: 'Android',
            version: '12.0'
          }
        });
      }
    }, 3000);
  }

  /**
   * Handle successful connection
   * @param {Object} data - Connection data
   */
  handleSuccessfulConnection(data) {
    // Cancel QR code
    this.cancelQRCode();
    
    // Set connection data
    this.phoneNumber = data.phoneNumber;
    this.deviceInfo = data.deviceInfo;
    this.isConnected = true;
    
    // Store session
    this.storeSession();
    
    // Show success message
    this.showSuccess(`Connected to WhatsApp (${this.phoneNumber})`);
    
    // Dispatch connection event
    document.dispatchEvent(new CustomEvent('whatsAppConnected', {
      detail: {
        phoneNumber: this.phoneNumber,
        deviceInfo: this.deviceInfo
      }
    }));
    
    // Show connection status
    this.showConnectionStatus();
  }

  /**
   * Store WhatsApp session
   */
  storeSession() {
    const session = {
      phoneNumber: this.phoneNumber,
      deviceInfo: this.deviceInfo,
      timestamp: Date.now()
    };
    
    // Store in localStorage
    localStorage.setItem('whatsapp_session', JSON.stringify(session));
    
    // Store in memory.db if available
    if (window.memoryDB) {
      window.memoryDB.set('whatsapp_session', session);
    }
  }

  /**
   * Show phone number input
   */
  showPhoneNumberInput() {
    // Create dialog element
    const dialog = document.createElement('div');
    dialog.className = 'whatsapp-phone-dialog';
    dialog.innerHTML = `
      <div class="dialog-content">
        <h3 class="dialog-title">Connect to WhatsApp</h3>
        <p class="dialog-message">Enter your phone number to receive a verification code</p>
        <div class="phone-input-container">
          <input type="tel" class="phone-input" placeholder="+1 234 567 8900">
        </div>
        <div class="dialog-actions">
          <button class="dialog-cancel-btn">Cancel</button>
          <button class="dialog-confirm-btn">Send Code</button>
        </div>
      </div>
    `;
    
    // Add event listeners
    dialog.querySelector('.dialog-cancel-btn').addEventListener('click', () => {
      dialog.classList.remove('visible');
      setTimeout(() => {
        dialog.remove();
      }, 300);
    });
    
    dialog.querySelector('.dialog-confirm-btn').addEventListener('click', () => {
      const phoneInput = dialog.querySelector('.phone-input');
      const phoneNumber = phoneInput.value.trim();
      
      if (!phoneNumber) {
        phoneInput.classList.add('error');
        return;
      }
      
      dialog.classList.remove('visible');
      setTimeout(() => {
        dialog.remove();
        this.sendVerificationCode(phoneNumber);
      }, 300);
    });
    
    // Add to document
    document.body.appendChild(dialog);
    
    // Show with animation
    setTimeout(() => {
      dialog.classList.add('visible');
      dialog.querySelector('.phone-input').focus();
    }, 10);
  }

  /**
   * Send verification code
   * @param {string} phoneNumber - Phone number
   */
  sendVerificationCode(phoneNumber) {
    // Show loading
    this.showLoading('Sending verification code...');
    
    // In a real implementation, this would call the server API
    // For this implementation, we'll simulate the API call
    
    setTimeout(() => {
      // Hide loading
      this.hideLoading();
      
      // Show verification code input
      this.showVerificationCodeInput(phoneNumber);
    }, 1500);
  }

  /**
   * Show verification code input
   * @param {string} phoneNumber - Phone number
   */
  showVerificationCodeInput(phoneNumber) {
    // Create dialog element
    const dialog = document.createElement('div');
    dialog.className = 'whatsapp-verification-dialog';
    dialog.innerHTML = `
      <div class="dialog-content">
        <h3 class="dialog-title">Verify WhatsApp</h3>
        <p class="dialog-message">Enter the 6-digit code sent to ${phoneNumber}</p>
        <div class="code-input-container">
          <input type="text" class="code-input" placeholder="123456" maxlength="6" pattern="[0-9]*">
        </div>
        <div class="dialog-actions">
          <button class="dialog-cancel-btn">Cancel</button>
          <button class="dialog-confirm-btn">Verify</button>
        </div>
      </div>
    `;
    
    // Add event listeners
    dialog.querySelector('.dialog-cancel-btn').addEventListener('click', () => {
      dialog.classList.remove('visible');
      setTimeout(() => {
        dialog.remove();
      }, 300);
    });
    
    dialog.querySelector('.dialog-confirm-btn').addEventListener('click', () => {
      const codeInput = dialog.querySelector('.code-input');
      const code = codeInput.value.trim();
      
      if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
        codeInput.classList.add('error');
        return;
      }
      
      dialog.classList.remove('visible');
      setTimeout(() => {
        dialog.remove();
        this.verifyCode(phoneNumber, code);
      }, 300);
    });
    
    // Add to document
    document.body.appendChild(dialog);
    
    // Show with animation
    setTimeout(() => {
      dialog.classList.add('visible');
      dialog.querySelector('.code-input').focus();
    }, 10);
  }

  /**
   * Verify code
   * @param {string} phoneNumber - Phone number
   * @param {string} code - Verification code
   */
  verifyCode(phoneNumber, code) {
    // Show loading
    this.showLoading('Verifying code...');
    
    // In a real implementation, this would call the server API
    // For this implementation, we'll simulate the API call
    
    setTimeout(() => {
      // Hide loading
      this.hideLoading();
      
      // Simulate 80% success rate
      if (Math.random() < 0.8) {
        this.handleSuccessfulConnection({
          phoneNumber,
          deviceInfo: {
            name: 'Sample Phone',
            platform: Math.random() < 0.5 ? 'Android' : 'iOS',
            version: '12.0'
          }
        });
      } else {
        this.showError('Invalid verification code. Please try again.');
      }
    }, 1500);
  }

  /**
   * Show connection status
   */
  showConnectionStatus() {
    // Create status element
    const statusElement = document.createElement('div');
    statusElement.className = 'whatsapp-status-dialog';
    statusElement.innerHTML = `
      <div class="dialog-content">
        <h3 class="dialog-title">WhatsApp Connection</h3>
        <div class="status-container">
          <div class="status-icon connected"></div>
          <div class="status-details">
            <p class="status-message">Connected to WhatsApp</p>
            <p class="status-phone">${this.phoneNumber}</p>
            <p class="status-device">${this.deviceInfo.name} (${this.deviceInfo.platform})</p>
          </div>
        </div>
        <div class="dialog-actions">
          <button class="dialog-disconnect-btn">Disconnect</button>
          <button class="dialog-close-btn">Close</button>
        </div>
      </div>
    `;
    
    // Add event listeners
    statusElement.querySelector('.dialog-disconnect-btn').addEventListener('click', () => {
      statusElement.classList.remove('visible');
      setTimeout(() => {
        statusElement.remove();
        this.handleDisconnectRequest();
      }, 300);
    });
    
    statusElement.querySelector('.dialog-close-btn').addEventListener('click', () => {
      statusElement.classList.remove('visible');
      setTimeout(() => {
        statusElement.remove();
      }, 300);
    });
    
    // Add to document
    document.body.appendChild(statusElement);
    
    // Show with animation
    setTimeout(() => {
      statusElement.classList.add('visible');
    }, 10);
  }

  /**
   * Disconnect from WhatsApp
   */
  disconnect() {
    // Show loading
    this.showLoading('Disconnecting...');
    
    // In a real implementation, this would call the server API
    // For this implementation, we'll simulate the API call
    
    setTimeout(() => {
      // Hide loading
      this.hideLoading();
      
      // Clear session
      this.clearSession();
      
      // Show success message
      this.showSuccess('Disconnected from WhatsApp');
      
      // Dispatch disconnection event
      document.dispatchEvent(new CustomEvent('whatsAppDisconnected'));
    }, 1000);
  }

  /**
   * Send WhatsApp message
   * @param {string} recipient - Recipient phone number
   * @param {string} message - Message text
   * @param {Object} media - Media object (optional)
   */
  sendMessage(recipient, message, media) {
    // Show loading
    this.showLoading('Sending message...');
    
    // In a real implementation, this would call the server API
    // For this implementation, we'll simulate the API call
    
    setTimeout(() => {
      // Hide loading
      this.hideLoading();
      
      // Simulate 90% success rate
      if (Math.random() < 0.9) {
        // Show success message
        this.showSuccess('Message sent successfully');
        
        // Dispatch message sent event
        document.dispatchEvent(new CustomEvent('whatsAppMessageSent', {
          detail: {
            recipient,
            message,
            media,
            timestamp: Date.now()
          }
        }));
      } else {
        this.showError('Failed to send message. Please try again.');
      }
    }, 1000);
  }

  /**
   * Show loading indicator
   * @param {string} message - Loading message
   */
  showLoading(message = 'Loading...') {
    // Remove existing loading indicator
    this.hideLoading();
    
    // Create loading indicator
    const loadingElement = document.createElement('div');
    loadingElement.className = 'whatsapp-loading-indicator';
    loadingElement.innerHTML = `
      <div class="loading-spinner"></div>
      <div class="loading-message">${message}</div>
    `;
    
    // Add to document
    document.body.appendChild(loadingElement);
  }

  /**
   * Hide loading indicator
   */
  hideLoading() {
    const loadingElement = document.querySelector('.whatsapp-loading-indicator');
    if (loadingElement) {
      loadingElement.remove();
    }
  }

  /**
   * Show error message
   * @param {string} message - Error message
   */
  showError(message) {
    this.showNotification(message, 'error');
  }

  /**
   * Show success message
   * @param {string} message - Success message
   */
  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  /**
   * Show information message
   * @param {string} message - Information message
   */
  showMessage(message) {
    this.showNotification(message, 'info');
  }

  /**
   * Show notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type ('error', 'success', 'info')
   */
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `whatsapp-notification ${type}`;
    notification.innerHTML = `
      <div class="notification-icon ${type}"></div>
      <div class="notification-message">${message}</div>
      <button class="notification-close">×</button>
    `;
    
    // Add close button event listener
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.classList.remove('visible');
      setTimeout(() => {
        notification.remove();
      }, 300);
    });
    
    // Add to document
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
      notification.classList.add('visible');
    }, 10);
    
    // Auto-hide after delay
    setTimeout(() => {
      if (notification.parentNode) {
        notification.classList.remove('visible');
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 300);
      }
    }, 5000);
  }

  /**
   * Show confirmation dialog
   * @param {string} title - Dialog title
   * @param {string} message - Dialog message
   * @param {Function} onConfirm - Confirmation callback
   */
  showConfirmationDialog(title, message, onConfirm) {
    // Create dialog element
    const dialog = document.createElement('div');
    dialog.className = 'whatsapp-confirmation-dialog';
    dialog.innerHTML = `
      <div class="dialog-content">
        <h3 class="dialog-title">${title}</h3>
        <p class="dialog-message">${message}</p>
        <div class="dialog-actions">
          <button class="dialog-cancel-btn">Cancel</button>
          <button class="dialog-confirm-btn">Confirm</button>
        </div>
      </div>
    `;
    
    // Add event listeners
    dialog.querySelector('.dialog-cancel-btn').addEventListener('click', () => {
      dialog.classList.remove('visible');
      setTimeout(() => {
        dialog.remove();
      }, 300);
    });
    
    dialog.querySelector('.dialog-confirm-btn').addEventListener('click', () => {
      dialog.classList.remove('visible');
      setTimeout(() => {
        dialog.remove();
        onConfirm();
      }, 300);
    });
    
    // Add to document
    document.body.appendChild(dialog);
    
    // Show with animation
    setTimeout(() => {
      dialog.classList.add('visible');
    }, 10);
  }

  /**
   * Clean up and release resources
   */
  destroy() {
    console.log('Cleaning up WhatsApp Integration...');
    
    // Cancel QR code
    this.cancelQRCode();
    
    // Clear reconnect timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    // Remove event listeners
    document.removeEventListener('connectWhatsApp', this.handleConnectRequest);
    document.removeEventListener('disconnectWhatsApp', this.handleDisconnectRequest);
    document.removeEventListener('sendWhatsAppMessage', this.handleSendMessageRequest);
    document.removeEventListener('refreshWhatsAppQR', this.handleQRRefreshRequest);
    
    // Remove UI elements
    const notifications = document.querySelectorAll('.whatsapp-notification');
    notifications.forEach(notification => {
      notification.remove();
    });
    
    const dialogs = document.querySelectorAll('.whatsapp-confirmation-dialog, .whatsapp-phone-dialog, .whatsapp-verification-dialog, .whatsapp-status-dialog');
    dialogs.forEach(dialog => {
      dialog.remove();
    });
    
    const loadingIndicators = document.querySelectorAll('.whatsapp-loading-indicator');
    loadingIndicators.forEach(indicator => {
      indicator.remove();
    });
    
    this.isInitialized = false;
    console.log('WhatsApp Integration cleaned up');
  }
}

// Export the WhatsApp integration module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WhatsAppIntegration };
} else {
  window.whatsAppIntegration = new WhatsAppIntegration();
}
