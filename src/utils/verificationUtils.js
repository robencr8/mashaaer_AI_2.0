/**
 * Utility functions for user verification
 */

/**
 * Check if a user is verified (either email or phone)
 * @param {Object} user - The user object
 * @returns {boolean} - True if the user is verified
 */
export const isUserVerified = (user) => {
  if (!user) return false;
  return user.email_verified || user.phone_verified;
};

/**
 * Check if a user can access premium features
 * @param {Object} user - The user object
 * @returns {boolean} - True if the user can access premium features
 */
export const canAccessPremiumFeatures = (user) => {
  return isUserVerified(user);
};

/**
 * Get verification status message
 * @param {Object} user - The user object
 * @returns {Object} - Object containing status and message
 */
export const getVerificationStatus = (user) => {
  if (!user) {
    return {
      status: 'error',
      message: 'يرجى تسجيل الدخول للوصول إلى هذه الميزة'
    };
  }

  if (!isUserVerified(user)) {
    return {
      status: 'warning',
      message: 'يرجى توثيق حسابك للوصول إلى هذه الميزة'
    };
  }

  return {
    status: 'success',
    message: 'حسابك موثق ويمكنك الوصول إلى جميع الميزات'
  };
};