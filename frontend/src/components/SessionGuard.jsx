import React, { useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';

const SessionGuard = ({ children }) => {
  const { token, isAuthenticated } = useContext(AuthContext);

  // Industry Standard: Update activity on actual user interaction
  const updateActivity = useCallback(() => {
    if (token && isAuthenticated) {
      localStorage.setItem('auth_last_activity', Date.now().toString());
    }
  }, [token, isAuthenticated]);

  useEffect(() => {
    // Track actual user interactions (Industry Standard)
    const events = [
      'click', 'keydown', 'scroll', 'mousemove', 
      'touchstart', 'touchmove', 'focus', 'blur'
    ];

    // Throttled activity update (max once per minute)
    let lastUpdate = 0;
    const throttledUpdate = () => {
      const now = Date.now();
      if (now - lastUpdate > 60000) { // 1 minute throttle
        updateActivity();
        lastUpdate = now;
      }
    };

    // Add event listeners for user activity
    events.forEach(event => {
      document.addEventListener(event, throttledUpdate, { passive: true });
    });

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && token && isAuthenticated) {
        updateActivity();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // Cleanup event listeners
      events.forEach(event => {
        document.removeEventListener(event, throttledUpdate);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [token, isAuthenticated, updateActivity]);

  return children;
};

export default SessionGuard;
