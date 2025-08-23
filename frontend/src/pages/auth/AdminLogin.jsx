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
      console.log('AdminLogin - Auth Success Data:', data); // Debug log
      console.log('AdminLogin - Form Data:', formData); // Debug log
      
      if (data.token && data.user) {
        console.log('AdminLogin - Calling AuthContext login with token and user'); // Debug log
        
        // Use AuthContext login with token and user data
        const loginResult = await login(data.token, data.user);
        console.log('AdminLogin - Login result:', loginResult); // Debug log
        
        // Force update activity timestamp for immediate session validation
        sessionStorage.setItem('auth_last_activity', Date.now().toString());
        localStorage.removeItem('auth_session_expired'); // Clear any expired flags
        console.log('AdminLogin - Activity timestamp set:', Date.now()); // Debug log
        
        toast.success('Admin login successful! Welcome back.');
        console.log('AdminLogin - Navigating to /admin immediately'); // Debug log
        
        // Navigate immediately instead of setTimeout
        navigate('/admin', { replace: true });
      } else {
        console.error('AdminLogin - Invalid response data:', data); // Debug log
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
