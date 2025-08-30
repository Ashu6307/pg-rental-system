import React, { useState, useContext, useEffect } from "react";
import OtpInput from '../../components/validation/OtpInput';
import {
  isValidOtp,
  isOtpExpired,
  getOtpValidationError,
  getOtpTimeRemaining,
  formatOtpTime,
} from "../../utils/validation/otpValidation";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import authService from "../../services/authService";
import {
  FaUserShield,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaHome,
} from "react-icons/fa";
import EmailValidationInput from '../../components/validation/EmailValidationInput';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [lastVerifiedOtp, setLastVerifiedOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [showOtpError, setShowOtpError] = useState(false); // Controls error/timer display
  const [otpSuccess, setOtpSuccess] = useState("");
  const [focusedOtpIndex, setFocusedOtpIndex] = useState(-1);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // State to make all OTP boxes red/green on error/success
  // Removed: otpAllRed/otpAllGreen, now handled by OtpInput

  // Email validation state
  const [emailError, setEmailError] = useState("");
  const [emailSuggestions, setEmailSuggestions] = useState([]);

  // OTP expiry and attempt tracking state
  const [otpCreatedAt, setOtpCreatedAt] = useState(null); // When OTP was sent
  const [otpAttempts, setOtpAttempts] = useState(0);      // How many times user tried

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // OTP Timer countdown
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((timer) => {
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

  // Only handle password change now
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Send OTP and set OTP created time for expiry logic
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please enter both email and password");
      return;
    }
    setLoading(true);
    setOtpError("");
    try {
      const result = await authService.sendOtp(
        formData.email,
        "admin",
        formData.password
      );
      if (result.success) {
        setOtpSent(true);
        setCanResend(false);
        setResendTimer(60);
        setOtpCreatedAt(Date.now()); // Set OTP sent time for expiry
        setOtpAttempts(0); // Reset attempts
        setOtp("");
        setOtpError("");
        setOtpAllRed(false);
        setOtpAllGreen(false);
        toast.success("Admin OTP sent to your email!");
      }
    } catch (error) {
      setOtpError(error.message || "Failed to send OTP");
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Centralized OTP error handling using otpValidation.js (now with correct arguments)
  const handleOtpError = (errorType) => {
    // Prepare options for error context
    const options = {
      createdAt: otpCreatedAt,
      expirySeconds: 300, // 5 min
      attempts: otpAttempts,
      maxAttempts: 5,
      used: errorType === "used",
      length: 6
    };
    setOtpError(getOtpValidationError(otp, options) || "Invalid OTP");
    setShowOtpError(true);
    // OtpInput input box red for 1.2 sec, error message box for 5 sec
    setTimeout(() => {
      setShowOtpError(false);
    }, 1200); // Only keep error prop true for 1.2 sec
  };

  // OTP verify handler using centralized validation
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    // Validate OTP input
    if (!otp || otp.length !== 6) {
      setOtpError(getOtpValidationError("incomplete"));
      setShowOtpError(true);
      return;
    }
    if (!isValidOtp(otp)) {
      setOtpError(getOtpValidationError("invalid"));
      setShowOtpError(true);
      setOtpAttempts((prev) => prev + 1);
      return;
    }
    // Check expiry (5 min)
    if (isOtpExpired(otpCreatedAt, 300)) {
      setOtpError(getOtpValidationError("expired"));
      setShowOtpError(true);
      return;
    }
    setLoading(true);
    setOtpError("");
    try {
      const loginResult = await authService.verifyOtp(
        formData.email,
        otp,
        "admin"
      );
      if (loginResult.token && loginResult.user) {
        await login(loginResult.token, loginResult.user);
        sessionStorage.setItem("auth_last_activity", Date.now().toString());
        sessionStorage.setItem("admin_login_time", Date.now().toString());
        localStorage.removeItem("auth_session_expired");
  setOtpSuccess("✅ Login successful!");
        toast.success("🎉 Admin login successful! Welcome back.", {
          duration: 3000,
          icon: "👑",
        });
        navigate("/admin", { replace: true });
      }
    } catch (error) {
      // Use error message to determine type
      let errorType = "invalid";
      if (error.message && error.message.toLowerCase().includes("expired")) errorType = "expired";
      else if (error.message && error.message.toLowerCase().includes("used")) errorType = "used";
      setOtpAttempts((prev) => prev + 1);
      handleOtpError(errorType);
      toast.error(error.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP and reset expiry/attempts
  const handleResendOtp = async () => {
    if (!canResend) return;
    setLoading(true);
    try {
      await authService.sendOtp(formData.email, "admin", formData.password);
      setCanResend(false);
      setResendTimer(60);
      setOtpCreatedAt(Date.now());
      setOtpAttempts(0);
      setOtp("");
      setOtpError("");
      setOtpAllRed(false);
      setOtpAllGreen(false);
      toast.success("Admin OTP resent successfully!");
    } catch (error) {
      toast.error("Failed to resend OTP");
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
                  <span className="ml-2 text-sm font-bold text-red-600">
                    Credentials
                  </span>
                </div>
                <div className="w-8 h-0.5 bg-gray-300"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    OTP
                  </span>
                </div>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  {/* Email Input */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Admin Email <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative">
                      <EmailValidationInput
                        value={formData.email}
                        onChange={email => setFormData(prev => ({ ...prev, email }))}
                        error={emailError}
                        setError={setEmailError}
                        suggestions={emailSuggestions}
                        setSuggestions={setEmailSuggestions}
                        placeholder="Enter admin email address"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
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

                <div className="space-y-3 mt-6">
                  <button
                    type="submit"
                    disabled={
                      loading ||
                      !formData.email ||
                      !formData.password ||
                      !!emailError
                    }
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending OTP...
                      </div>
                    ) : (
                      "Send OTP"
                    )}
                  </button>

                  {/* Forgot Password Link */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => navigate("/admin/forgot-password")}
                      className="text-sm text-red-600 hover:text-red-800 font-medium underline"
                    >
                      Forgot Admin Password?
                    </button>
                  </div>

                  {/* Back to Home Link */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => navigate("/")}
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
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Credentials
                  </span>
                </div>
                <div className="w-8 h-0.5 bg-red-300"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <span className="ml-2 text-sm font-bold text-red-600">
                    OTP
                  </span>
                </div>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  {/* OTP Sent Success Message */}
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <FaCheckCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-red-800">
                          Admin Login OTP sent successfully!
                        </p>
                        <p className="text-xs text-red-600">
                          Check email <strong>{formData.email}</strong> for OTP.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* OTP Input with Individual Digits */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 text-center">
                      Enter Admin OTP
                    </label>
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
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
                    {/* OTP Timer, Expiry, and Resend */}
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
                            ? "text-red-600 hover:text-red-800"
                            : "text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {canResend
                          ? "Resend Login OTP"
                          : `Resend in ${resendTimer}s`}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mt-3">
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
                      "Verify & Login"
                    )}
                  </button>

                  {/* Navigation Options */}
                  <div className="space-y-2">
                    {/* Back to Credentials */}
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setOtp("");
                          setOtpError("");
                          setOtpSuccess("");
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
                        onClick={() => navigate("/")}
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