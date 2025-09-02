/**
 * OTP Configuration Utilities
 * Role-based OTP attempt limits and other configurations
 */

export type UserRole = 'admin' | 'owner' | 'user';

/**
 * Get maximum OTP attempts based on user role
 * @param role - User role (admin, owner, user)
 * @returns Number of maximum attempts allowed
 */
export const getMaxOtpAttempts = (role: UserRole): number => {
  switch(role) {
    case 'admin': 
      return 5; // Admin gets 5 attempts (highest security level)
    case 'owner': 
      return 4; // Owner gets 4 attempts (business user)
    case 'user': 
      return 3; // Regular user gets 3 attempts (standard)
    default: 
      return 3; // Default fallback
  }
};

/**
 * Get OTP expiry time based on user role (in seconds)
 * @param role - User role
 * @returns Expiry time in seconds
 */
export const getOtpExpiryTime = (role: UserRole): number => {
  switch(role) {
    case 'admin': 
      return 600; // 10 minutes for admin
    case 'owner': 
      return 300; // 5 minutes for owner
    case 'user': 
      return 300; // 5 minutes for user
    default: 
      return 300; // Default 5 minutes
  }
};

/**
 * Get resend timer based on user role (in seconds)
 * @param role - User role
 * @returns Resend timer in seconds
 */
export const getResendTimer = (role: UserRole): number => {
  switch(role) {
    case 'admin': 
      return 120; // 2 minutes for admin
    case 'owner': 
      return 90;  // 1.5 minutes for owner
    case 'user': 
      return 60;  // 1 minute for user
    default: 
      return 60;  // Default 1 minute
  }
};

/**
 * Get role-specific error messages
 * @param role - User role
 * @returns Object with role-specific messages
 */
export const getRoleMessages = (role: UserRole) => {
  const attempts = getMaxOtpAttempts(role);
  
  return {
    maxAttemptsReached: `Too many attempts. ${role === 'admin' ? 'Admin' : role === 'owner' ? 'Owner' : 'User'} OTP disabled. Please resend.`,
    otpSent: `${role === 'admin' ? 'Admin' : role === 'owner' ? 'Owner' : 'User'} OTP sent successfully!`,
    attemptsRemaining: (remaining: number) => `${remaining} attempt${remaining === 1 ? '' : 's'} remaining`,
    invalidOtp: 'Invalid OTP',
    expiredOtp: 'OTP expired'
  };
};
