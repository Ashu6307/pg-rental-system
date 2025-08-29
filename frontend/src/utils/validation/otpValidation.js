// OTP Validation Utility
// Usage: import { isValidOtp, isOtpExpired, isOtpUsed, getOtpValidationError } from './otpValidation';

// Check if OTP is valid (digits or alphanumeric, correct length)
export function isValidOtp(otp, length = 6, { alphanumeric = false } = {}) {
  if (typeof otp !== 'string' || otp.length !== length) return false;
  return alphanumeric ? /^[a-zA-Z0-9]+$/.test(otp) : /^\d+$/.test(otp);
}

// Check if OTP is expired (createdAt: Date or timestamp, expirySeconds: number)
export function isOtpExpired(createdAt, expirySeconds = 300) {
  if (!createdAt) return true;
  const created = typeof createdAt === 'number' ? createdAt : new Date(createdAt).getTime();
  const now = Date.now();
  return now - created > expirySeconds * 1000;
}

// Get time remaining before OTP expires (in seconds)
export function getOtpTimeRemaining(createdAt, expirySeconds = 300) {
  if (!createdAt) return 0;
  const created = typeof createdAt === 'number' ? createdAt : new Date(createdAt).getTime();
  const now = Date.now();
  const remaining = expirySeconds - Math.floor((now - created) / 1000);
  return Math.max(0, remaining);
}

// Check if OTP is already used (used: boolean or status string)
export function isOtpUsed(used) {
  return used === true || used === 'used';
}

// Get OTP validation error message (returns string or null)
export function getOtpValidationError(
  otp,
  {
    createdAt,
    expirySeconds = 300,
    used = false,
    length = 6,
    alphanumeric = false,
    attempts = 0,
    maxAttempts = 5,
    customMessages = {}
  } = {}
) {
  if (attempts >= maxAttempts) return customMessages.attempts || `Too many invalid attempts. Please request a new OTP.`;
  if (!isValidOtp(otp, length, { alphanumeric }))
    return customMessages.format || `OTP must be a ${length}-digit${alphanumeric ? ' (alphanumeric)' : ''} code`;
  if (isOtpExpired(createdAt, expirySeconds))
    return customMessages.expired || 'OTP has expired';
  if (isOtpUsed(used))
    return customMessages.used || 'OTP has already been used';
  return null;
}

// Helper: Format seconds to mm:ss for UI
export function formatOtpTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
