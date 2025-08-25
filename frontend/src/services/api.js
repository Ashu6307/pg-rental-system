// Centralized API configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL || 'https://your-production-api.com'
  : 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available (check both sessionStorage and localStorage for backward compatibility)
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
  async get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  // POST request
  async post(endpoint, data, options = {}) {
    // Handle FormData (for file uploads)
    const isFormData = data instanceof FormData;
    
    const config = {
      method: 'POST',
      ...options,
    };

    if (isFormData) {
      config.body = data;
      // Don't set Content-Type for FormData, let browser set it
      delete config.headers?.['Content-Type'];
    } else {
      config.body = JSON.stringify(data);
    }

    return this.request(endpoint, config);
  }

  // PUT request
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  // DELETE request
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

export default new ApiService();
