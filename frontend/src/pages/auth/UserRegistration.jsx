import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AuthForm from './AuthForm';

const UserRegistration = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleAuthSuccess = (data, formData) => {
    toast.success('Account created successfully! Please login.');
    setTimeout(() => {
      navigate('/user/login');
    }, 2000);
  };
  
  return (
    <AuthForm 
      mode="register" 
      role="user" 
      loading={loading} 
      setLoading={setLoading}
      onAuthSuccess={handleAuthSuccess}
    />
  );
};

export default UserRegistration;
