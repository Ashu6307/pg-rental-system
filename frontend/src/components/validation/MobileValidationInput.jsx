import React, { useState, useEffect, useCallback } from "react";
import { FaExclamationCircle, FaPhoneAlt } from "react-icons/fa";
import { formatPhoneNumber, isValidIndianMobile } from "../../utils/validation/mobileValidation";

/**
 * Reusable, industry-level Mobile Number Input component with validation
 *
 * Props:
 * - value: string (controlled value)
 * - onChange: function (update value)
 * - error: string (current error message)
 * - setError: function (update error)
 * - placeholder: string (input placeholder)
 * - readOnly: boolean (optional)
 * - disabled: boolean (optional)
 * - required: boolean (optional)
 * - className: string (extra classes for styling)
 * - errorMessages: object (custom error messages override)
 * - onValidMobile: function (callback when mobile is valid)
 */
const MobileValidationInput = ({
  value,
  onChange,
  error,
  setError,
  placeholder = "Enter mobile number",
  readOnly = false,
  disabled = false,
  required = true,
  className = "",
  errorMessages = {},
  onValidMobile = null,
  ...props
}) => {
  // Debounce validation (better UX)
  const validateInput = useCallback(
    (val) => {
      let formatted = formatPhoneNumber(val);
      onChange(formatted);
      if (!formatted || formatted.length === 0) {
        setError("Mobile number is required");
        return;
      }
      if (formatted.length < 10 || !isValidIndianMobile(formatted)) {
  setError("Enter valid 10-digit Indian mobile (no 0, +91)");
        return;
      }
      setError("");
      if (onValidMobile) onValidMobile(formatted);
    },
    [onChange, setError, onValidMobile]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (value) validateInput(value);
    }, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [value, validateInput]);

  return (
    <div className="w-full relative">
      <input
        type="tel"
        name="mobile"
        id="mobile"
        autoComplete="tel"
        required={required}
        disabled={disabled}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? "mobile-error" : undefined}
        onChange={e => {
          validateInput(e.target.value);
        }}
        className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md placeholder-gray-400 focus:outline-none sm:text-sm transition-all duration-200 ${
          error
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : value && isValidIndianMobile(value)
            ? "border-green-500 focus:ring-green-500 focus:border-green-500"
            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        } ${className}`}
        {...props}
      />
      {/* Error / Icon */}
      {error ? (
        <FaExclamationCircle
          className="absolute right-3 top-2.5 h-5 w-5 text-red-500"
          aria-hidden="true"
        />
      ) : (
        <FaPhoneAlt
          className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none"
          aria-hidden="true"
        />
      )}
      {/* Error Message */}
      {error && (
        <p id="mobile-error" className="text-red-500 text-xs mt-1">
          {errorMessages[error] || error}
        </p>
      )}
    </div>
  );
};

export default MobileValidationInput;
