"use client";
import React, { createContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import apiService from '@/services/api';

interface User {
  name?: string;
  email?: string;
  businessName?: string;
  ownerName?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string;
  role: string;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string) => void;
  setRole: (role: string) => void;
  setIsAuthenticated: (auth: boolean) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const sessionCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const tokenRefreshInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check for existing authentication from both localStorage and sessionStorage
    if (typeof window !== 'undefined') {
      // First check sessionStorage, then fallback to localStorage
      const storedToken = sessionStorage.getItem('token') || localStorage.getItem('token');
      const storedRole = sessionStorage.getItem('userRole') || localStorage.getItem('userRole');
      
      if (storedToken && storedRole) {
        setToken(storedToken);
        setRole(storedRole);
        setIsAuthenticated(true);
        
        // Store in sessionStorage for current session
        sessionStorage.setItem('token', storedToken);
        sessionStorage.setItem('userRole', storedRole);
        
        // Note: You might want to validate the token with the server here
      }
      
      setLoading(false);
    }
  }, []);

  const handleGlobalLogout = useCallback(() => {
    setToken('');
    setUser(null);
    setRole('');
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('auth_last_activity');
      sessionStorage.removeItem('auth_tab_id');
      sessionStorage.removeItem('userRole');
      localStorage.removeItem('token');
      localStorage.removeItem('auth_last_activity');
      localStorage.removeItem('auth_tab_id');
      localStorage.removeItem('userRole');
    }
    if (tokenRefreshInterval.current) clearInterval(tokenRefreshInterval.current);
    if (sessionCheckInterval.current) clearInterval(sessionCheckInterval.current);
  }, []);

  const setTokenHandler = useCallback((newToken: string) => {
    setToken(newToken);
    if (typeof window !== 'undefined') {
      if (newToken) {
        sessionStorage.setItem('token', newToken);
        localStorage.setItem('token', newToken);
      } else {
        sessionStorage.removeItem('token');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const setRoleHandler = useCallback((newRole: string) => {
    setRole(newRole);
    if (typeof window !== 'undefined') {
      if (newRole) {
        sessionStorage.setItem('userRole', newRole);
        localStorage.setItem('userRole', newRole);
      } else {
        sessionStorage.removeItem('userRole');
        localStorage.removeItem('userRole');
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      role, 
      isAuthenticated, 
      loading, 
      setUser, 
      setToken: setTokenHandler, 
      setRole: setRoleHandler, 
      setIsAuthenticated, 
      logout: handleGlobalLogout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};