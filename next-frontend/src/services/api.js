// Centralized API configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_API_URL || 'https://your-production-api.com'
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
    const token = typeof window !== 'undefined' ? (sessionStorage.getItem('token') || localStorage.getItem('token')) : null;
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
      // Remove content-type for FormData, browser sets it automatically
      delete config.headers['Content-Type'];
    } else {
      config.body = JSON.stringify(data);
    }
    return this.request(endpoint, config);
  }

  // PUT request
  async put(endpoint, data, options = {}) {
    const config = {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    };
    return this.request(endpoint, config);
  }

  // DELETE request
  async delete(endpoint, options = {}) {
    const config = {
      method: 'DELETE',
      ...options,
    };
    return this.request(endpoint, config);
  }

  // Area Images Management
  async addAreaImage(roomId, area, imageUrl, label = null) {
    const body = { area, imageUrl };
    if (area === 'others' && label) {
      body.label = label;
    }
    
    return this.post(`/api/rooms/${roomId}/area-images`, { body: JSON.stringify(body) });
  }

  async removeAreaImage(roomId, area, imageIndex, label = null) {
    const body = { area, imageIndex };
    if (area === 'others' && label) {
      body.label = label;
    }
    
    return this.delete(`/api/rooms/${roomId}/area-images`, { body: JSON.stringify(body) });
  }
}

const apiService = new ApiService();
export default apiService;
