import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { role, loading, isAuthenticated } = useContext(AuthContext);
  
  console.log('AdminRoute: Admin-specific route protection', { role, loading, isAuthenticated });
  
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
          console.log('AdminRoute: Cleared session flags for admin');
        }
      } catch (error) {
        console.log('AdminRoute: Token parsing error');
      }
    }
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  // For admin users, allow access if authenticated or if token exists with admin role
  if (role === 'admin' && isAuthenticated) {
    console.log('AdminRoute: Admin access granted - authenticated admin');
    return children;
  }
  
  // Check token directly if role not set yet but loading is false
  const currentToken = sessionStorage.getItem('token');
  if (currentToken && !loading) {
    try {
      const payload = JSON.parse(atob(currentToken.split('.')[1]));
      if (payload.role === 'admin') {
        console.log('AdminRoute: Admin access granted - valid admin token');
        return children;
      }
    } catch (error) {
      console.log('AdminRoute: Token validation error');
    }
  }
  
  // If not admin, redirect to admin login
  console.log('AdminRoute: Non-admin user, redirecting to admin login');
  return <Navigate to="/admin/login" />;
};

export default AdminRoute;
