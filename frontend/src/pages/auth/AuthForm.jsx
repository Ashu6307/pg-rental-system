import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope, FaPhone, FaUserCircle, FaUserTie, FaUserShield } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { toast, Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import authService from '../../services/authService';

const AuthForm = ({
  mode = 'login',
  role = 'user',
  onAuthSuccess,
  loading,
  setLoading
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    ownerName: '',
    businessType: ''
  });
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false); // New state for email verification status
  const [verifiedOtp, setVerifiedOtp] = useState(""); // Store verified OTP for registration

  const isLogin = mode === 'login';

  // Debug useEffect to track showOtpModal state changes
  useEffect(() => {
    console.log('State Update - emailVerified:', emailVerified, 'verifiedOtp:', verifiedOtp);
  }, [showOtpModal, emailVerified, verifiedOtp]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
      if (
        (e.target.name === 'password' && e.target.value !== formData.confirmPassword) ||
        (e.target.name === 'confirmPassword' && formData.password !== e.target.value)
      ) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError('');
      }
    }
  };

  const validateForm = () => {
    if (mode === 'register') {
      if (role !== 'owner' && !formData.name?.trim()) {
        toast.error('Name is required');
        return false;
      }
      if (role !== 'admin' && !formData.phone?.trim()) {
        toast.error('Phone number is required');
        return false;
      }
      if (role !== 'admin' && !/^[6-9][0-9]{9}$/.test(formData.phone)) {
        toast.error('Please enter a valid 10-digit phone number starting with 6-9');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setPasswordError('Passwords do not match');
        return false;
      } else {
        setPasswordError('');
      }
      if (role === 'owner') {
        if (!formData.ownerName?.trim()) {
          toast.error('Owner name is required');
          return false;
        }
        if (!formData.businessType || !['PG', 'Bike', 'Both'].includes(formData.businessType)) {
          toast.error('Business type is required and must be PG, Bike, or Both');
          return false;
        }
      }
    }
    if (!formData.email?.trim()) {
      toast.error('Email is required');
      return false;
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!formData.password?.trim()) {
      toast.error('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Admin login requires OTP (security measure)
    if (role === 'admin' && isLogin) {
      if (!showOtp) {
        // Step 1: Send OTP to admin email
        setLoading(true);
        try {
          const data = await authService.sendOtp(formData.email, 'admin');
          
          if (data.success) {
            setShowOtp(true);
            setOtpSent(true);
            toast.success('OTP sent to your email for security verification');
          } else {
            toast.error(data.message || 'Failed to send OTP');
          }
        } catch (err) {
          console.error('Admin OTP send error:', err);
          toast.error('Network error while sending OTP');
        } finally {
          setLoading(false);
        }
        return;
      } else {
        // Step 2: Verify OTP and login
        setLoading(true);
        try {
          const data = await authService.verifyOtp(formData.email, otp, 'admin');
          
          if (data.success) {
            if (onAuthSuccess) {
              onAuthSuccess(data, formData);
            }
          } else {
            setOtpError(data.message || 'Invalid OTP');
          }
        } catch (err) {
          console.error('Admin OTP verify error:', err);
          setOtpError('Network error while verifying OTP');
        } finally {
          setLoading(false);
        }
        return;
      }
    }
    
    // Regular login/registration flow for non-admin users
    setLoading(true);
    try {
      let endpoint = '';
      if (isLogin) {
        if (role === 'user') endpoint = '/api/auth/login';
        else if (role === 'owner') endpoint = '/api/auth/owner/login';
        // Admin login is handled via OTP flow above, should not reach here
      } else {
        if (role === 'user') endpoint = '/api/auth/register';
        else endpoint = `/api/auth/${role}/register`;
      }
      
      let payload = { ...formData };
      if (isLogin) {
        if (role === 'user') {
          payload = { email: formData.email, password: formData.password, userType: role };
        } else if (role === 'owner') {
          payload = { email: formData.email, password: formData.password, userType: 'owner' };
        }
        // Admin login should not reach here due to OTP flow
      } else {
        // Registration payload logic (unchanged)
        if (role === 'user') {
          payload = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            role: 'user',
            otp: verifiedOtp
          };
        } else if (role === 'owner') {
          payload = {
            ownerName: formData.ownerName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            role: 'owner',
            businessType: formData.businessType,
            otp: verifiedOtp
          };
        }
      }
      
      console.log('Auth payload:', payload);
      console.log('Endpoint:', endpoint);
      
      const data = isLogin 
        ? await authService.login(payload)
        : await authService.register(payload);
      
      console.log('Auth response:', data);
      
      // Handle admin login requiring OTP
      if (role === 'admin' && isLogin && data.requiresOTP) {
        // Backend returned that OTP is required
        const otpData = await authService.sendOtp(formData.email, 'admin');
        if (otpData.success) {
          setShowOtp(true);
          setOtpSent(true);
          toast.success('OTP sent to your email for security');
        } else {
          toast.error(otpData.message || 'Failed to send OTP');
        }
        return;
      }
      
      if (data.success || data.token || data.user) {
        if (isLogin) {
          toast.success('Login successful!');
        } else {
          toast.success(data.message || 'Registration successful!');
        }
        if (onAuthSuccess) {
          onAuthSuccess(data, formData);
        } else {
          // Fallback redirect logic (unchanged)
          if (isLogin && data.token) {
            localStorage.setItem('token', data.token);
            if (data.user) {
              localStorage.setItem('user', JSON.stringify(data.user));
            }
            if (role === 'owner') {
              window.location.href = '/owner';
            } else if (role === 'admin') {
              window.location.href = '/admin';
            } else {
              window.location.href = '/user/home';
            }
          }
        }
      } else {
        console.log('Auth error:', data);
        toast.error(data.message || data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Auth error:', error);
      
      // For admin login, if password-only login fails, try OTP flow
      if (role === 'admin' && isLogin && !showOtp) {
        try {
          toast.info('Admin login requires OTP verification');
          const otpData = await authService.sendOtp(formData.email, 'admin');
          if (otpData.success) {
            setShowOtp(true);
            setOtpSent(true);
            toast.success('OTP sent to your email');
          } else {
            toast.error('Failed to send OTP');
          }
        } catch (otpError) {
          toast.error('Authentication failed');
        }
      } else {
        toast.error('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getTogglePath = () => {
    if (isLogin) {
      if (role === 'user') return '/user/register';
      if (role === 'owner') return '/owner/register';
      if (role === 'admin') return '/admin/register';
    } else {
      if (role === 'user') return '/user/login';
      if (role === 'owner') return '/owner/login';
      if (role === 'admin') return '/admin/login';
    }
    return '/user/login';
  };
  const getForgotPath = () => {
    if (role === 'user') return '/forgot-password';
    if (role === 'owner') return '/owner/forgot-password';
    if (role === 'admin') return '/admin/forgot-password';
    return '/forgot-password';
  };
  const getHomePath = () => '/';

  let IconComponent = FaUserCircle;
  let iconColor = 'text-blue-600';
  let bgColor = 'bg-blue-50';
  if (role === 'admin') {
    IconComponent = FaUserShield;
    iconColor = 'text-red-600';
    bgColor = 'bg-red-50';
  } else if (role === 'owner') {
    IconComponent = FaUserTie;
    iconColor = 'text-green-600';
    bgColor = 'bg-green-50';
  }

  // Move isFormReadyForSubmit inside AuthForm component so it can access role, isLogin, formData, showOtp, otp, otpError
  const isFormReadyForSubmit = () => {
    if (role === 'admin' && isLogin) {
      if (!showOtp) {
        // First step: Email and password needed to send OTP
        return (
          formData.email &&
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email) &&
          formData.password
        );
      } else {
        // Second step: OTP required to login
        return (
          formData.email &&
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email) &&
          formData.password &&
          otp &&
          otp.length >= 4 &&
          !otpError
        );
      }
    }
    if (!isLogin) {
      // For registration, require all fields and email verified
      if (role === 'owner') {
        return (
          formData.ownerName?.trim() &&
          formData.email &&
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email) &&
          formData.phone &&
          /^[6-9][0-9]{9}$/.test(formData.phone) &&
          formData.password &&
          formData.confirmPassword &&
          formData.password === formData.confirmPassword &&
          formData.businessType &&
          emailVerified
        );
      } else {
        return (
          formData.name?.trim() &&
          formData.email &&
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email) &&
          formData.phone &&
          /^[6-9][0-9]{9}$/.test(formData.phone) &&
          formData.password &&
          formData.confirmPassword &&
          formData.password === formData.confirmPassword &&
          (role === 'admin' || emailVerified) // Admin doesn't need email verification for registration
        );
      }
    }
    // For normal login
    return (
      formData.email &&
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email) &&
      formData.password
    );
  };

  // Google Auth handler
  const handleGoogleAuth = async () => {
    try {
      // Use Google Identity Services (GIS) or window.open for OAuth popup
      // For demo, redirect to backend endpoint
      window.location.href = `/api/googleAuth/google?role=${role}`;
    } catch (err) {
      toast.error('Google authentication failed.');
    }
  };

  return (
    <>
      {/* OTP Verification Modal - Moved to top (Not for Admin) */}
      {showOtpModal && role !== 'admin' && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          style={{
            zIndex: 9999,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '24px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Email Verification</h3>
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setOtpError("");
                  setOtpSuccess("");
                  setOtp("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            {!otpSent ? (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  We'll send a verification code to <strong>{formData.email}</strong>
                </p>
                <button
                  onClick={async () => {
                    setOtpLoading(true);
                    try {
                      await sendOtpApi(formData.email, role); // Pass role parameter
                      setOtpSent(true);
                      setEmailForOtp(formData.email);
                      setOtpSuccess("OTP sent successfully!");
                      toast.success("OTP sent to your email!");
                    } catch (error) {
                      setOtpError(error.message || "Failed to send OTP");
                      toast.error(error.message || "Failed to send OTP");
                    } finally {
                      setOtpLoading(false);
                    }
                  }}
                  disabled={otpLoading}
                  className={`w-full py-2 px-4 rounded font-semibold text-white ${
                    role === 'admin' ? 'bg-red-600 hover:bg-red-700' : 
                    role === 'owner' ? 'bg-green-600 hover:bg-green-700' : 
                    'bg-blue-600 hover:bg-blue-700'
                  } disabled:opacity-50`}
                >
                  {otpLoading ? "Sending..." : "Send OTP"}
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Enter the 6-digit code sent to <strong>{emailForOtp}</strong>
                </p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  maxLength="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 text-center text-lg tracking-wider"
                />
                
                {otpError && (
                  <p className="text-red-500 text-sm mb-3">{otpError}</p>
                )}
                {otpSuccess && (
                  <p className="text-green-500 text-sm mb-3">{otpSuccess}</p>
                )}
                
                <div className="flex space-x-3">
                  <button
                    onClick={async () => {
                      setOtpLoading(true);
                      setOtpError("");
                      try {
                        await verifyOtpApi(emailForOtp, otp);
                        setOtpSuccess("Email verified successfully!");
                        setEmailVerified(true); // Set email as verified
                        setVerifiedOtp(otp); // Store verified OTP for registration
                        toast.success("Email verified successfully!");
                        setTimeout(() => {
                          setShowOtpModal(false);
                          setOtpSent(false);
                          setOtp("");
                        }, 1500);
                      } catch (error) {
                        setOtpError(error.message || "Invalid OTP");
                        toast.error(error.message || "Invalid OTP");
                      } finally {
                        setOtpLoading(false);
                      }
                    }}
                    disabled={otpLoading || otp.length !== 6}
                    className={`flex-1 py-2 px-4 rounded font-semibold text-white ${
                      role === 'admin' ? 'bg-red-600 hover:bg-red-700' : 
                      role === 'owner' ? 'bg-green-600 hover:bg-green-700' : 
                      'bg-blue-600 hover:bg-blue-700'
                    } disabled:opacity-50`}
                  >
                    {otpLoading ? "Verifying..." : "Verify"}
                  </button>
                  
                  <button
                    onClick={async () => {
                      setResendLoading(true);
                      setOtpError("");
                      try {
                        await resendOtpApi(emailForOtp, role); // Pass role parameter
                        setOtpSuccess("OTP resent successfully!");
                        toast.success("OTP resent to your email!");
                      } catch (error) {
                        setOtpError(error.message || "Failed to resend OTP");
                        toast.error(error.message || "Failed to resend OTP");
                      } finally {
                        setResendLoading(false);
                      }
                    }}
                    disabled={resendLoading}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded font-semibold hover:bg-gray-50 disabled:opacity-50"
                  >
                    {resendLoading ? "Resending..." : "Resend"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    <div className={`min-h-screen flex flex-col justify-start sm:px-2 lg:px-4 ${bgColor}`}> {/* BG color by role */}
      <div className={`sm:mx-auto sm:w-full ${role === 'owner' && !isLogin ? 'sm:max-w-3xl' : 'sm:max-w-md'} mb-16 mt-4`}>
        <div className="flex justify-center">
          <div className="flex flex-col items-center space-y-2 w-full">
            <span className="relative group">
              <IconComponent
                className={`h-16 w-16 ${iconColor} drop-shadow-lg`}
                title={
                  role === 'admin'
                    ? 'Admin Login/Register'
                    : role === 'owner'
                    ? 'Owner Login/Register'
                    : 'User Login/Register'
                }
              />
              <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-2 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {role === 'admin'
                  ? 'Admin Panel Access'
                  : role === 'owner'
                  ? 'Owner Dashboard Access'
                  : 'User Account Access'}
              </span>
            </span>
            <div className="text-base font-semibold text-gray-700 mt-1">
              {role === 'admin'
                ? 'Admin'
                : role === 'owner'
                ? 'Owner'
                : 'User'}
            </div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              {role.charAt(0).toUpperCase() + role.slice(1)} {isLogin ? 'Login' : 'Registration'}
            </h2>
          </div>
        </div>
        <p className="text-center text-sm text-gray-600 mb-6">
          {isLogin ? 'Login your account' : 'Create your account to get started'}
        </p>
        <div>
          <div
            className={
              `p-8 rounded-[2rem] border-2 border-gray-100 shadow-[0_8px_40px_rgba(0,0,0,0.25)] drop-shadow-2xl ` +
              (role === 'admin'
                ? 'bg-gradient-to-br from-red-50 via-white to-red-100'
                : role === 'owner'
                ? 'bg-gradient-to-br from-green-50 via-white to-green-100'
                : 'bg-gradient-to-br from-blue-50 via-white to-blue-100')
            }
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Google login/register button at top with Google icon */}
              {!(role === 'admin' && isLogin) && (
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 mb-4 rounded bg-white text-gray-900 font-semibold shadow border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={handleGoogleAuth}
                >
                  <span className="text-xl"><FcGoogle /></span>
                  {isLogin ? 'Login with Google' : 'Sign up with Google'}
                </button>
              )}
              {/* Registration fields for user/owner/admin */}
              {!isLogin && (
                <>
                  {role === 'user' && (
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
                      <div className="mt-1 relative">
                        <input
                          id="name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          required={!isLogin}
                          value={formData.name}
                          onChange={handleChange}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Enter your full name"
                        />
                        <FaUser className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  )}
                  {/* Owner-specific fields */}
                  {role === 'owner' && (
                    <div>
                      <div className="text-lg font-semibold text-green-700 mb-2">Owner Details</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">Owner Name <span className="text-red-500">*</span></label>
                          <input
                            id="ownerName"
                            name="ownerName"
                            type="text"
                            required
                            value={formData.ownerName}
                            onChange={handleChange}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            placeholder="Enter owner name"
                          />
                        </div>
                        <div>
                          <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">Business Type <span className="text-red-500">*</span></label>
                          <select
                            id="businessType"
                            name="businessType"
                            required
                            value={formData.businessType}
                            onChange={handleChange}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          >
                            <option value="">Select</option>
                            <option value="PG">PG</option>
                            <option value="Bike">Bike</option>
                            <option value="Both">Both</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              {/* Common fields for login/register */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
                <div className="mt-1 flex items-center gap-2 relative">
                  <div className="relative w-full">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      readOnly={emailVerified} // Make email field read-only after verification
                      className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md placeholder-gray-400 focus:outline-none sm:text-sm ${
                        emailVerified 
                          ? 'border-green-500 bg-green-50 text-green-800 cursor-not-allowed' 
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="Enter your email address"
                    />
                    {emailVerified ? (
                      <svg className="absolute right-3 top-2.5 h-5 w-5 text-green-500 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <FaEnvelope className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                    )}
                  </div>
                  {/* Verify Email Button for registration only (not for admin) */}
                  {(!isLogin && role !== 'admin') && (
                    <button
                      type="button"
                      className={`px-3 py-1 text-xs rounded font-semibold transition-colors duration-150 focus:outline-none ${formData.email && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email) ? (role === 'admin' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-blue-500 text-white hover:bg-blue-600') : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                      disabled={!(formData.email && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email))}
                      onClick={() => {
                        setShowOtpModal(true);
                      }}
                    >
                      Verify Email
                    </button>
                  )}
                </div>
              </div>
              {!isLogin && (
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                  <div className="mt-1 relative">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required={!isLogin}
                      value={formData.phone}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter your phone number"
                    />
                    <FaPhone className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              )}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password <span className="text-red-500">*</span></label>
                  <div className="mt-1 relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required={!isLogin}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="h-5 w-5 text-gray-400" />
                      ) : (
                        <FaEye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                  )}
                </div>
              )}
              <div>
              
                <button
                  type="submit"
                  disabled={loading || !isFormReadyForSubmit()}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${role === 'owner' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : role === 'admin' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    role === 'admin' && isLogin ? (
                      showOtp ? 'Verify OTP & Login' : 'Send OTP'
                    ) : (
                      isLogin ? 'Login' : 'Create Account'
                    )
                  )}
                </button>
              </div>
              {role === 'admin' && isLogin && showOtp && (
                <div className="mb-4">
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Enter OTP</label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    placeholder="Enter OTP sent to your email"
                  />
                  {otpError && <p className="text-red-500 text-xs mt-1">{otpError}</p>}
                </div>
              )}
            </form>
            {/* Toggle login/register */}
            {role !== 'admin' && (
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                  <Link
                    to={getTogglePath()}
                    className={`${role === 'owner' ? 'text-green-600 hover:text-green-800' : 'text-blue-600 hover:text-blue-800'} font-medium`}
                  >
                    {isLogin
                      ? `${role.charAt(0).toUpperCase() + role.slice(1)} Register`
                      : 'Login here'}
                  </Link>
                </p>
              </div>
            )}
            {/* Forgot password link (only for login) */}
            {isLogin && (
              <div className="mt-4 text-center">
                {role === 'user' && (
                  <a
                    href="/forgot-password"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Forgot your password?
                  </a>
                )}
                {role === 'owner' && (
                  <a
                    href="/owner/forgot-password"
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    Forgot your password?
                  </a>
                )}
                {role === 'admin' && (
                  <a
                    href="/admin/forgot-password"
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Forgot your password?
                  </a>
                )}
              </div>
            )}
            {/* Back to home link */}
            <div className="mt-4 text-center">
              <a
                href={getHomePath()}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
    </>
  );
};

// Reusable ForgotPasswordForm component styled same as login form
export const ForgotPasswordForm = ({ role = 'user' }) => {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, role })
      });
      const data = await res.json();
      if (data.success) {
        setOtpVerified(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword, role })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setTimeout(() => {
          window.location.href = '/login'; // Redirect to login after success
        }, 2000);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper for role-based color and icon
  const roleColor = role === 'admin' ? 'red' : role === 'owner' ? 'green' : 'blue';
  const colorClass = {
    red: 'text-red-700 bg-red-700 hover:bg-red-900 focus:ring-red-500',
    green: 'text-green-700 bg-green-700 hover:bg-green-900 focus:ring-green-500',
    blue: 'text-blue-700 bg-blue-700 hover:bg-blue-900 focus:ring-blue-500',
  }[roleColor];
  const IconComponent = role === 'admin' ? FaUserShield : role === 'owner' ? FaUserTie : FaUserCircle;
  const iconColor = role === 'admin' ? 'text-red-600' : role === 'owner' ? 'text-green-600' : 'text-blue-600';
  const bgColor = role === 'admin' ? 'bg-gradient-to-br from-red-50 via-white to-red-100' : role === 'owner' ? 'bg-gradient-to-br from-green-50 via-white to-green-100' : 'bg-gradient-to-br from-blue-50 via-white to-blue-100';

  return (
    <div className={`min-h-screen flex flex-col justify-start sm:px-2 lg:px-4 ${bgColor}`}>
      <div className={`sm:mx-auto sm:w-full sm:max-w-md mb-16 mt-4`}>
        <div className="flex justify-center">
          <div className="flex flex-col items-center space-y-2 w-full">
            <span className="relative group">
              <IconComponent className={`h-16 w-16 ${iconColor} drop-shadow-lg`} />
            </span>
            <div className="text-base font-semibold text-gray-700 mt-1">
              {role === 'admin' ? 'Admin' : role === 'owner' ? 'Owner' : 'User'}
            </div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              {role.charAt(0).toUpperCase() + role.slice(1)} Forgot Password
            </h2>
          </div>
        </div>
        <p className="text-center text-sm text-gray-600 mb-6">
          Enter your registered email to reset your password
        </p>
        <div>
          <div className={`p-8 rounded-[2rem] border-2 border-gray-100 shadow-[0_8px_40px_rgba(0,0,0,0.25)] drop-shadow-2xl ${bgColor}`}>
            <form className="space-y-6">
              {!otpSent && (
                <>
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <div className="mt-1 relative">
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email address"
                      required
                    />
                    <FaEnvelope className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                  <button
                    type="button"
                    disabled={loading || !email}
                    className={`w-full py-2 px-4 rounded font-semibold text-white ${colorClass} disabled:opacity-50 mt-2`}
                    onClick={handleSendOtp}
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </>
              )}
              {otpSent && !otpVerified && (
                <>
                  <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                  <div className="mt-1 relative">
                    <input
                      type="text"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter OTP"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    disabled={loading || !otp}
                    className={`w-full py-2 px-4 rounded font-semibold text-white ${colorClass} disabled:opacity-50 mt-2`}
                    onClick={handleVerifyOtp}
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </>
              )}
              {otpVerified && (
                <>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <div className="mt-1 relative">
                    <input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    disabled={loading || !newPassword}
                    className={`w-full py-2 px-4 rounded font-semibold text-white ${colorClass} disabled:opacity-50 mt-2`}
                    onClick={handleResetPassword}
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </>
              )}
            </form>
            <div className="mt-6 text-center">
              <span className="text-sm text-gray-500">Remembered your password?</span>
              <a
                href={role === 'admin' ? '/admin/login' : role === 'owner' ? '/owner/login' : '/user/login'}
                className={
                  role === 'admin'
                    ? 'text-red-600 hover:text-red-800 text-sm font-medium'
                    : role === 'owner'
                    ? 'text-green-600 hover:text-green-800 text-sm font-medium'
                    : 'text-blue-600 hover:text-blue-800 text-sm font-medium'
                }
              >
                Go to Login
              </a>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default AuthForm;

// Helper API functions (Not for Admin - Admin uses separate OTP system)
async function sendOtpApi(email, role = 'user') {
  if (role === 'admin') {
    throw new Error('Admin should use dedicated OTP system');
  }
  const response = await fetch('http://localhost:5000/api/otp/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, role })
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data;
}

async function verifyOtpApi(email, otp) {
  // This function should not be used for admin
  const response = await fetch('http://localhost:5000/api/otp/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data;
}

async function resendOtpApi(email, role = 'user') {
  if (role === 'admin') {
    throw new Error('Admin should use dedicated OTP system');
  }
  const response = await fetch('http://localhost:5000/api/otp/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, role })
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data;
}
