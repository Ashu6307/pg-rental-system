import React from 'react';
import { ForgotPasswordForm } from './AuthForm.jsx';

const ForgotPassword = ({ role = 'user' }) => {
  // For admin, render only the form (no Navbar/Footer)
  return <ForgotPasswordForm role={role} />;
};

export default ForgotPassword;
