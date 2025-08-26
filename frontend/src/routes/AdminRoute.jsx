import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { role, loading, isAuthenticated } = useContext(AuthContext);
  
  // Clear any session expired flags for admin routes
  useEffect(() => {
    const currentToken = sessionStorage.getItem('token');
    if (currentToken) {
      try {
        const payload = JSON.parse(atob(currentToken.split('.')[1]));
        if (payload.role === 'admin') {
          // Admin route accessed - clear session flags
          localStorage.removeItem('auth_session_expired');
          sessionStorage.removeItem('auth_last_activity');
        }
      } catch (error) {
        // Token parsing failed
      }
    }
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  // For admin users, allow access if authenticated or if token exists with admin role
  if (role === 'admin' && isAuthenticated) {
    return children;
  }
  
  // Check token directly if role not set yet but loading is false
  const currentToken = sessionStorage.getItem('token');
  if (currentToken && !loading) {
    try {
      const payload = JSON.parse(atob(currentToken.split('.')[1]));
      if (payload.role === 'admin') {
        return children;
      }
    } catch (error) {
      // Token validation error
    }
  }
  
  // If not admin, redirect to admin login
  return <Navigate to="/admin/login" />;
};

export default AdminRoute;
