import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Authentication provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const response = await axios.get('/api/user');
        if (response.data && response.data.user) {
          setCurrentUser(response.data.user);
        }
      } catch (err) {
        // User is not logged in, that's okay
        console.log('User not logged in');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Register a new user
  const register = async (email, password, phone = null) => {
    try {
      setError(null);
      const response = await axios.post('/api/register', {
        email,
        password,
        phone
      });

      if (response.data && response.data.user) {
        setCurrentUser(response.data.user);
        return response.data.user;
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      throw err;
    }
  };

  // Login a user
  const login = async (emailOrPhone, password) => {
    try {
      setError(null);

      // Determine if input is email or phone
      const isEmail = emailOrPhone.includes('@');
      const loginData = isEmail 
        ? { email: emailOrPhone, password } 
        : { phone: emailOrPhone, password };

      const response = await axios.post('/api/login', loginData);

      if (response.data && response.data.user) {
        setCurrentUser(response.data.user);
        return response.data.user;
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      throw err;
    }
  };

  // Logout a user
  const logout = async () => {
    try {
      await axios.post('/api/logout');
      setCurrentUser(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Logout failed');
      throw err;
    }
  };

  // Clear any authentication errors
  const clearError = () => {
    setError(null);
  };

  // Request password reset
  const requestPasswordReset = async (email) => {
    try {
      setError(null);
      const response = await axios.post('/api/forgot-password', { email });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to request password reset');
      throw err;
    }
  };

  // Validate reset token
  const validateResetToken = async (token) => {
    try {
      setError(null);
      const response = await axios.get(`/api/reset-password/${token}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired token');
      throw err;
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    try {
      setError(null);
      const response = await axios.post('/api/reset-password', { token, password });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
      throw err;
    }
  };

  // Send email OTP
  const sendEmailOTP = async () => {
    try {
      setError(null);
      setOtpSent(false);
      const response = await axios.post('/api/send-email-otp');
      setOtpSent(true);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send email OTP');
      throw err;
    }
  };

  // Verify email OTP
  const verifyEmailOTP = async (otp) => {
    try {
      setError(null);
      const response = await axios.post('/api/verify-email-otp', { otp });
      if (response.data && response.data.user) {
        setCurrentUser(response.data.user);
      }
      setOtpSent(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to verify email OTP');
      throw err;
    }
  };

  // Send phone OTP
  const sendPhoneOTP = async () => {
    try {
      setError(null);
      setOtpSent(false);
      const response = await axios.post('/api/send-phone-otp');
      setOtpSent(true);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send phone OTP');
      throw err;
    }
  };

  // Verify phone OTP
  const verifyPhoneOTP = async (otp) => {
    try {
      setError(null);
      const response = await axios.post('/api/verify-phone-otp', { otp });
      if (response.data && response.data.user) {
        setCurrentUser(response.data.user);
      }
      setOtpSent(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to verify phone OTP');
      throw err;
    }
  };

  // Send WhatsApp OTP
  const sendWhatsAppOTP = async () => {
    try {
      setError(null);
      setOtpSent(false);
      const response = await axios.post('/api/send-whatsapp-otp');
      setOtpSent(true);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send WhatsApp OTP');
      throw err;
    }
  };

  // Verify WhatsApp OTP
  const verifyWhatsAppOTP = async (otp) => {
    try {
      setError(null);
      const response = await axios.post('/api/verify-whatsapp-otp', { otp });
      if (response.data && response.data.user) {
        setCurrentUser(response.data.user);
      }
      setOtpSent(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to verify WhatsApp OTP');
      throw err;
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await axios.put('/api/update-profile', profileData);
      if (response.data && response.data.user) {
        setCurrentUser(response.data.user);
      }
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
      throw err;
    }
  };

  // Value object to be provided by the context
  const value = {
    currentUser,
    loading,
    error,
    otpSent,
    register,
    login,
    logout,
    clearError,
    requestPasswordReset,
    validateResetToken,
    resetPassword,
    sendEmailOTP,
    verifyEmailOTP,
    sendPhoneOTP,
    verifyPhoneOTP,
    sendWhatsAppOTP,
    verifyWhatsAppOTP,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
