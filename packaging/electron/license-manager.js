/**
 * License Manager for Mashaaer Enhanced
 * Handles license validation, activation, and storage
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { app, dialog } = require('electron');

class LicenseManager {
  constructor() {
    this.licenseFilePath = path.join(app.getPath('userData'), 'license.json');
    this.licenseData = null;
    this.loadLicense();
  }

  /**
   * Load license data from file
   */
  loadLicense() {
    try {
      if (fs.existsSync(this.licenseFilePath)) {
        const data = fs.readFileSync(this.licenseFilePath, 'utf8');
        this.licenseData = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading license:', error);
      this.licenseData = null;
    }
  }

  /**
   * Save license data to file
   */
  saveLicense() {
    try {
      fs.writeFileSync(this.licenseFilePath, JSON.stringify(this.licenseData, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving license:', error);
      return false;
    }
  }

  /**
   * Check if license is valid
   * @returns {boolean} True if license is valid
   */
  isLicenseValid() {
    if (!this.licenseData) return false;
    
    // Check if license has expired
    if (this.licenseData.expiryDate && new Date(this.licenseData.expiryDate) < new Date()) {
      return false;
    }
    
    // Verify license signature
    return this.verifyLicenseSignature();
  }

  /**
   * Verify the license signature
   * @returns {boolean} True if signature is valid
   */
  verifyLicenseSignature() {
    if (!this.licenseData || !this.licenseData.signature) return false;
    
    try {
      // In a real implementation, this would use proper cryptographic verification
      // For this example, we'll use a simple hash check
      const licenseInfo = `${this.licenseData.key}-${this.licenseData.name}-${this.licenseData.email}`;
      const hash = crypto.createHash('sha256').update(licenseInfo).digest('hex');
      
      return hash === this.licenseData.signature;
    } catch (error) {
      console.error('Error verifying license signature:', error);
      return false;
    }
  }

  /**
   * Activate a license key
   * @param {string} key License key
   * @param {string} name User name
   * @param {string} email User email
   * @returns {object} Activation result
   */
  activateLicense(key, name, email) {
    // In a real implementation, this would validate the license key with a server
    // For this example, we'll accept any key that matches a specific pattern
    
    if (!key || !name || !email) {
      return { success: false, message: 'Please fill in all fields' };
    }
    
    // Simple validation: key should be in format XXXX-XXXX-XXXX-XXXX
    const keyPattern = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    if (!keyPattern.test(key)) {
      return { success: false, message: 'Invalid license key format' };
    }
    
    // For demo purposes, accept any key that matches the pattern
    // In a real implementation, this would check with a license server
    
    // Create license data
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // License valid for 1 year
    
    const licenseInfo = `${key}-${name}-${email}`;
    const signature = crypto.createHash('sha256').update(licenseInfo).digest('hex');
    
    this.licenseData = {
      key,
      name,
      email,
      activationDate: new Date().toISOString(),
      expiryDate: expiryDate.toISOString(),
      signature
    };
    
    // Save license data
    if (this.saveLicense()) {
      return { 
        success: true, 
        message: 'License activated successfully',
        expiryDate: expiryDate.toISOString()
      };
    } else {
      return { success: false, message: 'Error saving license data' };
    }
  }

  /**
   * Show license activation dialog
   * @param {BrowserWindow} parentWindow Parent window
   * @returns {Promise<boolean>} True if license was activated
   */
  async showActivationDialog(parentWindow) {
    const result = await dialog.showMessageBox(parentWindow, {
      type: 'info',
      title: 'License Activation Required',
      message: 'Mashaaer Enhanced requires activation',
      detail: 'Please activate your copy of Mashaaer Enhanced to continue using the application.',
      buttons: ['Activate Now', 'Exit'],
      defaultId: 0,
      cancelId: 1
    });
    
    if (result.response === 0) {
      // User chose to activate
      return true;
    } else {
      // User chose to exit
      return false;
    }
  }

  /**
   * Get license information
   * @returns {object|null} License information or null if no license
   */
  getLicenseInfo() {
    return this.licenseData;
  }
}

module.exports = LicenseManager;