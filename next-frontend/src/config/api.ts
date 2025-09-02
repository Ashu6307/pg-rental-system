// API Configuration - Matching old frontend pattern
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_API_URL || 'https://your-production-api.com'
  : 'http://localhost:5000';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    // Auth endpoints - exactly matching backend routes
    FORGOT_PASSWORD: '/api/forgot-password',
    VERIFY_OTP: '/api/auth/verify-otp', 
    RESET_PASSWORD: '/api/forgot-password/reset-password',
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    
    // OTP endpoints - exactly matching old frontend
    SEND_OTP: '/api/otp/send-otp',
    VERIFY_REGISTER_OTP: '/api/otp/verify-otp',
    
    // Admin endpoints - exactly matching old frontend
    ADMIN_LOGIN: '/api/admin/login',
    ADMIN_REGISTER: '/api/admin/register',
    ADMIN_SEND_OTP: '/api/admin/send-otp',
    ADMIN_VERIFY_OTP: '/api/admin/verify-otp',
    
    // User endpoints
    PROFILE: '/api/user/profile',
    
    // Owner endpoints
    OWNER_DASHBOARD: '/api/owner/dashboard',
    OWNER_REGISTER: '/api/auth/owner/register',
    
    // Admin endpoints
    ADMIN_DASHBOARD: '/api/admin/dashboard',
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// API Service Class - Matching old frontend pattern
class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available (check both sessionStorage and localStorage for backward compatibility)
    const token = typeof window !== 'undefined' ? 
      (sessionStorage.getItem('token') || localStorage.getItem('token')) : null;
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If we can't parse JSON, use the status message
        }
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      // Only show API errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error(`API Error for ${endpoint}:`, error);
      }
      throw error;
    }
  }

  // GET request
  async get(endpoint: string, options: RequestInit = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  // POST request
  async post(endpoint: string, data?: any, options: RequestInit = {}) {
    // Handle FormData (for file uploads)
    const isFormData = data instanceof FormData;
    
    const config: RequestInit = {
      method: 'POST',
      ...options,
    };

    if (isFormData) {
      config.body = data;
      // Don't set Content-Type for FormData, let browser set it
      const headers = { ...config.headers };
      delete (headers as any)['Content-Type'];
      config.headers = headers;
    } else if (data) {
      config.body = JSON.stringify(data);
    }

    return this.request(endpoint, config);
  }

  // PUT request
  async put(endpoint: string, data: any, options: RequestInit = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  // DELETE request
  async delete(endpoint: string, options: RequestInit = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

export const apiService = new ApiService();

// Helper function for making API calls (backward compatibility)
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  return apiService.request(endpoint, options);
};
