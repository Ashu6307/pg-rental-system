import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { role, loading, isAuthenticated } = useContext(AuthContext);
  console.log('ProtectedRoute: Current role:', role, 'Loading:', loading, 'Authenticated:', isAuthenticated, 'AllowedRoles:', allowedRoles);
  
  if (loading) return <div>Loading...</div>;
  
  // Admin gets special treatment - always allow access if role is admin
  if (role === 'admin' && allowedRoles && allowedRoles.includes('admin')) {
    console.log('ProtectedRoute: Admin access granted - bypassing all session checks');
    return children;
  }
  
  if (!isAuthenticated || !role || (allowedRoles && !allowedRoles.includes(role))) {
    console.log('ProtectedRoute: Access denied, redirecting to login');
    // Redirect to appropriate login page based on allowed roles
    if (allowedRoles && allowedRoles.includes('user')) {
      return <Navigate to="/user/login" />;
    } else if (allowedRoles && allowedRoles.includes('owner')) {
      return <Navigate to="/owner/login" />;
    } else if (allowedRoles && allowedRoles.includes('admin')) {
      return <Navigate to="/admin/login" />;
    }
    return <Navigate to="/user/login" />; // Default to user login
  }
  console.log('ProtectedRoute: Access granted');
  return children;
};

export default ProtectedRoute;
