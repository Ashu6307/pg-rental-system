import React, { useState, useEffect, useCallback } from "react";
import { FaExclamationCircle, FaEnvelope } from "react-icons/fa";
import {
  handleEmailChange,
  isValidEmail,
  generateEmailSuggestions
} from "../../utils/validation/emailValidation";

/**
 * Reusable, industry-level Email Input component with validation & suggestions
 *
 * Props:
 * - value: string (controlled value)
 * - onChange: function (update value)
 * - error: string (current error message)
 * - setError: function (update error)
 * - suggestions: array (email suggestions)
 * - setSuggestions: function (update suggestions)
 * - placeholder: string (input placeholder)
 * - readOnly: boolean (optional)
 * - disabled: boolean (optional)
 * - required: boolean (optional)
 * - domains: array (custom domains for suggestions)
 * - className: string (extra classes for styling)
 * - errorMessages: object (custom error messages override)
 * - onValidEmail: function (callback when email is valid)
 */
const EmailValidationInput = ({
  value,
  onChange,
  error,
  setError,
  suggestions = [],
  setSuggestions = null,
  placeholder = "Enter email address",
  readOnly = false,
  disabled = false,
  required = true,
  domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"],
  className = "",
  errorMessages = {},
  onValidEmail = null,
  ...props
}) => {
  const [highlightIndex, setHighlightIndex] = useState(-1);

  // Debounce validation (better UX)
  const validateInput = useCallback(
    (val) => {
      handleEmailChange(val, onChange, setError, setSuggestions);
      if (onValidEmail && isValidEmail(val)) {
        onValidEmail(val);
      }
    },
    [onChange, setError, setSuggestions, onValidEmail]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (value) validateInput(value);
    }, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [value, validateInput]);

  // Handle keyboard navigation in suggestions
  const handleKeyDown = (e) => {
    if (!suggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    }
    if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      const chosen = suggestions[highlightIndex];
      handleEmailChange(chosen, onChange, setError, setSuggestions);
      setHighlightIndex(-1);
    }
    if (e.key === "Escape") {
      setSuggestions([]);
      setHighlightIndex(-1);
    }
  };

  return (
    <div className="w-full relative">
      <input
        type="text"
        name="email"
        id="email"
        autoComplete="email"
        required={required}
        disabled={disabled}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? "email-error" : undefined}
        onChange={(e) => validateInput(e.target.value)}
        onInput={(e) => {
          if (e.target.value.includes(" ")) {
            e.target.value = e.target.value.replace(/\s+/g, "");
          }
        }}
        onKeyDown={handleKeyDown}
        className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md placeholder-gray-400 focus:outline-none sm:text-sm transition-all duration-200 ${
          error
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : value && isValidEmail(value)
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
        <FaEnvelope
          className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Suggestions Dropdown */}
      {setSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-50 mt-1">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              className={`w-full text-left px-3 py-2 text-sm border-b border-gray-100 last:border-b-0 transition-colors duration-150 ${
                highlightIndex === idx
                  ? "bg-blue-50 text-blue-700"
                  : "hover:bg-blue-50 hover:text-blue-700"
              }`}
              onClick={() => {
                handleEmailChange(
                  suggestion,
                  onChange,
                  setError,
                  setSuggestions
                );
                setHighlightIndex(-1);
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p id="email-error" className="text-red-500 text-xs mt-1">
          {errorMessages[error] || error}
        </p>
      )}
    </div>
  );
};

export default EmailValidationInput;
