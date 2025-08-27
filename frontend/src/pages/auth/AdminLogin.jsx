import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import authService from '../../services/authService';
import { FaUserShield, FaEnvelope, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationCircle, FaLock, FaHome } from 'react-icons/fa';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);
  
  // Email suggestions
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // OTP Timer countdown
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(timer => {
          if (timer <= 1) {
            setCanResend(true);
            return 0;
          }
          return timer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Email domain suggestions
  const generateEmailSuggestions = (email) => {
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'rediffmail.com'];
    const emailParts = email.split('@');
    
    if (emailParts.length === 2 && emailParts[1].length > 0) {
      const domain = emailParts[1].toLowerCase();
      const suggestions = commonDomains
        .filter(d => d.startsWith(domain) && d !== domain)
        .slice(0, 3)
        .map(d => `${emailParts[0]}@${d}`);
      
      setEmailSuggestions(suggestions);
      setShowEmailSuggestions(suggestions.length > 0);
    } else {
      setShowEmailSuggestions(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'email') {
      generateEmailSuggestions(value);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);
    setOtpError('');
    
    try {
      // Send OTP for admin login
      const result = await authService.sendOtp(formData.email, 'admin');
      
      if (result.success) {
        setOtpSent(true);
        setCanResend(false);
        setResendTimer(60);
        toast.success('Admin OTP sent to your email!');
      }
    } catch (error) {
      setOtpError(error.message || 'Failed to send OTP');
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setOtpError('Please enter valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setOtpError('');
    
    try {
      // Verify OTP and complete login
      const loginResult = await authService.login({
        email: formData.email,
        password: formData.password,
        otp: otp,
        userType: 'admin'
      });
      
      if (loginResult.token && loginResult.user) {
        await login(loginResult.token, loginResult.user);
        
        // Enhanced session management
        sessionStorage.setItem('auth_last_activity', Date.now().toString());
        sessionStorage.setItem('admin_login_time', Date.now().toString());
        localStorage.removeItem('auth_session_expired');
        
        setOtpSuccess('Login successful!');
        toast.success('🎉 Admin login successful! Welcome back.', {
          duration: 3000,
          icon: '👑'
        });
        
        navigate('/admin', { replace: true });
      }
    } catch (error) {
      setOtpError(error.message || 'Failed to verify OTP');
      toast.error(error.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    
    setLoading(true);
    try {
      await authService.sendOtp(formData.email, 'admin');
      setCanResend(false);
      setResendTimer(60);
      toast.success('Admin OTP resent successfully!');
    } catch (error) {
      toast.error('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-8 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 via-white to-red-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="bg-red-100 p-4 rounded-full">
              <FaUserShield className="h-12 w-12 text-red-600" />
            </div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Admin Secure Login
            </h2>
            <p className="text-center text-sm text-gray-600">
              Two-factor authentication required
            </p>
          </div>
        </div>

        <div className="mt-6 p-6 rounded-[2rem] border-2 border-gray-100 shadow-[0_8px_40px_rgba(0,0,0,0.25)] drop-shadow-2xl bg-gradient-to-br from-red-50 via-white to-red-100 transition-all duration-500 ease-in-out">
          
          {/* Step 1: Email & Password */}
          {!otpSent && (
            <div className="flex flex-col">
              {/* Step Indicator */}
              <div className="flex items-center justify-center space-x-2 mb-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <span className="ml-2 text-sm font-bold text-red-600">Credentials</span>
                </div>
                <div className="w-8 h-0.5 bg-gray-300"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-500">OTP</span>
                </div>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="space-y-5">
                  {/* Email Input */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Admin Email <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setShowEmailSuggestions(false)}
                        className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        placeholder="Enter admin email address"
                      />
                      
                      {/* Email validation icons */}
                      {formData.email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email) ? (
                        <FaExclamationCircle className="absolute right-3 top-2.5 h-5 w-5 text-red-500" />
                      ) : formData.email && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email) ? (
                        <FaCheckCircle className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
                      ) : (
                        <FaEnvelope className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                      )}
                      
                      {/* Email Suggestions Dropdown */}
                      {showEmailSuggestions && emailSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-50 mt-1">
                          {emailSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              type="button"
                              className="w-full text-left px-3 py-2 hover:bg-red-50 hover:text-red-700 text-sm border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, email: suggestion }));
                                setShowEmailSuggestions(false);
                              }}
                            >
                              <span className="flex items-center gap-2">
                                <FaEnvelope className="h-3 w-3 text-gray-400" />
                                {suggestion}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        placeholder="Enter admin password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending OTP...
                      </div>
                    ) : (
                      'Send OTP'
                    )}
                  </button>

                  {/* Forgot Password Link */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => navigate('/admin/forgot-password')}
                      className="text-sm text-red-600 hover:text-red-800 font-medium underline"
                    >
                      Forgot Admin Password?
                    </button>
                  </div>

                  {/* Back to Home Link */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => navigate('/')}
                      className="text-gray-500 hover:text-gray-700 text-sm inline-flex items-center gap-1"
                    >
                      <FaHome className="h-3 w-3" />
                      Back to Home
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {otpSent && (
            <div className="flex flex-col">
              {/* Admin OTP Step Indicator */}
              <div className="flex items-center justify-center space-x-2 mb-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">Credentials</span>
                </div>
                <div className="w-8 h-0.5 bg-red-300"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <span className="ml-2 text-sm font-bold text-red-600">OTP</span>
                </div>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-5">
                  {/* OTP Sent Success Message */}
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <FaCheckCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-red-800">
                          Admin OTP sent successfully!
                        </p>
                        <p className="text-xs text-red-600">
                          Check email <strong>{formData.email}</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* OTP Input with Individual Digits */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Enter Admin OTP</label>
                    <div className="flex justify-center space-x-2">
                      {[...Array(6)].map((_, index) => (
                        <input
                          key={index}
                          type="text"
                          maxLength="1"
                          value={otp[index] || ''}
                          onChange={(e) => {
                            const newOtp = otp.split('');
                            newOtp[index] = e.target.value;
                            setOtp(newOtp.join(''));
                            
                            // Auto-focus next input
                            if (e.target.value && index < 5) {
                              const nextInput = e.target.parentElement.children[index + 1];
                              if (nextInput) nextInput.focus();
                            }
                          }}
                          onKeyDown={(e) => {
                            // Handle backspace to go to previous input
                            if (e.key === 'Backspace' && !otp[index] && index > 0) {
                              const prevInput = e.target.parentElement.children[index - 1];
                              if (prevInput) prevInput.focus();
                            }
                          }}
                          className="w-10 h-10 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all duration-200"
                          placeholder="●"
                        />
                      ))}
                    </div>
                    
                    {/* OTP Timer and Resend */}
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-2">
                        Didn't receive the OTP?
                      </p>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={!canResend}
                        className={`text-xs font-medium underline ${
                          canResend 
                            ? 'text-red-600 hover:text-red-800' 
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {canResend ? 'Resend Admin OTP' : `Resend in ${resendTimer}s`}
                      </button>
                    </div>

                    {otpError && (
                      <div className="p-2 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-600 text-xs font-medium">{otpError}</p>
                      </div>
                    )}
                    
                    {otpSuccess && (
                      <div className="p-2 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-green-600 text-xs font-medium">{otpSuccess}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mt-8">
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Verifying...
                      </div>
                    ) : (
                      'Verify & Login'
                    )}
                  </button>

                  {/* Navigation Options */}
                  <div className="space-y-3">
                    {/* Back to Credentials */}
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setOtp('');
                          setOtpError('');
                          setOtpSuccess('');
                        }}
                        className="text-sm text-red-600 hover:text-red-800 font-medium underline"
                      >
                        ← Back to Credentials
                      </button>
                    </div>

                    {/* Back to Home */}
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="text-gray-500 hover:text-gray-700 text-sm inline-flex items-center gap-1"
                      >
                        <FaHome className="h-3 w-3" />
                        Back to Home
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
