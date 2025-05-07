/**
 * WhatsApp OTP Service
 * Provides OTP verification via WhatsApp
 */

class WhatsAppOTPService {
  constructor() {
    this.whatsAppIntegration = window.whatsAppIntegration;
    this.isInitialized = false;
  }

  /**
   * Initialize the WhatsApp OTP service
   */
  initialize() {
    if (this.isInitialized) return this;
    
    if (!this.whatsAppIntegration) {
      console.error('WhatsApp integration not available');
      return this;
    }
    
    // Initialize WhatsApp integration if not already initialized
    if (!this.whatsAppIntegration.isInitialized) {
      this.whatsAppIntegration.initialize();
    }
    
    this.isInitialized = true;
    console.log('WhatsApp OTP Service initialized');
    
    return this;
  }

  /**
   * Send OTP via WhatsApp
   * @param {string} phoneNumber - Phone number to send OTP to
   * @param {string} otp - OTP code to send
   * @returns {Promise} Promise that resolves when OTP is sent
   */
  sendOTP(phoneNumber, otp) {
    return new Promise((resolve, reject) => {
      if (!this.isInitialized) {
        this.initialize();
      }
      
      if (!this.whatsAppIntegration.isConnected) {
        reject(new Error('WhatsApp not connected'));
        return;
      }
      
      // Format the OTP message
      const message = this.formatOTPMessage(otp);
      
      // Create a one-time event listener for message sent
      const messageListener = (event) => {
        document.removeEventListener('whatsAppMessageSent', messageListener);
        resolve(event.detail);
      };
      
      // Create a one-time event listener for errors
      const errorListener = () => {
        document.removeEventListener('whatsAppError', errorListener);
        reject(new Error('Failed to send OTP via WhatsApp'));
      };
      
      // Add event listeners
      document.addEventListener('whatsAppMessageSent', messageListener);
      document.addEventListener('whatsAppError', errorListener);
      
      // Send the message
      document.dispatchEvent(new CustomEvent('sendWhatsAppMessage', {
        detail: {
          recipient: phoneNumber,
          message: message
        }
      }));
      
      // Set a timeout to prevent hanging promises
      setTimeout(() => {
        document.removeEventListener('whatsAppMessageSent', messageListener);
        document.removeEventListener('whatsAppError', errorListener);
        resolve({ status: 'timeout', message: 'OTP sent (timeout)' });
      }, 5000);
    });
  }

  /**
   * Format OTP message
   * @param {string} otp - OTP code
   * @returns {string} Formatted message
   */
  formatOTPMessage(otp) {
    return `رمز التحقق الخاص بك هو: ${otp}\n\nهذا الرمز صالح لمدة 10 دقائق. لا تشاركه مع أي شخص.`;
  }

  /**
   * Check if WhatsApp is available for OTP
   * @returns {boolean} True if WhatsApp is available
   */
  isAvailable() {
    return this.isInitialized && this.whatsAppIntegration && this.whatsAppIntegration.isConnected;
  }

  /**
   * Connect to WhatsApp
   * @param {string} containerId - ID of container element for QR code
   * @returns {Promise} Promise that resolves when connected
   */
  connect(containerId) {
    return new Promise((resolve, reject) => {
      if (!this.isInitialized) {
        this.initialize();
      }
      
      // If already connected, resolve immediately
      if (this.whatsAppIntegration.isConnected) {
        resolve({ status: 'connected', phoneNumber: this.whatsAppIntegration.phoneNumber });
        return;
      }
      
      // Create a one-time event listener for connection
      const connectionListener = (event) => {
        document.removeEventListener('whatsAppConnected', connectionListener);
        resolve(event.detail);
      };
      
      // Add event listener
      document.addEventListener('whatsAppConnected', connectionListener);
      
      // Trigger connection
      document.dispatchEvent(new CustomEvent('connectWhatsApp', {
        detail: { containerId }
      }));
      
      // Set a timeout to prevent hanging promises
      setTimeout(() => {
        document.removeEventListener('whatsAppConnected', connectionListener);
        reject(new Error('Connection timeout'));
      }, 60000); // 1 minute timeout
    });
  }
}

// Create and export singleton instance
const whatsAppOTPService = new WhatsAppOTPService();
export default whatsAppOTPService;