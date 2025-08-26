import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import AuthForm from './AuthForm.jsx';

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  const handleAuthSuccess = async (data, formData) => {
    try {
      if (data.token && data.user) {
        // Use AuthContext login with token and user data
        const loginResult = await login(data.token, data.user);
        
        // Force update activity timestamp for immediate session validation
        sessionStorage.setItem('auth_last_activity', Date.now().toString());
        localStorage.removeItem('auth_session_expired'); // Clear any expired flags
        
        toast.success('Admin login successful! Welcome back.');
        
        // Navigate immediately instead of setTimeout
        navigate('/admin', { replace: true });
      } else {
        toast.error('Invalid response data');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error('Login failed. Please try again.');
    }
  };
  
  return (
    <AuthForm 
      mode="login" 
      role="admin" 
      loading={loading} 
      setLoading={setLoading}
      onAuthSuccess={handleAuthSuccess}
    />
  );
};

export default AdminLogin;
