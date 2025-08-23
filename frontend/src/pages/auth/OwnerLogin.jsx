import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import AuthForm from './AuthForm.jsx';

const OwnerLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  const handleAuthSuccess = async (data, formData) => {
    try {
      if (data.token && data.user) {
        // Use AuthContext login with token and user data
        await login(data.token, data.user);
        toast.success('Login successful! Welcome back.');
        navigate('/owner');
      } else {
        toast.error('Invalid response data');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    }
  };
  
  return (
    <AuthForm 
      mode="login" 
      role="owner" 
      loading={loading} 
      setLoading={setLoading}
      onAuthSuccess={handleAuthSuccess}
    />
  );
};

export default OwnerLogin;
