import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AuthForm from './AuthForm.jsx';

const OwnerRegistration = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleAuthSuccess = (data, formData) => {
    toast.success('Account created successfully! Please login.');
    setTimeout(() => {
      navigate('/owner/login');
    }, 2000);
  };
  
  return (
    <AuthForm 
      mode="register" 
      role="owner" 
      loading={loading} 
      setLoading={setLoading}
      onAuthSuccess={handleAuthSuccess}
    />
  );
};

export default OwnerRegistration;
