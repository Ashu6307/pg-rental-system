import React, { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const GoogleCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const handleGoogleCallback = () => {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get('token');
      const userParam = urlParams.get('user');
      const error = urlParams.get('error');

      if (error) {
        let errorMessage = 'Google authentication failed';
        switch (error) {
          case 'google_email_not_found':
            errorMessage = 'Google email not found. Please try again.';
            break;
          case 'google_auth_failed':
            errorMessage = 'Google authentication failed. Please try again.';
            break;
          default:
            errorMessage = 'Authentication error occurred.';
        }
        toast.error(errorMessage);
        navigate('/user/login');
        return;
      }

      if (token && userParam) {
        try {
          const user = JSON.parse(decodeURIComponent(userParam));
          
          // Store token and user data
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          // Update auth context
          login(user, token);
          
          // Success message
          toast.success(`Welcome ${user.name}! You've been logged in successfully.`);
          
          // Redirect based on user role
          if (user.role === 'owner') {
            navigate('/owner');
          } else if (user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/user/home');
          }
        } catch (err) {
          console.error('Error parsing user data:', err);
          toast.error('Authentication data error. Please try again.');
          navigate('/user/login');
        }
      } else {
        toast.error('Authentication failed. Missing credentials.');
        navigate('/user/login');
      }
    };

    handleGoogleCallback();
  }, [location, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Completing Google Authentication...
        </h2>
        <p className="text-gray-600">
          Please wait while we verify your Google account and log you in.
        </p>
      </div>
    </div>
  );
};

export default GoogleCallback;
