import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope, FaPhone, FaUserCircle, FaUserTie, FaUserShield, FaCheckCircle, FaExclamationCircle, FaHome, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { toast, Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import authService from '../../services/authService';
import MobileValidationInput from '../../components/validation/MobileValidationInput';
import EmailValidationInput from '../../components/validation/EmailValidationInput';
import { handleNameChange, isValidName, getNameValidationError, formatName } from '../../utils/validation/nameValidation';
import NameValidationInput from '../../components/validation/NameValidationInput';
import { isValidEmail } from '../../utils/validation/emailValidation';
import { isValidIndianMobile } from '../../utils/validation/mobileValidation';
import { isValidOtp, isOtpExpired, getOtpValidationError, getOtpTimeRemaining, formatOtpTime } from '../../utils/validation/otpValidation';
import OtpInput from '../../components/validation/OtpInput';



const AuthForm = ({
  mode = 'login',
  role = 'user',
  onAuthSuccess,
  loading,
  setLoading
}) => {
  const [showPassword, setShowPassword] = useState(false);
  // Phone validation error state for MobileValidationInput
  const [phoneError, setPhoneError] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, message: '', color: '' });
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
  const [rememberMe, setRememberMe] = useState(false); // Remember me checkbox
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']); // Individual OTP digits
  const [otpTimer, setOtpTimer] = useState(0); // OTP resend timer
  const [canResendOtp, setCanResendOtp] = useState(true); // Can resend OTP flag
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false); // Email domain suggestions
  const [emailSuggestions, setEmailSuggestions] = useState([]); // Email suggestions array
  const [acceptTerms, setAcceptTerms] = useState(false); // Terms and Privacy Policy acceptance
  const [nameError, setNameError] = useState(''); // Name validation error
  const [ownerNameError, setOwnerNameError] = useState(''); // Owner name validation error
  const [emailError, setEmailError] = useState(''); // Email validation error

  const isLogin = mode === 'login';

    // Scroll lock only for login page
    useEffect(() => {
      if (isLogin) {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
      } else {
        document.body.style.overflow = '';
      }
    }, [isLogin]);

  // Load remembered email on component mount
  useEffect(() => {
    if (isLogin) {
      const rememberedEmail = localStorage.getItem(`rememberedEmail_${role}`);
      if (rememberedEmail) {
        setFormData(prev => ({ ...prev, email: rememberedEmail }));
        setRememberMe(true);
      }
    }
  }, [isLogin, role]);

  // Reset terms acceptance when switching between login/register or roles
  useEffect(() => {
    setAcceptTerms(false);
  }, [mode, role]);

  // OTP Timer countdown
  useEffect(() => {
    let interval = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(timer => {
          if (timer <= 1) {
            setCanResendOtp(true);
            return 0;
          }
          return timer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Start OTP timer
  const startOtpTimer = () => {
    setOtpTimer(60); // 60 seconds countdown
    setCanResendOtp(false);
  };

  // Email domain suggestion logic
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

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let score = 0;
    let message = '';
    let color = '';
    let requirements = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };
    
    if (!password) {
      return { score: 0, message: '', color: '', requirements };
    }
    
    // Calculate score based on requirements
    if (requirements.length) score += 1;
    if (password.length >= 12) score += 1;
    if (requirements.lowercase) score += 1;
    if (requirements.uppercase) score += 1;
    if (requirements.number) score += 1;
    if (requirements.special) score += 1;
    
    // Set message and color based on score
    if (score <= 2) {
      message = 'Weak';
      color = 'text-red-500';
    } else if (score <= 4) {
      message = 'Medium';
      color = 'text-yellow-500';
    } else if (score <= 5) {
      message = 'Strong';
      color = 'text-green-500';
    } else {
      message = 'Very Strong';
      color = 'text-green-600';
    }
    
    return { score, message, color, requirements };
  };

  // Generate strong password suggestion
  const generateStrongPassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';
    
    let password = '';
    // Ensure at least one of each type
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest randomly
    const allChars = lowercase + uppercase + numbers + symbols;
    for (let i = 4; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  };

  // Phone number formatter (only digits, no dashes)
  const formatPhoneNumber = (value) => {
    // Remove all non-digits and limit to 10
    const cleaned = value.replace(/\D/g, '');
    return cleaned.slice(0, 10);
  };

  // OTP input handler with auto-tab
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);
    
    // Update combined OTP
    const combinedOtp = newOtpDigits.join('');
    setOtp(combinedOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle backspace in OTP inputs
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Handle paste in OTP inputs
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const digits = paste.replace(/\D/g, '').slice(0, 6).split('');
    
    if (digits.length > 0) {
      const newOtpDigits = [...otpDigits];
      digits.forEach((digit, index) => {
        if (index < 6) {
          newOtpDigits[index] = digit;
        }
      });
      setOtpDigits(newOtpDigits);
      setOtp(newOtpDigits.join(''));
      
      // Focus the next empty input or last input
      const nextEmptyIndex = newOtpDigits.findIndex((digit, index) => !digit && index < 6);
      const targetIndex = nextEmptyIndex === -1 ? Math.min(digits.length - 1, 5) : nextEmptyIndex;
      const targetInput = document.getElementById(`otp-${targetIndex}`);
      if (targetInput) targetInput.focus();
    }
  };

  const handleChange = (e) => {
    let value = e.target.value;
    
    // Special handling for phone number
    if (e.target.name === 'phone') {
      value = formatPhoneNumber(value);
    }
    
    // Email domain suggestions
    if (e.target.name === 'email') {
      generateEmailSuggestions(value);
      // Reset email verification status when email changes
      if (value !== formData.email && emailVerified) {
        setEmailVerified(false);
        setVerifiedOtp("");
        toast.info('Email changed. Please verify the new email address.');
      }
    }
    
    setFormData({
      ...formData,
      [e.target.name]: value
    });
    
    // Password strength check for registration
    if (e.target.name === 'password' && !isLogin) {
      const strength = checkPasswordStrength(e.target.value);
      setPasswordStrength(strength);
    }
    
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
        toast.error('📝 Full name is required', { icon: '⚠️' });
        return false;
      }
      if (role !== 'admin' && !formData.phone?.trim()) {
        toast.error('📞 Phone number is required', { icon: '⚠️' });
        return false;
      }
      if (role !== 'admin' && !isValidIndianMobile(formData.phone)) {
        toast.error('📱 Please enter a valid Indian mobile number', { 
          icon: '❌',
          duration: 4000 
        });
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
          toast.error('👤 Owner name is required', { icon: '⚠️' });
          return false;
        }
        if (!formData.businessType || !['PG', 'Bike', 'Both'].includes(formData.businessType)) {
          toast.error('🏢 Business type is required (PG, Bike, or Both)', { icon: '⚠️' });
          return false;
        }
      }
    }
    if (!formData.email?.trim()) {
      toast.error('📧 Email address is required', { icon: '⚠️' });
      return false;
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      toast.error('📧 Please enter a valid email address', { 
        icon: '❌',
        duration: 4000 
      });
      return false;
    }
    if (!formData.password?.trim()) {
      toast.error('🔐 Password is required', { icon: '⚠️' });
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('🔐 Password must be at least 6 characters long', { 
        icon: '❌',
        duration: 4000 
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
  // Admin login requires OTP (security measure)
  // if (role === 'admin' && isLogin) {
  //   if (!showOtp) {
  //     // Step 1: Send OTP to admin email
  //     setLoading(true);
  //     try {
  //       const data = await authService.sendOtp(formData.email, 'admin');
  //       
  //       if (data.success) {
  //         setShowOtp(true);
  //         setOtpSent(true);
  //         toast.success('OTP sent to your email for security verification');
  //       } else {
  //         toast.error(data.message || 'Failed to send OTP');
  //       }
  //     } catch (err) {
  //       console.error('Admin OTP send error:', err);
  //       toast.error('Network error while sending OTP');
  //     } finally {
  //       setLoading(false);
  //     }
  //     return;
  //   } else {
  //     // Step 2: Verify OTP and login
  //     setLoading(true);
  //     try {
  //       const data = await authService.verifyOtp(formData.email, otp, 'admin');
  //       
  //       if (data.success) {
  //         if (onAuthSuccess) {
  //           onAuthSuccess(data, formData);
  //         }
  //       } else {
  //         setOtpError(data.message || 'Invalid OTP');
  //       }
  //     } catch (err) {
  //       console.error('Admin OTP verify error:', err);
  //       setOtpError('Network error while verifying OTP');
  //     } finally {
  //       setLoading(false);
  //     }
  //     return;
  //   }
  // }
    
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
      
      
      const data = isLogin 
        ? await authService.login(payload)
        : await authService.register(payload);
      
  // Handle admin login requiring OTP
  // if (role === 'admin' && isLogin && data.requiresOTP) {
  //   // Backend returned that OTP is required
  //   const otpData = await authService.sendOtp(formData.email, 'admin');
  //   if (otpData.success) {
  //     setShowOtp(true);
  //     setOtpSent(true);
  //     toast.success('OTP sent to your email for security');
  //   } else {
  //     toast.error(otpData.message || 'Failed to send OTP');
  //   }
  //   return;
  // }
      
      if (data.success || data.token || data.user) {
        // Handle Remember Me functionality
        if (isLogin) {
          if (rememberMe) {
            localStorage.setItem(`rememberedEmail_${role}`, formData.email);
          } else {
            localStorage.removeItem(`rememberedEmail_${role}`);
          }
        }
        
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
              window.scrollTo({ top: 0, behavior: 'smooth' });
              window.location.href = '/owner';
            } else if (role === 'admin') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              window.location.href = '/admin';
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              window.location.href = '/user/home';
            }
          }
        }
      } else {
        toast.error(data.message || data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Auth error:', error);
      
  // For admin login, if password-only login fails, try OTP flow
  // if (role === 'admin' && isLogin && !showOtp) {
  //   try {
  //     toast.success('Admin login requires OTP verification');
  //     const otpData = await authService.sendOtp(formData.email, 'admin');
  //     if (otpData.success) {
  //       setShowOtp(true);
  //       setOtpSent(true);
  //       toast.success('OTP sent to your email');
  //     } else {
  //       toast.error('Failed to send OTP');
  //     }
  //   } catch (otpError) {
  //     toast.error('Authentication failed');
  //   }
  // } else {
  //   toast.error('Network error. Please try again.');
  // }
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
          isValidIndianMobile(formData.phone) &&
          formData.password &&
          formData.confirmPassword &&
          formData.password === formData.confirmPassword &&
          formData.businessType &&
          emailVerified &&
          acceptTerms // Terms and Privacy Policy acceptance required
        );
      } else {
        return (
          formData.name?.trim() &&
          formData.email &&
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email) &&
          formData.phone &&
          isValidIndianMobile(formData.phone) &&
          formData.password &&
          formData.confirmPassword &&
          formData.password === formData.confirmPassword &&
          (role === 'admin' || emailVerified) && // Admin doesn't need email verification for registration
          acceptTerms // Terms and Privacy Policy acceptance required
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

  // Google Auth handler - Temporarily disabled for reconstruction
  const handleGoogleAuth = async () => {
    toast.info('Google OAuth will be implemented soon!');
    setLoading(false);
    // TODO: Implement Google OAuth from scratch
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
                    setOtpError(""); // Clear previous errors
                    try {
                      await sendOtpApi(formData.email, role); // Pass role parameter
                      setOtpSent(true);
                      setEmailForOtp(formData.email);
                      setOtpSuccess("OTP sent successfully!");
                      toast.success("OTP sent to your email!");
                      // Start 60 second countdown
                      startOtpTimer();
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
                      if (canResendOtp) {
                        setResendLoading(true);
                        setOtpError("");
                        try {
                          await resendOtpApi(emailForOtp, role); // Pass role parameter
                          setOtpSuccess("OTP resent successfully!");
                          toast.success("OTP resent to your email!");
                          // Start 60 second countdown
                          startOtpTimer();
                        } catch (error) {
                          setOtpError(error.message || "Failed to resend OTP");
                          toast.error(error.message || "Failed to resend OTP");
                        } finally {
                          setResendLoading(false);
                        }
                      }
                    }}
                    disabled={resendLoading || !canResendOtp}
                    className={`px-4 py-2 border border-gray-300 rounded font-semibold hover:bg-gray-50 disabled:opacity-50 ${
                      !canResendOtp ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600'
                    }`}
                  >
                    {resendLoading ? "Resending..." : !canResendOtp ? `Resend (${otpTimer}s)` : "Resend"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

  <div className={`min-h-screen flex flex-col justify-start py-2 sm:px-2 lg:px-4 ${bgColor}`}> {/* BG color by role */}
  <div className={`sm:mx-auto sm:w-full ${role === 'owner' && !isLogin ? 'sm:max-w-3xl' : isLogin ? 'sm:max-w-md' : 'sm:max-w-xl'} mb-4 mt-1`}>
        <div className="flex justify-center">
          <div className="flex flex-col items-center space-y-1 w-full">
            <span className="relative group">
              <IconComponent
                className={`h-12 w-12 ${iconColor} drop-shadow-lg`}
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
            <h2 className="text-center text-2xl font-extrabold text-gray-900">
              {role.charAt(0).toUpperCase() + role.slice(1)} {isLogin ? 'Login' : 'Registration'}
            </h2>
          </div>
        </div>
        <p className="text-center text-sm text-gray-600 mb-2">
          {isLogin ? 'Login your account' : 'Create your account to get started'}
        </p>
        <div>
          <div
            className={
              `p-6 rounded-[2rem] border-2 border-gray-100 shadow-[0_8px_40px_rgba(0,0,0,0.25)] drop-shadow-2xl ` +
              (role === 'admin'
                ? 'bg-gradient-to-br from-red-50 via-white to-red-100'
                : role === 'owner'
                ? 'bg-gradient-to-br from-green-50 via-white to-green-100'
                : 'bg-gradient-to-br from-blue-50 via-white to-blue-100')
            }
          >
            <form className="space-y-3" onSubmit={handleSubmit}>
              {/* Google login/register button at top with Google icon */}
              {!(role === 'admin' && isLogin) && (
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 mb-2 rounded-lg bg-white text-gray-900 font-semibold shadow-md border border-gray-300 hover:bg-gray-50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  ) : (
                    <span className="text-xl"><FcGoogle /></span>
                  )}
                  {loading 
                    ? 'Connecting...' 
                    : (isLogin ? 'Login with Google' : 'Sign up with Google')
                  }
                </button>
              )}
              
              {/* Divider */}
              {!(role === 'admin' && isLogin) && (
                <div className="relative mb-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                  </div>
                </div>
              )}
              
              {/* Registration fields for user/owner/admin */}
              {!isLogin && (
                <>
                  {role === 'user' && (
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
                      <div className="mt-1">
                        <NameValidationInput
                          value={formData.name}
                          onChange={val => setFormData({ ...formData, name: val })}
                          error={nameError}
                          setError={setNameError}
                          required={!isLogin}
                          disabled={loading}
                          placeholder="Enter your full name (4-20 chars)"
                        />
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <div className="h-4"></div>
                        <div className="text-xs text-gray-500">
                          {formData.name.length}/20 characters
                        </div>
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
                          <div className="mt-1">
                            <NameValidationInput
                              value={formData.ownerName}
                              onChange={val => setFormData({ ...formData, ownerName: val })}
                              error={ownerNameError}
                              setError={setOwnerNameError}
                              required
                              disabled={loading}
                              placeholder="Enter owner name (4-20 chars)"
                            />
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <div className="h-4"></div>
                            <div className="text-xs text-gray-500">
                              {formData.ownerName.length}/20 characters
                            </div>
                          </div>
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
                <EmailValidationInput
                  value={formData.email}
                  onChange={val => setFormData({ ...formData, email: val })}
                  error={emailError}
                  setError={setEmailError}
                  suggestions={emailSuggestions}
                  setSuggestions={setEmailSuggestions}
                  required
                  readOnly={emailVerified}
                  disabled={loading}
                  className={emailVerified ? 'border-green-500 text-green-800 cursor-not-allowed' : ''}
                />
                {/* Verify Email Button for registration only (not for admin) - Right side */}
                <div className="flex justify-end mt-1">
                  {(!isLogin && role !== 'admin') && (
                    <button
                      type="button"
                      className={`px-2 py-1 text-xs rounded font-semibold transition-colors duration-150 focus:outline-none ${
                        emailVerified 
                          ? 'bg-green-500 text-white cursor-not-allowed'
                          : formData.email && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email) 
                            ? (role === 'admin' 
                              ? 'bg-red-500 text-white hover:bg-red-600' 
                              : role === 'owner' 
                              ? 'bg-green-500 text-white hover:bg-green-600' 
                              : 'bg-blue-500 text-white hover:bg-blue-600') 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={emailVerified || !(formData.email && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email))}
                      onClick={async () => {
                        if (emailVerified) return; // Prevent action if already verified
                        // First check if email already exists
                        try {
                          const response = await fetch('http://localhost:5000/api/otp/check-email', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: formData.email, role })
                          });
                          const data = await response.json();
                          if (!data.success && data.alreadyRegistered) {
                            toast.error(data.message, {
                              duration: 5000,
                              icon: '⚠️'
                            });
                            setTimeout(() => {
                              const loginPath = role === 'user' ? '/user/login' : 
                                             role === 'owner' ? '/owner/login' : 
                                             role === 'admin' ? '/admin/login' : '/user/login';
                              toast('Redirecting to login page...', {
                                icon: '🔄',
                                duration: 2000
                              });
                              setTimeout(() => {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                window.location.href = loginPath;
                              }, 1500);
                            }, 3000);
                            return;
                          }
                          // Email is available, proceed with OTP verification
                          if (data.success && !data.exists) {
                            setShowOtpModal(true);
                            startOtpTimer(); // Start the timer when OTP modal opens
                          }
                        } catch (error) {
                          console.error('Email check error:', error);
                          toast.error('Error checking email availability');
                        }
                      }}
                    >
                      {emailVerified ? (
                        <>
                          <FaCheckCircle className="inline mr-1" />
                          Verified
                        </>
                      ) : (
                        'Verify Email'
                      )}
                    </button>
                  )}
                </div>
              </div>
              {!isLogin && (
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <MobileValidationInput
                      value={formData.phone}
                      onChange={val => setFormData({ ...formData, phone: val })}
                      error={phoneError}
                      setError={setPhoneError}
                      // placeholder="Enter phone number (e.g., 9876543210)"
                      required={!isLogin}
                      disabled={loading}
                    />
                  </div>
                </div>
              )}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                  {!isLogin && (
                    <span className="text-xs text-gray-500 ml-2">
                      (Minimum 8 characters)
                    </span>
                  )}
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    minLength={isLogin ? undefined : 8}
                    className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md placeholder-gray-400 focus:outline-none sm:text-sm transition-all duration-200 ${
                      !isLogin && formData.password && formData.password.length > 0
                        ? passwordStrength.score <= 2
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : passwordStrength.score <= 4
                          ? 'border-yellow-300 focus:ring-yellow-500 focus:border-yellow-500'
                          : 'border-green-300 focus:ring-green-500 focus:border-green-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder={isLogin ? "Enter your password" : "Create a strong password"}
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
                {/* Password strength indicator for registration */}
                {!isLogin && formData.password && (
                  <div className="mt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            passwordStrength.score <= 2 ? 'bg-red-500' :
                            passwordStrength.score <= 4 ? 'bg-yellow-500' :
                            passwordStrength.score <= 5 ? 'bg-green-500' : 'bg-green-600'
                          }`}
                          style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-semibold ${passwordStrength.color}`}>
                        {passwordStrength.message}
                      </span>
                    </div>
                    
                    {/* Password Requirements Checklist */}
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-gray-700 mb-1">Password Requirements:</div>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div className={`flex items-center gap-1 ${passwordStrength.requirements?.length ? 'text-green-600' : 'text-gray-500'}`}>
                          {passwordStrength.requirements?.length ? '✓' : '○'} 8+ characters
                        </div>
                        <div className={`flex items-center gap-1 ${passwordStrength.requirements?.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                          {passwordStrength.requirements?.uppercase ? '✓' : '○'} Uppercase (A-Z)
                        </div>
                        <div className={`flex items-center gap-1 ${passwordStrength.requirements?.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                          {passwordStrength.requirements?.lowercase ? '✓' : '○'} Lowercase (a-z)
                        </div>
                        <div className={`flex items-center gap-1 ${passwordStrength.requirements?.number ? 'text-green-600' : 'text-gray-500'}`}>
                          {passwordStrength.requirements?.number ? '✓' : '○'} Number (0-9)
                        </div>
                        <div className={`flex items-center gap-1 ${passwordStrength.requirements?.special ? 'text-green-600' : 'text-gray-500'}`}>
                          {passwordStrength.requirements?.special ? '✓' : '○'} Special (!@#$)
                        </div>
                        <div className={`flex items-center gap-1 ${formData.password.length >= 12 ? 'text-green-600' : 'text-gray-500'}`}>
                          {formData.password.length >= 12 ? '✓' : '○'} 12+ chars (bonus)
                        </div>
                      </div>
                    </div>
                    
                    {/* Generate Password Button */}
                    {passwordStrength.score < 4 && (
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={() => {
                            const strongPassword = generateStrongPassword();
                            setFormData(prev => ({ 
                              ...prev, 
                              password: strongPassword,
                              confirmPassword: '' 
                            }));
                            const strength = checkPasswordStrength(strongPassword);
                            setPasswordStrength(strength);
                            setPasswordError('');
                            toast.success('Strong password generated! Please confirm it below.', {
                              duration: 3000,
                              icon: '🔐'
                            });
                          }}
                          className={`text-xs font-medium flex items-center gap-1 hover:underline ${
                            role === 'admin' 
                              ? 'text-red-600 hover:text-red-800' 
                              : role === 'owner' 
                              ? 'text-green-600 hover:text-green-800' 
                              : 'text-blue-600 hover:text-blue-800'
                          }`}
                        >
                          <FaLock className="h-3 w-3" />
                          Generate Strong Password
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required={!isLogin}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md placeholder-gray-400 focus:outline-none sm:text-sm transition-all duration-200 ${
                        formData.confirmPassword && formData.password
                          ? formData.password === formData.confirmPassword
                            ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                            : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="Re-enter your password"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      {formData.confirmPassword && formData.password && (
                        <div className="mr-10">
                          {formData.password === formData.confirmPassword ? (
                            <FaCheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <FaExclamationCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      )}
                      <button
                        type="button"
                        className="pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                  {passwordError && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <FaExclamationCircle className="h-3 w-3" />
                      {passwordError}
                    </p>
                  )}
                  {formData.confirmPassword && formData.password === formData.confirmPassword && !passwordError && (
                    <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                      <FaCheckCircle className="h-3 w-3" />
                      Passwords match perfectly!
                    </p>
                  )}
                </div>
              )}
              
              {/* Remember Me checkbox for login */}
              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className={`h-4 w-4 border-gray-300 rounded ${
                        role === 'admin' 
                          ? 'text-red-600 focus:ring-red-500' 
                          : role === 'owner' 
                          ? 'text-green-600 focus:ring-green-500' 
                          : 'text-blue-600 focus:ring-blue-500'
                      }`}
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>
                </div>
              )}
              
              {/* Terms and Privacy Policy checkbox for registration */}
              {!isLogin && (
                <div className="mb-4">
                  <div className="flex items-start">
                    <input
                      id="accept-terms"
                      name="accept-terms"
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className={`h-4 w-4 ${
                        role === 'owner' 
                          ? 'text-green-600 focus:ring-green-500' 
                          : role === 'admin' 
                          ? 'text-red-600 focus:ring-red-500' 
                          : 'text-blue-600 focus:ring-blue-500'
                      } border-gray-300 rounded mt-1`}
                    />
                    <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-900">
                      I agree to the{' '}
                      <Link 
                        to="/terms" 
                        target="_blank"
                        className={`${
                          role === 'owner' 
                            ? 'text-green-600 hover:text-green-700' 
                            : role === 'admin' 
                            ? 'text-red-600 hover:text-red-700' 
                            : 'text-blue-600 hover:text-blue-700'
                        } underline font-medium`}
                      >
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link 
                        to="/privacy" 
                        target="_blank"
                        className={`${
                          role === 'owner' 
                            ? 'text-green-600 hover:text-green-700' 
                            : role === 'admin' 
                            ? 'text-red-600 hover:text-red-700' 
                            : 'text-blue-600 hover:text-blue-700'
                        } underline font-medium`}
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading || !isFormReadyForSubmit()}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all duration-200 ${
                    role === 'owner' 
                      ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300' 
                      : role === 'admin' 
                      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300' 
                      : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300'
                  } disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>
                        {role === 'admin' && isLogin ? 
                          (showOtp ? 'Verifying...' : 'Sending OTP...') : 
                          (isLogin ? 'Signing In...' : 'Creating Account...')
                        }
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {!loading && isFormReadyForSubmit() && (
                        <FaCheckCircle className="h-4 w-4" />
                      )}
                      <span>
                        {role === 'admin' && isLogin ? (
                          showOtp ? 'Verify OTP & Login' : 'Send OTP'
                        ) : (
                          isLogin ? 'Sign In' : 'Create Account'
                        )}
                      </span>
                    </div>
                  )}
                </button>
              </div>
              {role === 'admin' && isLogin && showOtp && (
                <div className="space-y-4">
                  {/* Admin OTP Step Indicator */}
                  <div className="flex items-center justify-center space-x-2 mb-6">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700">Email</span>
                    </div>
                    <div className="w-8 h-0.5 bg-red-300"></div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <span className="ml-2 text-sm font-bold text-red-600">OTP</span>
                    </div>
                  </div>

                  {/* OTP Sent Success Message */}
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <FaCheckCircle className="h-5 w-5 text-red-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-red-800">
                          Admin OTP sent successfully!
                        </p>
                        <p className="text-sm text-red-600">
                          Please check your email <strong>{formData.email}</strong> for the OTP code.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* OTP Input with Individual Digits */}
                  <div className="space-y-4">
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
                          className="w-12 h-12 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all duration-200"
                          placeholder="●"
                        />
                      ))}
                    </div>
                    
                    {/* OTP Timer and Resend */}
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        Didn't receive the OTP?
                      </p>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await authService.sendOtp(formData.email, 'admin');
                            toast.success('Admin OTP resent successfully!');
                          } catch (error) {
                            toast.error('Failed to resend OTP');
                          }
                        }}
                        className="text-red-600 hover:text-red-800 text-sm font-medium underline"
                      >
                        Resend Admin OTP
                      </button>
                    </div>

                    {otpError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-600 text-sm font-medium">{otpError}</p>
                      </div>
                    )}
                    
                    {otpSuccess && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-green-600 text-sm font-medium">{otpSuccess}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </form>
            {/* Toggle login/register */}
            {role !== 'admin' && (
              <div className="mt-3 text-center">
                <p className="text-gray-600">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                  <Link
                    to={getTogglePath()}
                    className={`${
                      role === 'admin' 
                        ? 'text-red-600 hover:text-red-800' 
                        : role === 'owner' 
                        ? 'text-green-600 hover:text-green-800' 
                        : 'text-blue-600 hover:text-blue-800'
                    } font-medium`}
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
              <div className="mt-2 text-center">
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
            <div className="mt-2 text-center">
              <a
                href={getHomePath()}
                className="text-gray-500 hover:text-gray-700 text-sm inline-flex items-center gap-1"
              >
                <FaHome className="h-3 w-3" />
                Back to Home
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
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [lastVerifiedOtp, setLastVerifiedOtp] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotPasswordStrength, setForgotPasswordStrength] = useState({ score: 0, message: '', color: '', requirements: {} });
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [showOtpError, setShowOtpError] = useState(false); // Controls error/timer display
  const [otpSuccess, setOtpSuccess] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [otpCreatedAt, setOtpCreatedAt] = useState(null);
  const [otpAttempts, setOtpAttempts] = useState(0);
  // OTP expiry timer for UI
  const otpTimeLeft = otpCreatedAt ? getOtpTimeRemaining(otpCreatedAt, 300) : 0;
  const [emailError, setEmailError] = useState(''); // Email validation error
  
  // Email suggestions
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  const [emailSuggestions, setEmailSuggestions] = useState([]);

  // Scroll lock effect
  useEffect(() => {
    // Lock body scroll when component mounts
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, []);

  // Password strength checker for forgot password
  const checkPasswordStrength = (password) => {
    let score = 0;
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    // Calculate score based on requirements
    if (requirements.length) score += 1;
    if (requirements.uppercase) score += 1;
    if (requirements.lowercase) score += 1;
    if (requirements.number) score += 1;
    if (requirements.special) score += 1;
    if (password.length >= 12) score += 1; // Bonus for longer passwords

    let message = '';
    let color = '';

    if (score <= 2) {
      message = 'Weak password';
      color = 'text-red-600';
    } else if (score <= 4) {
      message = 'Medium strength';
      color = 'text-yellow-600';
    } else {
      message = 'Strong password';
      color = 'text-green-600';
    }

    return { score, message, color, requirements };
  };

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

  // Email domain suggestions (same as registration page)
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

  const handleEmailInput = (e) => {
    const processedValue = handleEmailChange(
      e.target.value, 
      (value) => setFormData(prev => ({ ...prev, email: value })), 
      setEmailError,
      setEmailSuggestions
    );
    // Show suggestions if there's an @ and partial domain typed
    setShowEmailSuggestions(processedValue.includes('@') && processedValue.split('@')[1] && processedValue.split('@')[1].length > 0);
  };

  const handleEmailSuggestionClick = (suggestion) => {
    setFormData(prev => ({ ...prev, email: suggestion }));
    setShowEmailSuggestions(false);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !isValidEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setOtpError('');
    setOtpSuccess('');
    setFormData(prev => ({ ...prev, otp: '' }));
    try {
      const res = await fetch(`http://localhost:5000/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, role })
      });
      const data = await res.json();
      
      if (data.success) {
        setOtpSuccess('OTP sent successfully to your email!');
        toast.success(`🔐 ${role.charAt(0).toUpperCase() + role.slice(1)} password reset OTP sent successfully!`, {
          duration: 4000,
          icon: '📧'
        });
        setCurrentStep(2);
        setResendTimer(60);
        setCanResend(false);
        setOtpCreatedAt(Date.now());
        setOtpAttempts(0);
      } else {
        setOtpError(data.message || 'Failed to send OTP');
        toast.error(data.message || 'Failed to send reset OTP');
      }
    } catch (error) {
      setOtpError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // OTP Error Handling Functions
  const getOtpErrorMessage = (errorMessage) => {
    if (!errorMessage) return '';
    
    const message = errorMessage.toLowerCase();
    
    if (message.includes('invalid')) {
      return 'Invalid OTP - Please check and enter the correct OTP';
    } else if (message.includes('expired')) {
      return 'OTP Expired - Please request a new OTP to continue';
    } else if (message.includes('used') || message.includes('already')) {
      return 'OTP Already Used - Please request a new OTP';
    } else if (message.includes('network')) {
      return 'Network Error - Please check your connection and try again';
    } else {
      return errorMessage;
    }
  };

  const getOtpErrorIcon = (errorMessage) => {
    if (!errorMessage) return '❌';
    
    const message = errorMessage.toLowerCase();
    
    if (message.includes('invalid')) {
      return '🚫';
    } else if (message.includes('expired')) {
      return '⏰';
    } else if (message.includes('used') || message.includes('already')) {
      return '🔄';
    } else if (message.includes('network')) {
      return '📡';
    } else {
      return '❌';
    }
  };

  const handleOtpError = (errorMessage, showToast = true) => {
    const formattedMessage = getOtpErrorMessage(errorMessage);
    const errorIcon = getOtpErrorIcon(errorMessage);
    setOtpError(formattedMessage);
    setShowOtpError(true);
    if (showToast) {
      toast.error(formattedMessage, {
        icon: errorIcon,
        duration: 4000
      });
    }
    // Hide error after 1.2s for input box red, but error message box will show 5s in OtpInput
    setTimeout(() => {
      setShowOtpError(false);
    }, 1200);
  };

  const handleVerifyOtp = async (e, otpOverride) => {
    if (e && e.preventDefault) e.preventDefault();
    const otpToCheck = otpOverride || formData.otp;
    if (!isValidOtp(otpToCheck, 6)) {
      setOtpError(getOtpValidationError(otpToCheck, { length: 6 }));
      setShowOtpError(true);
      return;
    }

    setLoading(true);
    setOtpError('');
    setShowOtpError(false);
    try {
      const cleanOtp = otpToCheck.replace(/\s/g, '');
      const res = await fetch(`http://localhost:5000/api/otp/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: cleanOtp, role })
      });
      const data = await res.json();
      if (data.success) {
        setOtpSuccess('OTP verified successfully!');
        setCurrentStep(3);
      } else {
        setOtpAttempts(a => a + 1);
        setOtpError(getOtpValidationError(
          otpToCheck,
          {
            createdAt: otpCreatedAt,
            expirySeconds: 300,
            used: false,
            length: 6,
            attempts: otpAttempts + 1,
            maxAttempts: 5,
            customMessages: {
              expired: 'OTP expired (valid for 5 minutes)',
              attempts: 'Too many invalid attempts. Please request a new OTP.'
            }
          }
  ) || (data.message || 'Invalid OTP'));
  setShowOtpError(true);
      }
    } catch (error) {
      handleOtpError('Network error. Please try again.', false); // No toast for forgot password
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!formData.newPassword || formData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    
    if (forgotPasswordStrength.score <= 2) {
      toast.error('Please choose a stronger password');
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      const cleanOtp = formData.otp.replace(/\s/g, '');
      const res = await fetch(`http://localhost:5000/api/forgot-password/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          otp: cleanOtp, 
          newPassword: formData.newPassword, 
          role 
        })
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(`🎉 Password reset successful! Please login with your new password.`, {
          duration: 5000,
          icon: '✅'
        });
        
        // Role-based redirect after password reset
        setTimeout(() => {
          const redirectUrl = role === 'admin'
            ? '/admin/login'
            : role === 'owner' 
            ? '/owner/login' 
            : '/user/login';
          window.location.href = redirectUrl;
        }, 2000);
      } else {
        toast.error(data.message || 'Failed to reset password');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    
    setLoading(true);
    setOtpError('');
    setOtpSuccess('');
    setFormData(prev => ({ ...prev, otp: '' }));
    try {
      const res = await fetch(`http://localhost:5000/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, role })
      });
      const data = await res.json();
      
      if (data.success) {
        setOtpSuccess('OTP resent successfully!');
        setResendTimer(60);
        setCanResend(false);
        setOtpCreatedAt(Date.now());
        setOtpAttempts(0);
      } else {
        setOtpError(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      handleOtpError('Network error. Please try again.', false); // No toast for forgot password
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    // Only allow single digit and numbers only
    if (value.length > 1) return;
    
    // Check if value is a digit (0-9) or empty
    if (value !== '' && !/^[0-9]$/.test(value)) {
      return; // Don't allow non-numeric characters
    }
    
    const otpArray = formData.otp.split('');
    otpArray[index] = value;
    const newOtp = otpArray.join('');
    
    setFormData(prev => ({ ...prev, otp: newOtp }));
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace to go to previous input
    if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, label: 'Email' },
      { number: 2, label: 'OTP' },
      { number: 3, label: 'Password' }
    ];

    const themeColor = role === 'admin' ? 'red' : role === 'owner' ? 'green' : 'blue';

    return (
      <div className="flex items-center justify-center space-x-2 mb-4 w-full">
        <div className="flex items-center justify-center space-x-2">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep >= step.number 
                    ? `bg-${themeColor}-600 text-white` 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {step.number}
                </div>
                <span className={`ml-2 text-xs font-medium ${
                  currentStep === step.number 
                    ? `text-${themeColor}-600 font-bold` 
                    : currentStep > step.number 
                    ? 'text-gray-700' 
                    : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex items-center">
                  <span className={`text-lg font-bold ${
                    currentStep > step.number ? `text-${themeColor}-600` : 'text-gray-400'
                  }`}>
                    →
                  </span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // Helper for role-based color and icon
  const roleColor = role === 'admin' ? 'red' : role === 'owner' ? 'green' : 'blue';
  const IconComponent = role === 'admin' ? FaUserShield : role === 'owner' ? FaUserTie : FaUserCircle;
  const iconColor = role === 'admin' ? 'text-red-600' : role === 'owner' ? 'text-green-600' : 'text-blue-600';
  const bgColor = role === 'admin' 
    ? 'bg-red-50' 
    : role === 'owner' 
    ? 'bg-green-50' 
    : 'bg-blue-50';

  return (
    <div className={`min-h-screen flex items-center justify-center py-1 px-4 overflow-hidden ${bgColor}`} style={{ overflow: 'hidden', height: '100vh' }}>
      <div className="w-full max-w-md mx-auto overflow-visible" style={{ transform: 'translateY(-3rem)' }}>
        <div className="flex justify-center">
          <div className="flex flex-col items-center space-y-1 w-full">
            <span className="relative group">
              <IconComponent
                className={`h-10 w-10 ${iconColor} drop-shadow-lg`}
                title={`${role.charAt(0).toUpperCase() + role.slice(1)} Password Reset`}
              />
              <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-2 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {role.charAt(0).toUpperCase() + role.slice(1)} Password Reset
              </span>
            </span>
            <div className="text-sm font-semibold text-gray-700">
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </div>
            <h2 className="text-center text-2xl font-extrabold text-gray-900">
              Reset {role.charAt(0).toUpperCase() + role.slice(1)} Password
            </h2>
          </div>
        </div>
        <p className="text-center text-sm text-gray-600 mb-4">
          {currentStep === 1 && 'Enter your email to receive reset instructions'}
          {currentStep === 2 && 'Verify your identity with OTP'}
          {currentStep === 3 && 'Create your new secure password'}
        </p>
        
        <div className={`p-4 rounded-[2rem] border-2 border-gray-100 shadow-[0_8px_40px_rgba(0,0,0,0.25)] drop-shadow-2xl overflow-visible ${
          role === 'admin'
            ? 'bg-gradient-to-br from-red-50 via-white to-red-100'
            : role === 'owner'
            ? 'bg-gradient-to-br from-green-50 via-white to-green-100'
            : 'bg-gradient-to-br from-blue-50 via-white to-blue-100'
        }`}>
          
          {/* Step Indicator */}
          {renderStepIndicator()}
          
          {/* Step 1: Email Input */}
          {currentStep === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4 overflow-visible">
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {role.charAt(0).toUpperCase() + role.slice(1)} Email Address <span className="text-red-500">*</span>
                </label>
                <EmailValidationInput
                  value={formData.email}
                  onChange={val => setFormData(prev => ({ ...prev, email: val }))}
                  error={emailError}
                  setError={setEmailError}
                  suggestions={emailSuggestions}
                  setSuggestions={setEmailSuggestions}
                  required
                  disabled={loading}
                  className={emailError ? 'border-red-500' : ''}
                  placeholder={`Enter your ${role} email address`}
                />
                {/* Error message is now handled only by EmailValidationInput */}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || !formData.email || !isValidEmail(formData.email) || emailError}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all duration-200 ${
                    role === 'admin' 
                      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300' 
                      : role === 'owner' 
                      ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300' 
                      : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300'
                  } disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending Reset OTP...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <FaLock className="h-4 w-4" />
                      <span>Send OTP</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {/* OTP Sent Success Message */}
              <div className={`p-2 ${
                role === 'admin' 
                  ? 'bg-red-50 border-red-200' 
                  : role === 'owner' 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-blue-50 border-blue-200'
              } border rounded-lg`}>
                <div className="flex items-center">
                  <FaCheckCircle className={`h-4 w-4 ${
                    role === 'admin' ? 'text-red-500' : role === 'owner' ? 'text-green-500' : 'text-blue-500'
                  } mr-2 flex-shrink-0`} />
                  <div>
                    <p className={`text-xs font-medium ${
                      role === 'admin' ? 'text-red-800' : role === 'owner' ? 'text-green-800' : 'text-blue-800'
                    }`}>
                      Password reset OTP sent successfully!
                    </p>
                    <p className={`text-xs ${
                      role === 'admin' ? 'text-red-600' : role === 'owner' ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      Check email <strong>{formData.email}</strong> for OTP.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 text-center">Enter Reset OTP</label>
                  <OtpInput
                    value={formData.otp}
                    onChange={otp => {
                      setOtpSuccess('');
                      setFormData(prev => ({ ...prev, otp }));
                      if (showOtpError) setShowOtpError(false);
                    }}
                    length={6}
                    error={!!(showOtpError && otpError)}
                    success={!!otpSuccess}
                    loading={loading}
                    onComplete={otpValue => {
                      if (
                        otpValue.length === 6 &&
                        !loading &&
                        otpValue !== lastVerifiedOtp
                      ) {
                        setLastVerifiedOtp(otpValue);
                        setOtpSuccess('');
                        handleVerifyOtp({ preventDefault: () => {} }, otpValue);
                      }
                    }}
                    statusMessage={
                      showOtpError && otpError
                        ? otpError
                        : otpSuccess
                        ? otpSuccess
                        : otpCreatedAt && isOtpExpired(otpCreatedAt, 300) && !showOtpError
                        ? 'OTP expired. Please resend.'
                        : ''
                    }
                    statusType={
                      showOtpError && otpError
                        ? 'error'
                        : otpSuccess
                        ? 'success'
                        : otpCreatedAt && isOtpExpired(otpCreatedAt, 300) && !showOtpError
                        ? 'error'
                        : ''
                    }
                    otpCreatedAt={otpCreatedAt}
                    expirySeconds={300}
                  />
                  <div className="text-center space-y-1">
                    <p className="text-sm text-gray-600">
                      Didn't receive the reset code?
                    </p>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={!canResend || loading}
                      className={`text-sm font-medium underline ${
                        canResend 
                          ? `${
                              role === 'admin' ? 'text-red-600 hover:text-red-800' : 
                              role === 'owner' ? 'text-green-600 hover:text-green-800' : 
                              'text-blue-600 hover:text-blue-800'
                            } cursor-pointer` 
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {canResend ? 'Resend Reset OTP' : `Resend in ${resendTimer}s`}
                    </button>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loading || formData.otp.length !== 6}
                    className={`w-full flex justify-center py-3 px-5 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white transition-colors duration-200 ${
                      role === 'admin' 
                        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300' 
                        : role === 'owner' 
                        ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300' 
                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300'
                    } disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2`}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Verifying OTP...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <FaCheckCircle className="h-4 w-4" />
                        <span>Verify OTP</span>
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: New Password */}
          {currentStep === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.newPassword}
                    onChange={(e) => {
                      const newPasswordValue = e.target.value;
                      setFormData(prev => ({ ...prev, newPassword: newPasswordValue }));
                      // Password strength check for forgot password
                      const strength = checkPasswordStrength(newPasswordValue);
                      setForgotPasswordStrength(strength);
                    }}
                    minLength={8}
                    className={`appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-${roleColor}-500 focus:border-${roleColor}-500 sm:text-sm`}
                    placeholder="Enter new password (min 8 characters)"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                
                {/* Password strength indicator for forgot password */}
                {formData.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            forgotPasswordStrength.score <= 2 ? 'bg-red-500' :
                            forgotPasswordStrength.score <= 4 ? 'bg-yellow-500' :
                            forgotPasswordStrength.score <= 5 ? 'bg-green-500' : 'bg-green-600'
                          }`}
                          style={{ width: `${(forgotPasswordStrength.score / 6) * 100}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-medium ${
                        forgotPasswordStrength.score <= 2 ? 'text-red-600' :
                        forgotPasswordStrength.score <= 4 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {forgotPasswordStrength.score <= 2 ? 'Weak' :
                         forgotPasswordStrength.score <= 4 ? 'Medium' : 'Strong'}
                      </span>
                    </div>
                    
                    {/* Password Requirements Checklist with Tick Marks */}
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-gray-700 mb-1">Password Requirements:</div>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div className={`flex items-center gap-1 ${forgotPasswordStrength.requirements?.length ? 'text-green-600' : 'text-gray-500'}`}>
                          {forgotPasswordStrength.requirements?.length ? '✓' : '○'} 8+ characters
                        </div>
                        <div className={`flex items-center gap-1 ${forgotPasswordStrength.requirements?.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                          {forgotPasswordStrength.requirements?.uppercase ? '✓' : '○'} Uppercase (A-Z)
                        </div>
                        <div className={`flex items-center gap-1 ${forgotPasswordStrength.requirements?.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                          {forgotPasswordStrength.requirements?.lowercase ? '✓' : '○'} Lowercase (a-z)
                        </div>
                        <div className={`flex items-center gap-1 ${forgotPasswordStrength.requirements?.number ? 'text-green-600' : 'text-gray-500'}`}>
                          {forgotPasswordStrength.requirements?.number ? '✓' : '○'} Number (0-9)
                        </div>
                        <div className={`flex items-center gap-1 ${forgotPasswordStrength.requirements?.special ? 'text-green-600' : 'text-gray-500'}`}>
                          {forgotPasswordStrength.requirements?.special ? '✓' : '○'} Special (!@#$)
                        </div>
                        <div className={`flex items-center gap-1 ${formData.newPassword.length >= 12 ? 'text-green-600' : 'text-gray-500'}`}>
                          {formData.newPassword.length >= 12 ? '✓' : '○'} 12+ chars (bonus)
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md placeholder-gray-400 focus:outline-none sm:text-sm transition-all duration-200 ${
                      formData.confirmPassword && formData.newPassword
                        ? formData.newPassword === formData.confirmPassword
                          ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                          : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : `border-gray-300 focus:ring-${roleColor}-500 focus:border-${roleColor}-500`
                    }`}
                    placeholder="Re-enter your new password"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    {formData.confirmPassword && formData.newPassword && (
                      <div className="mr-10">
                        {formData.newPassword === formData.confirmPassword ? (
                          <FaCheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <FaExclamationCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    )}
                    <button
                      type="button"
                      className="pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
                {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                  <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                    <FaCheckCircle className="h-3 w-3" />
                    Passwords match perfectly!
                  </p>
                )}
                {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FaExclamationCircle className="h-3 w-3" />
                    Passwords do not match
                  </p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || !formData.newPassword || !formData.confirmPassword || formData.newPassword !== formData.confirmPassword || formData.newPassword.length < 8 || forgotPasswordStrength.score <= 2}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all duration-200 ${
                    role === 'admin' 
                      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300' 
                      : role === 'owner' 
                      ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300' 
                      : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300'
                  } disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Updating Password...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <FaLock className="h-4 w-4" />
                      <span>Update Password</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Navigation Links */}
          <div className="mt-3 space-y-2">
            {/* Back to credentials for step 2 only */}
            {/* {currentStep === 2 && (
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Wrong email?{' '}
                  <button
                    onClick={() => setCurrentStep(1)}
                    className={`text-${roleColor}-600 hover:text-${roleColor}-800 font-medium underline transition-colors duration-200`}
                  >
                    Edit Email
                  </button>
                  {' '}and correct
                </p>
              </div>
            )}
             */}
            {/* Login link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <a
                  href={role === 'admin' ? '/admin/login' : role === 'owner' ? '/owner/login' : '/user/login'}
                  className={`text-${roleColor}-600 hover:text-${roleColor}-800 font-medium underline transition-colors duration-200`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)} Login
                </a>
              </p>
            </div>
            
            {/* Back to home link */}
            <div className="text-center">
              <a
                href="/"
                className="text-gray-500 hover:text-gray-700 text-sm inline-flex items-center gap-1"
              >
                <FaHome className="h-3 w-3" />
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
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
  
  // Handle different error scenarios
  if (!data.success) {
    if (response.status === 429) {
      // Rate limit exceeded
      throw new Error(data.message || 'Too many OTP requests. Please try again later.');
    } else {
      // Other errors
      throw new Error(data.message || 'Failed to send OTP');
    }
  }
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
