import React, { useState, useEffect, useCallback } from "react";
import { FaExclamationCircle, FaUser } from "react-icons/fa";
import {
  handleNameChange,
  isValidName,
  getNameValidationError,
  formatName
} from "../../utils/validation/nameValidation";

/**
 * Reusable Name Input component with validation and formatting
 *
 * Props:
 * - value: string (controlled value)
 * - onChange: function (update value)
 * - error: string (current error message)
 * - setError: function (update error)
 * - placeholder: string (input placeholder)
 * - required: boolean (optional)
 * - disabled: boolean (optional)
 * - className: string (extra classes for styling)
 * - errorMessages: object (custom error messages override)
 */
const NameValidationInput = ({
  value,
  onChange,
  error,
  setError,
  placeholder = "Enter your full name",
  required = true,
  disabled = false,
  className = "",
  errorMessages = {},
  ...props
}) => {
  // Debounced validation for better UX
  const validateInput = useCallback(
    (val) => {
      handleNameChange(val, onChange, setError);
    },
    [onChange, setError]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (value) validateInput(value);
    }, 200);
    return () => clearTimeout(timer);
  }, [value, validateInput]);

  return (
    <div className="w-full relative">
      <input
        type="text"
        name="name"
        id="name"
        autoComplete="name"
        required={required}
        disabled={disabled}
        value={value}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? "name-error" : undefined}
        onChange={e => validateInput(e.target.value)}
        onInput={e => {
          // Remove numbers and special chars in real-time
          e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
        }}
        className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md placeholder-gray-400 focus:outline-none sm:text-sm transition-all duration-200 ${
          error
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : value && isValidName(value)
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
        <FaUser
          className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none"
          aria-hidden="true"
        />
      )}
      {/* Error Message */}
      {error && (
        <p id="name-error" className="text-red-500 text-xs mt-1">
          {errorMessages[error] || error}
        </p>
      )}
    </div>
  );
};

export default NameValidationInput;
