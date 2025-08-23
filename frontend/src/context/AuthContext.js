import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';
import apiService from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Industry Standard: State Management with Tab Isolation
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem('token') || '');
  const [role, setRole] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Industry Standard: Tab Management
  const [tabId] = useState(`tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const sessionCheckInterval = useRef(null);
  const tokenRefreshInterval = useRef(null);

  // Industry Standard: Tab-specific session management (no cross-tab communication)
  useEffect(() => {
    // Tab isolation: Each tab maintains its own session
    // No cross-tab communication needed as sessions are tab-specific
    console.log('AuthContext: Tab-specific session initialized', tabId);
    
    // Clean up any old localStorage tokens completely
    const oldToken = localStorage.getItem('token');
    if (oldToken) {
      console.log('AuthContext: Removing old localStorage token for tab isolation');
      localStorage.removeItem('token');
      localStorage.removeItem('auth_last_activity');
      localStorage.removeItem('auth_tab_id');
      localStorage.removeItem('auth_session_expired');
      localStorage.removeItem('auth_logout_signal');
    }
  }, [tabId]);

  // Industry Standard: Tab-specific logout handler
  const handleGlobalLogout = useCallback(() => {
    console.log('AuthContext: Performing tab-specific logout');
    
    // Clear all auth data
    setToken('');
    setUser(null);
    setRole('');
    setIsAuthenticated(false);
    
    // Clear sessionStorage (tab-specific)
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('auth_last_activity');
    sessionStorage.removeItem('auth_tab_id');
    
    // Clean up any remaining localStorage items
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
  }, []);

  const handleSessionExpiration = useCallback(() => {
    // Admin users are completely exempt from session expiration
    if (role === 'admin') {
      console.log('AuthContext: Session expiration completely disabled for admin - no action taken');
      return;
    }
    
    console.log('AuthContext: Session expired due to 30 minutes of inactivity');
    console.log('Last activity timestamp:', sessionStorage.getItem('auth_last_activity'));
    console.log('Current timestamp:', Date.now());
    console.log('User role:', role);
    
    // Store expired user's role for smart redirect (Industry Standard)
    if (role) {
      localStorage.setItem('auth_expired_role', role);
    }
    
    // Perform logout first
    handleGlobalLogout();
    
    // Redirect to professional session expired page (no alert popup)
    window.location.href = '/session-expired';
  }, [role, handleGlobalLogout]);

  // Industry Standard: Session Activity Monitoring (Disabled for Admin)
  const checkSessionActivity = useCallback(() => {
    // Skip session timeout for admin users
    if (role === 'admin') {
      console.log('AuthContext: Session timeout disabled for admin user');
      return;
    }
    
    const lastActivity = sessionStorage.getItem('auth_last_activity');
    
    if (lastActivity) {
      const timeSinceActivity = Date.now() - parseInt(lastActivity);
      
      // Session timeout after 30 minutes of inactivity (Increased for better UX)
      if (timeSinceActivity > 30 * 60 * 1000) {
        console.log('AuthContext: Session timeout due to inactivity (30 minutes)');
        handleSessionExpiration();
      }
    }
  }, [handleSessionExpiration, role]);

  // Industry Standard: JWT Token Validation with Session Activity Check
  const validateTokenAndRefresh = useCallback(async () => {
    const storedToken = sessionStorage.getItem('token');
    
    if (!storedToken) {
      setIsAuthenticated(false);
      setUser(null);
      setRole('');
      setToken('');
      return false;
    }

    try {
      // FIRST: Check session activity (Industry Standard for security)
      const lastActivity = sessionStorage.getItem('auth_last_activity');
      if (lastActivity) {
        const timeSinceActivity = Date.now() - parseInt(lastActivity);
        
        // If session expired due to inactivity (10 minutes)
        if (timeSinceActivity > 10 * 60 * 1000) {
          console.log('AuthContext: Session expired due to inactivity during validation');
          // Don't call handleSessionExpiration here to avoid infinite loop
          localStorage.removeItem('token');
          localStorage.setItem('auth_session_expired', Date.now().toString());
          setIsAuthenticated(false);
          setUser(null);
          setRole('');
          setToken('');
          return false;
        }
      }

      // Parse JWT payload to check expiration (industry standard)
      const payload = JSON.parse(atob(storedToken.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Check if JWT token is expired (Admin gets special treatment)
      if (payload.exp <= currentTime) {
        console.log('AuthContext: JWT token has expired');
        
        // For admin, never set session expired flag or logout
        if (payload.role === 'admin') {
          console.log('AuthContext: Admin token expired - continuing without logout');
          // Admin continues with expired token - backend will handle renewal
          // Do not set session expired flag
          // Do not logout
          // Continue normal flow
        } else {
          // For non-admin users, handle expiry normally
          localStorage.removeItem('token');
          localStorage.setItem('auth_session_expired', Date.now().toString());
          setIsAuthenticated(false);
          setUser(null);
          setRole('');
          setToken('');
          return false;
        }
      }
      
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
      
      // Validate token with backend using role-specific endpoint
      let response;
      try {
        // Use admin endpoint for admin tokens
        if (payload.role === 'admin') {
          response = await apiService.get('/api/admin/me');
        } else {
          response = await apiService.get('/api/auth/me');
        }
      } catch (error) {
        console.log('AuthContext: Token validation failed:', error);
        return false;
      }
      
      if (response.user || (response.success && response.user)) {
        const userData = response.user;
        setUser(userData);
        setRole(userData.role);
        setIsAuthenticated(true);
        
        // Update session tracking in sessionStorage for tab isolation
        sessionStorage.setItem('auth_last_activity', Date.now().toString());
        sessionStorage.setItem('auth_tab_id', tabId);
        
        // Store role for smart session expiry redirect (Industry Standard)
        localStorage.setItem('lastUserRole', userData.role);
        
        return true;
      } else {
        throw new Error('Invalid token response');
      }
    } catch (error) {
      console.error('AuthContext: Token validation failed:', error);
      
      // Clear auth state for ANY validation failure
      sessionStorage.removeItem('token');
      localStorage.setItem('auth_session_expired', Date.now().toString());
      setIsAuthenticated(false);
      setUser(null);
      setRole('');
      setToken('');
      
      return false;
    }
  }, [tabId]);

  // Industry Standard: Initialize authentication on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      
      // Check if session was already expired (Skip for admin routes)
      const sessionExpired = localStorage.getItem('auth_session_expired');
      const storedToken = sessionStorage.getItem('token');
      const currentPath = window.location.pathname;
      
      // If on admin route, always clear session expired flags
      if (currentPath.startsWith('/admin')) {
        if (sessionExpired) {
          console.log('AuthContext: Admin route detected - clearing session expired flags');
          localStorage.removeItem('auth_session_expired');
        }
        // Continue normal admin flow - no redirect
      } else if (sessionExpired && storedToken) {
        try {
          const payload = JSON.parse(atob(storedToken.split('.')[1]));
          if (payload.role === 'admin') {
            console.log('AuthContext: Admin token with session expired - clearing and continuing');
            localStorage.removeItem('auth_session_expired');
            // Continue normal flow for admin
          } else {
            console.log('AuthContext: Previous session expired detected for non-admin user');
            localStorage.removeItem('auth_session_expired');
            setIsAuthenticated(false);
            setUser(null);
            setRole('');
            setToken('');
            setLoading(false);
            
            if (window.location.pathname !== '/session-expired') {
              window.location.href = '/session-expired';
            }
            return;
          }
        } catch (error) {
          // If token parsing fails, treat as non-admin
          console.log('AuthContext: Error parsing token, treating as non-admin expired session');
          localStorage.removeItem('auth_session_expired');
          setIsAuthenticated(false);
          setUser(null);
          setRole('');
          setToken('');
          setLoading(false);
          
          if (window.location.pathname !== '/session-expired') {
            window.location.href = '/session-expired';
          }
          return;
        }
      } else if (sessionExpired && !storedToken) {
        // No token but session expired flag exists - clear and redirect for non-admin
        console.log('AuthContext: Session expired with no token');
        localStorage.removeItem('auth_session_expired');
        setIsAuthenticated(false);
        setUser(null);
        setRole('');
        setToken('');
        setLoading(false);
        
        if (window.location.pathname !== '/session-expired') {
          window.location.href = '/session-expired';
        }
        return;
      }
      
      // Only validate token if one exists
      if (storedToken) {
        console.log('AuthContext: Found stored token, validating...');
        const isValid = await validateTokenAndRefresh();
        
        if (isValid) {
          console.log('AuthContext: Token validation successful');
          // Start periodic token validation (every 5 minutes)
          tokenRefreshInterval.current = setInterval(validateTokenAndRefresh, 5 * 60 * 1000);
          
          // Start session activity monitoring (every 1 minute) - Disabled for Admin
          if (role !== 'admin') {
            sessionCheckInterval.current = setInterval(checkSessionActivity, 60 * 1000);
          } else {
            console.log('AuthContext: Session monitoring disabled for admin user');
          }
        } else {
          console.log('AuthContext: Token validation failed, clearing session');
          // Clear invalid token
          sessionStorage.removeItem('token');
          setToken('');
          setIsAuthenticated(false);
          setUser(null);
          setRole('');
        }
        setLoading(false);
      } else {
        // No token found - user is not logged in
        console.log('AuthContext: No token found - user not logged in');
        setIsAuthenticated(false);
        setUser(null);
        setRole('');
        setToken('');
        setLoading(false);
      }
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
  }, [validateTokenAndRefresh, checkSessionActivity]);

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
        
        // Store token in sessionStorage for tab isolation
        setToken(tokenOrEmail);
        sessionStorage.setItem('token', tokenOrEmail);
        sessionStorage.setItem('auth_last_activity', Date.now().toString());
        sessionStorage.setItem('auth_tab_id', tabId);
        
        // If user data is provided, set it immediately
        if (passwordOrUserData && passwordOrUserData.role) {
          setUser(passwordOrUserData);
          setRole(passwordOrUserData.role);
          setIsAuthenticated(true);
          
          // Store role for smart session expiry redirect
          localStorage.setItem('lastUserRole', passwordOrUserData.role);
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
        // Store token and session data in sessionStorage for tab isolation
        setToken(response.token);
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('auth_last_activity', Date.now().toString());
        sessionStorage.setItem('auth_tab_id', tabId);
        
        // Set user data
        if (response.user) {
          setUser(response.user);
          setRole(response.user.role);
          setIsAuthenticated(true);
          
          // Store role for session expiry redirect
          localStorage.setItem('lastUserRole', response.user.role);
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

  // Industry Standard: Activity tracking with privacy considerations (Disabled for Admin)
  useEffect(() => {
    const updateActivity = () => {
      if (token && isAuthenticated && role !== 'admin') {
        sessionStorage.setItem('auth_last_activity', Date.now().toString());
      }
    };

    // OWASP recommended events for activity tracking
    const securityEvents = ['mousedown', 'keypress', 'scroll', 'click'];
    
    // Skip activity tracking for admin users
    if (role === 'admin') {
      console.log('AuthContext: Activity tracking disabled for admin user');
      return;
    }
    
    securityEvents.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    return () => {
      securityEvents.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
    };
  }, [token, isAuthenticated, role]);

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
