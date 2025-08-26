// Email Module Index - Main entry point for email functionality
export { default as EmailService } from './EmailService.js';
export { default as MarketingController } from './MarketingController.js';
export { default as EmailAnalyticsController } from './EmailAnalyticsController.js';
export { default as emailRoutes } from './emailRoutes.js';

// Quick access functions for common email operations
import EmailService from './EmailService.js';

// Wrapper functions for easy importing in other modules
export const sendWelcomeEmail = (user) => EmailService.sendWelcomeEmail(user);
export const sendOTPEmail = (user, otp, purpose) => EmailService.sendOTPEmail(user, otp, purpose);
export const sendPasswordResetConfirmation = (user, resetDetails) => 
  EmailService.sendPasswordResetConfirmation(user, resetDetails);
export const sendBookingEmail = (user, booking, emailType, additionalData) => 
  EmailService.sendBookingEmail(user, booking, emailType, additionalData);
export const sendPaymentEmail = (user, payment, booking, emailType) => 
  EmailService.sendPaymentEmail(user, payment, booking, emailType);
