import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaSignInAlt, FaClock, FaUser, FaUserTie } from 'react-icons/fa';

const SessionExpiredPage = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('user'); // Default to user

  // Industry Standard: Detect expired user's role for smart redirect
  useEffect(() => {
    // Check which role was logged in when session expired
    const expiredRole = localStorage.getItem('auth_expired_role') || 
                       localStorage.getItem('lastUserRole') || 
                       'user';
    
    // Admin should never reach this page - redirect immediately
    if (expiredRole === 'admin') {
      localStorage.removeItem('auth_expired_role');
      localStorage.removeItem('auth_session_expired');
      navigate('/admin');
      return;
    }
    
    setUserRole(expiredRole);
    
    // Clean up expired role data and session expired signal
    localStorage.removeItem('auth_expired_role');
    localStorage.removeItem('auth_session_expired');
  }, [navigate]);

  const handleGoHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/');
  };

  const handleGoLogin = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Smart redirect based on expired user's role
    if (userRole === 'owner') {
      navigate('/owner/login');
    } else if (userRole === 'admin') {
      navigate('/admin/login'); // Admin should not reach here, but just in case
    } else {
      navigate('/user/login'); // Default for user or unknown
    }
  };

  // Get appropriate login text and icon based on role
  const getLoginInfo = () => {
    if (userRole === 'owner') {
      return {
        text: 'Login as Owner',
        icon: <FaUserTie className="mr-2" />,
        roleText: 'Owner'
      };
    } else if (userRole === 'admin') {
      return {
        text: 'Login as Admin',
        icon: <FaUserTie className="mr-2" />,
        roleText: 'Admin'
      };
    }
    return {
      text: 'Login as User', 
      icon: <FaUser className="mr-2" />,
      roleText: 'User'
    };
  };

  const loginInfo = getLoginInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-red-200 p-8 text-center">
        {/* Warning Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <FaExclamationTriangle className="text-red-500 text-3xl" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Session Expired
        </h1>

        {/* Subtitle */}
        <div className="flex items-center justify-center mb-4 text-gray-600">
          <FaClock className="mr-2" />
          <span className="text-sm">Your session has timed out</span>
        </div>

        {/* Message */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          For your security, you have been automatically logged out due to 
          <span className="font-semibold text-red-600"> 30 minutes of inactivity</span>. 
          Please log in again to continue using our <span className="font-medium">{loginInfo.roleText}</span> services.
        </p>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-blue-800 text-sm">
            <span className="font-semibold">Security Notice:</span> This automatic logout 
            helps protect your account from unauthorized access.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Login Button - Primary (Smart redirect based on expired role) */}
          <button
            onClick={handleGoLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center shadow-sm"
          >
            {loginInfo.icon}
            {loginInfo.text}
          </button>

          {/* Home Button - Secondary */}
          <button
            onClick={handleGoHome}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center border border-gray-300"
          >
            <FaHome className="mr-2" />
            Go to Home Page
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Session timeout: 30 minutes of inactivity
          </p>
          <p className="text-xs text-gray-400 mt-1">
            PG & Bike Rental Platform Security Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredPage;
