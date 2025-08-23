import React, { createContext, useState, useEffect, useRef } from 'react';
import apiService from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [role, setRole] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tabId] = useState(`tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`); // Unique tab identifier
  const sessionCheckInterval = useRef(null);
  const tokenRefreshInterval = useRef(null);

  // Industry Standard: Cross-tab communication for session management
  useEffect(() => {
    const handleStorageChange = (e) => {
      switch (e.key) {
        case 'token':
          // Token changed in another tab
          if (!e.newValue && token) {
            console.log('AuthContext: Token removed by another tab - syncing logout');
            handleGlobalLogout();
          } else if (e.newValue && !token) {
            console.log('AuthContext: Token added by another tab - syncing login');
            setToken(e.newValue);
          }
          break;
          
        case 'auth_logout_signal':
          // Explicit logout signal from another tab
          if (e.newValue) {
            console.log('AuthContext: Logout signal received from another tab');
            handleGlobalLogout();
            // Clear signal after processing
            setTimeout(() => localStorage.removeItem('auth_logout_signal'), 100);
          }
          break;
          
        case 'auth_session_expired':
          // Session expiration signal
          if (e.newValue) {
            console.log('AuthContext: Session expired - logging out all tabs');
            handleSessionExpiration();
            setTimeout(() => localStorage.removeItem('auth_session_expired'), 100);
          }
          break;
          
        default:
          break;
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [token, tabId]);

  // Set this tab as active session
  // Industry Standard: Initialize authentication on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      await validateTokenAndRefresh();
      setLoading(false);
      
      // Start periodic token validation (every 5 minutes)
      tokenRefreshInterval.current = setInterval(validateTokenAndRefresh, 5 * 60 * 1000);
      
      // Start session activity monitoring (every 30 seconds)
      sessionCheckInterval.current = setInterval(checkSessionActivity, 30 * 1000);
    };
    
    initializeAuth();
    
    return () => {
      if (tokenRefreshInterval.current) {
        clearInterval(tokenRefreshInterval.current);
      }
      if (sessionCheckInterval.current) {
        clearInterval(sessionCheckInterval.current);
      }
    };
  }, [validateTokenAndRefresh]);

  // Industry Standard: Session Activity Monitoring
  const checkSessionActivity = () => {
    const lastActivity = localStorage.getItem('auth_last_activity');
    
    if (lastActivity) {
      const timeSinceActivity = Date.now() - parseInt(lastActivity);
      
      // Session timeout after 30 minutes of inactivity (OWASP recommendation)
      if (timeSinceActivity > 30 * 60 * 1000) {
        console.log('AuthContext: Session timeout due to inactivity');
        handleSessionExpiration();
      }
    }
  };

  // Industry Standard: Centralized logout handlers
  const handleGlobalLogout = () => {
    console.log('AuthContext: Performing global logout');
    
    // Clear all auth data
    setToken('');
    setUser(null);
    setRole('');
    setIsAuthenticated(false);
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('auth_last_activity');
    localStorage.removeItem('auth_tab_id');
    
    // Clear intervals
    if (tokenRefreshInterval.current) {
      clearInterval(tokenRefreshInterval.current);
    }
    if (sessionCheckInterval.current) {
      clearInterval(sessionCheckInterval.current);
    }
  };

  const handleSessionExpiration = () => {
    console.log('AuthContext: Session expired');
    
    // Notify user
    alert('Your session has expired due to inactivity. Please login again.');
    
    // Perform logout
    handleGlobalLogout();
    
    // Redirect to login
    window.location.href = '/user/login';
  };

  useEffect(() => {
    console.log('AuthContext: Token changed:', token ? 'Present' : 'Not present');
    if (token) {
      // Verify token is still valid
      apiService.get('/api/auth/me')
        .then(response => {
          console.log('AuthContext: Auth check response:', response);
          
  // Industry Standard: JWT Token Validation and Auto-refresh
  const validateTokenAndRefresh = useCallback(async () => {
    const storedToken = localStorage.getItem('token');
    
    if (!storedToken) {
      setIsAuthenticated(false);
      setUser(null);
      setRole('');
      return false;
    }

    try {
      // Parse JWT payload to check expiration (industry standard)
      const payload = JSON.parse(atob(storedToken.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Check if token expires in next 5 minutes (refresh window)
      if (payload.exp - currentTime < 300) {
        console.log('AuthContext: Token expires soon, attempting refresh');
        // TODO: Implement token refresh endpoint
        // const refreshedToken = await apiService.post('/api/auth/refresh');
        // if (refreshedToken.token) {
        //   localStorage.setItem('token', refreshedToken.token);
        //   setToken(refreshedToken.token);
        // }
      }
      
      // Validate token with backend
      const response = await apiService.get('/api/auth/me');
      
      if (response.user || (response.success && response.user)) {
        const userData = response.user;
        setUser(userData);
        setRole(userData.role);
        setIsAuthenticated(true);
        
        // Update session tracking
        localStorage.setItem('auth_last_activity', Date.now().toString());
        localStorage.setItem('auth_tab_id', tabId);
        
        return true;
      } else {
        throw new Error('Invalid token response');
      }
    } catch (error) {
      console.error('AuthContext: Token validation failed:', error);
      
      if (error.status === 401 || error.status === 403) {
        // Token is invalid/expired
        localStorage.removeItem('token');
        localStorage.setItem('auth_session_expired', Date.now().toString());
        setIsAuthenticated(false);
        setUser(null);
        setRole('');
        setToken('');
      }
      
      return false;
    }
  }, [tabId]);

  // Industry Standard: JWT-based login with proper session management
  const login = async (tokenOrEmail, passwordOrUserData) => {
    try {
      // If first param is a token string (direct login from successful auth)
      if (typeof tokenOrEmail === 'string' && tokenOrEmail.length > 50) {
        console.log('AuthContext: Direct login with JWT token');
        
        // Validate token format (JWT has 3 parts)
        const tokenParts = tokenOrEmail.split('.');
        if (tokenParts.length !== 3) {
          throw new Error('Invalid JWT token format');
        }
        
        // Store token
        setToken(tokenOrEmail);
        localStorage.setItem('token', tokenOrEmail);
        localStorage.setItem('auth_last_activity', Date.now().toString());
        localStorage.setItem('auth_tab_id', tabId);
        
        // If user data is provided, set it immediately
        if (passwordOrUserData && passwordOrUserData.role) {
          setUser(passwordOrUserData);
          setRole(passwordOrUserData.role);
          setIsAuthenticated(true);
        } else {
          // Validate token with backend
          await validateTokenAndRefresh();
        }
        
        return { success: true };
      }
      
      // Traditional email/password login
      const response = await apiService.post('/api/auth/login', { 
        email: tokenOrEmail, 
        password: passwordOrUserData 
      });
      
      if (response.success && response.token) {
        // Store token and session data
        setToken(response.token);
        localStorage.setItem('token', response.token);
        localStorage.setItem('auth_last_activity', Date.now().toString());
        localStorage.setItem('auth_tab_id', tabId);
        
        // Set user data
        if (response.user) {
          setUser(response.user);
          setRole(response.user.role);
          setIsAuthenticated(true);
        }
        
        return { success: true, user: response.user };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw error;
    }
  };

  // Industry Standard: Secure logout with cross-tab communication
  const logout = () => {
    console.log('AuthContext: Initiating secure logout');
    
    // Send logout signal to all tabs FIRST
    localStorage.setItem('auth_logout_signal', Date.now().toString());
    
    // Perform local logout
    handleGlobalLogout();
    
    // TODO: Notify backend about logout (for token blacklisting)
    // apiService.post('/api/auth/logout', { token }).catch(console.error);
  };

  // Industry Standard: Activity tracking with privacy considerations
  useEffect(() => {
    const updateActivity = () => {
      if (token && isAuthenticated) {
        localStorage.setItem('auth_last_activity', Date.now().toString());
      }
    };

    // OWASP recommended events for activity tracking
    const securityEvents = ['mousedown', 'keypress', 'scroll', 'click'];
    
    securityEvents.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    return () => {
      securityEvents.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
    };
  }, [token, isAuthenticated]);

  return (
    <AuthContext.Provider value={{ 
      // State
      user, 
      token, 
      role, 
      isAuthenticated,
      loading,
      
      // Actions
      login, 
      logout,
      
      // Internal (for backward compatibility)
      setToken, 
      setUser, 
      setRole,
      
      // Session info
      tabId
    }}>
      {children}
    </AuthContext.Provider>
  );
};
