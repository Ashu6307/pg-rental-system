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
  const [token, setToken] = useState<string>(typeof window !== 'undefined' ? sessionStorage.getItem('token') || '' : '');
  const [role, setRole] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const sessionCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const tokenRefreshInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clean up any old localStorage tokens completely
    if (typeof window !== 'undefined') {
      const oldToken = localStorage.getItem('token');
      if (oldToken) {
        localStorage.removeItem('token');
        localStorage.removeItem('auth_last_activity');
        localStorage.removeItem('auth_tab_id');
        localStorage.removeItem('auth_session_expired');
        localStorage.removeItem('auth_logout_signal');
      }
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
      localStorage.removeItem('token');
      localStorage.removeItem('auth_last_activity');
      localStorage.removeItem('auth_tab_id');
    }
    if (tokenRefreshInterval.current) clearInterval(tokenRefreshInterval.current);
    if (sessionCheckInterval.current) clearInterval(sessionCheckInterval.current);
  }, []);

  // ...existing logic for login, token refresh, etc. (add as needed)

  return (
    <AuthContext.Provider value={{ user, token, role, isAuthenticated, loading, setUser, setToken, setRole, setIsAuthenticated, logout: handleGlobalLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
