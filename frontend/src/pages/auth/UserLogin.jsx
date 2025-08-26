import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AuthForm from './AuthForm.jsx';
import { AuthContext } from '../../context/AuthContext';

const UserLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  const handleAuthSuccess = async (data, formData) => {
    if (!data.token) {
      console.error('No token in response!', data);
      toast.error('Login failed - no token received');
      return;
    }
    
    try {
      // Use AuthContext login method (industry standard)
      const result = await login(data.token, data.user || data);
      
      // Show success message
      toast.success('Login successful!');
      
      // Navigate to dashboard using React Router (preserve session)
      setTimeout(() => {
        navigate('/user/dashboard');
      }, 100);
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed: ' + error.message);
    }
  };
  
  return (
    <AuthForm 
      mode="login" 
      role="user" 
      loading={loading} 
      setLoading={setLoading}
      onAuthSuccess={handleAuthSuccess}
    />
  );
};

export default UserLogin;
