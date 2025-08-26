import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, role } = useContext(AuthContext);

  // If user is authenticated, redirect to their respective dashboard
  if (isAuthenticated) {
    switch (role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'owner':
        return <Navigate to="/owner" replace />;
      case 'user':
        return <Navigate to="/user/home" replace />;
      default:
        // Fallback for unknown roles
        return <Navigate to="/user/login" replace />;
    }
  }

  // If not authenticated, allow access to public routes
  return children;
};

export default PublicRoute;
