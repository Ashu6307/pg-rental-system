import React from 'react';

// Simple Loading Spinner
export const LoadingSpinner = ({ size = 'md', color = 'blue' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    green: 'border-green-600',
    red: 'border-red-600',
    gray: 'border-gray-600'
  };

  return (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} border-2 border-t-transparent rounded-full animate-spin`}></div>
  );
};

// Button with Loading State
export const LoadingButton = ({ 
  loading = false, 
  children, 
  className = '', 
  disabled = false,
  loadingText = 'Loading...',
  ...props 
}) => {
  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={`relative flex items-center justify-center gap-2 ${className} ${
        loading || disabled ? 'opacity-75 cursor-not-allowed' : ''
      }`}
    >
      {loading && <LoadingSpinner size="sm" color="white" />}
      {loading ? loadingText : children}
    </button>
  );
};

// Full Page Loading
export const PageLoading = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <LoadingSpinner size="xl" />
      <p className="mt-4 text-gray-600 font-medium">{message}</p>
    </div>
  );
};

// Section Loading
export const SectionLoading = ({ message = 'Loading...', height = '200px' }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-sm" style={{ height }}>
      <LoadingSpinner size="lg" />
      <p className="mt-3 text-gray-600">{message}</p>
    </div>
  );
};

// Inline Loading
export const InlineLoading = ({ text = 'Loading...' }) => {
  return (
    <div className="flex items-center gap-2 text-gray-600">
      <LoadingSpinner size="sm" />
      <span>{text}</span>
    </div>
  );
};
