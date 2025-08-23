// Auth service for handling authentication API calls
import apiService from './api';

export const authService = {
  // Login
  async login(credentials) {
    // Check both 'role' and 'userType' fields
    const userRole = credentials.role || credentials.userType;
    const endpoint = userRole === 'admin' ? '/api/admin/login' : '/api/auth/login';
    console.log('AuthService Login - Role:', userRole, 'Endpoint:', endpoint, 'Credentials:', credentials); // Debug log
    const response = await apiService.post(endpoint, credentials);
    console.log('AuthService Login Response:', response); // Debug log
    return response;
  },

  // Register
  async register(userData) {
    const endpoint = userData.role === 'admin' ? '/api/admin/register' : '/api/auth/register';
    return await apiService.post(endpoint, userData);
  },

  // OTP Operations
  async sendOtp(email, role = 'user') {
    const endpoint = role === 'admin' ? '/api/admin/send-otp' : '/api/otp/send-otp';
    console.log('SendOTP - Role:', role, 'Endpoint:', endpoint); // Debug log
    return await apiService.post(endpoint, { email, role });
  },

  async verifyOtp(email, otp, role = 'user') {
    const endpoint = role === 'admin' ? '/api/admin/verify-otp' : '/api/otp/verify-otp';
    return await apiService.post(endpoint, { email, otp, role });
  },

  // Password Reset
  async forgotPassword(email, role = 'user') {
    return await apiService.post('/api/auth/forgot-password', { email, role });
  },

  async resetPassword(email, otp, newPassword, role = 'user') {
    return await apiService.post('/api/auth/reset-password', { 
      email, 
      otp, 
      newPassword, 
      role 
    });
  },

  // Check authentication
  async checkAuth() {
    return await apiService.get('/api/auth/me');
  }
};

export default authService;
