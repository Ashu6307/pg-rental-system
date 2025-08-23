import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const SessionGuard = ({ children }) => {
  const { token, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    // Industry Standard: Minimal security checks without aggressive blocking
    const handlePageFocus = () => {
      if (token && isAuthenticated) {
        // Update activity timestamp when user focuses on tab (10 minutes timeout)
        localStorage.setItem('auth_last_activity', Date.now().toString());
      }
    };

    const handlePageVisibility = () => {
      if (document.visibilityState === 'visible' && token && isAuthenticated) {
        // Update activity when tab becomes visible
        localStorage.setItem('auth_last_activity', Date.now().toString());
      }
    };

    // Listen for page focus and visibility changes
    window.addEventListener('focus', handlePageFocus);
    document.addEventListener('visibilitychange', handlePageVisibility);

    return () => {
      window.removeEventListener('focus', handlePageFocus);
      document.removeEventListener('visibilitychange', handlePageVisibility);
    };
  }, [token, isAuthenticated]);

  return children;
};

export default SessionGuard;
