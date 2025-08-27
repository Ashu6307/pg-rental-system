import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * OtpInput Component
 * Features:
 * - Custom length (default 6)
 * - Digit-only, auto-focus, paste support
 * - Dynamic box coloring: green (all correct), red (all error), green (filled), red (focused), gray (empty)
 * - Real-time verification: calls onVerify(otp) when all digits entered
 * - onComplete callback: fires when all digits filled
 * - Visual feedback: all boxes green on success, all red on error
 * - Error/success auto-reset on change
 * - Input type="tel" for mobile
 * - Auto-select on focus
 * - PropTypes for type safety
 *
 * Props:
 * - value: string (OTP value)
 * - onChange: (otp: string) => void
 * - onVerify: (otp: string) => void (called when all digits entered)
 * - onComplete: (otp: string) => void (called when all digits entered, before onVerify)
 * - error: boolean (all boxes red)
 * - success: boolean (all boxes green)
 * - loading: boolean (show spinner in boxes)
 * - length: number (OTP length, default 6)
 * - className: string (extra classes)
 */
const OtpInput = ({
  value = '',
  onChange,
  onVerify,
  onComplete,
  error = false,
  success = false,
  loading = false,
  length = 6,
  className = '',
}) => {
  const inputRefs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  // Local state to auto-reset error/success on change
  const [localError, setLocalError] = useState(false);
  const [localSuccess, setLocalSuccess] = useState(false);

  // Reset error/success when value changes
  useEffect(() => {
    if (error) setLocalError(true);
    else setLocalError(false);
    if (success) setLocalSuccess(true);
    else setLocalSuccess(false);
  }, [error, success]);

  // Auto-reset error/success on any change
  useEffect(() => {
    if (localError || localSuccess) {
      setLocalError(false);
      setLocalSuccess(false);
    }
    // eslint-disable-next-line
  }, [value]);

  // Real-time verification and onComplete
  useEffect(() => {
    if (value.length === length && /^\d+$/.test(value)) {
      if (onComplete) onComplete(value);
      if (onVerify) onVerify(value);
    }
    // eslint-disable-next-line
  }, [value, length, onVerify, onComplete]);

  // Handle paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (pasted.length > 0) {
      onChange(pasted.padEnd(length, ''));
      // Focus next empty or last
      const nextIndex = Math.min(pasted.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  // Handle input change
  const handleInputChange = (i, v) => {
    if (v !== '' && !/^[0-9]$/.test(v)) return;
    const arr = value.split('');
    arr[i] = v;
    onChange(arr.join('').slice(0, length));
    if (v && i < length - 1) inputRefs.current[i + 1]?.focus();
  };

  // Handle keydown for backspace and tab
  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && i < length - 1) {
      inputRefs.current[i + 1]?.focus();
    }
    // Tab/Shift+Tab handled by browser
  };

  // Auto-select on focus
  const handleFocus = (i, e) => {
    setFocusedIndex(i);
    e.target.select();
  };

  return (
    <div className={`flex justify-center space-x-2 relative ${className}`}>
      {[...Array(length)].map((_, i) => (
        <input
          key={i}
          ref={el => (inputRefs.current[i] = el)}
          type="tel"
          maxLength={1}
          value={value[i] || ''}
          onFocus={e => handleFocus(i, e)}
          onBlur={() => setFocusedIndex(-1)}
          onChange={e => handleInputChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          autoComplete="off"
          inputMode="numeric"
          pattern="[0-9]*"
          aria-label={`OTP digit ${i + 1}`}
          className={`w-10 h-10 text-center text-lg font-bold border-2 rounded-lg focus:outline-none transition-all duration-200
            ${localSuccess || success
              ? 'border-green-500 bg-green-50'
              : localError || error
              ? 'border-red-500 bg-red-50'
              : value[i]
              ? 'border-green-500 bg-green-50'
              : focusedIndex === i
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300'}
          `}
          placeholder="●"
          disabled={loading}
        />
      ))}
      {loading && (
        <div className="absolute flex items-center justify-center w-full h-full pointer-events-none top-0 left-0">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
        </div>
      )}
    </div>
  );
};

OtpInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onVerify: PropTypes.func,
  onComplete: PropTypes.func,
  error: PropTypes.bool,
  success: PropTypes.bool,
  loading: PropTypes.bool,
  length: PropTypes.number,
  className: PropTypes.string,
};

export default OtpInput;
