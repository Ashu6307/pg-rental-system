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
  statusMessage = '',
  statusType = '', // 'error' | 'success' | 'timer' | 'info'
  statusBoxColor = {}, // { bg: '', border: '', text: '' }
  errorHighlightDuration = 1200, // ms
  value = '',
  onChange,
  onVerify,
  onComplete,
  error = false,
  success = false,
  loading = false,
  length = 6,
  className = '',
  focusOnErrorTrigger,
  allowAlphanumeric = false,
  placeholder = '●',
  locked = false,
  autoSubmitOnComplete = false,
  onAutoSubmit,
  direction = 'ltr',
  i18n = {}, // { invalid: '', expired: '', ... }
}) => {
  const inputRefs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  // Local state to auto-reset error/success on change
  const [localError, setLocalError] = useState(false);
  const [localSuccess, setLocalSuccess] = useState(false);
  // Red highlight timer
  useEffect(() => {
    if (error) {
      setLocalError(true);
      const t = setTimeout(() => setLocalError(false), errorHighlightDuration);
      return () => clearTimeout(t);
    }
  }, [error, errorHighlightDuration]);

  // Focus first input when focusOnErrorTrigger changes (used for error highlight/focus)
  useEffect(() => {
    if (error && focusOnErrorTrigger !== undefined) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
    // eslint-disable-next-line
  }, [focusOnErrorTrigger]);

  // Reset error/success when value changes
  useEffect(() => {
    if (error) setLocalError(true);
    else setLocalError(false);
    if (success) setLocalSuccess(true);
    else setLocalSuccess(false);
  }, [error, success]);

  // Paste feedback animation
  const [pasteAnim, setPasteAnim] = useState(false);

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
    const valid = allowAlphanumeric
      ? value.length === length && /^[a-zA-Z0-9]+$/.test(value)
      : value.length === length && /^\d+$/.test(value);
    if (valid) {
      if (onComplete) onComplete(value);
      if (onVerify) onVerify(value);
      if (autoSubmitOnComplete && onAutoSubmit) onAutoSubmit(value);
    }
    // eslint-disable-next-line
  }, [value, length, onVerify, onComplete, autoSubmitOnComplete, onAutoSubmit, allowAlphanumeric]);

  // Handle paste event with feedback
  const handlePaste = (e) => {
    e.preventDefault();
    let pasted = e.clipboardData.getData('text');
    pasted = allowAlphanumeric
      ? pasted.replace(/[^a-zA-Z0-9]/g, '').slice(0, length)
      : pasted.replace(/\D/g, '').slice(0, length);
    if (pasted.length > 0) {
      onChange(pasted.padEnd(length, ''));
      // Focus next empty or last
      const nextIndex = Math.min(pasted.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      setPasteAnim(true);
      setTimeout(() => setPasteAnim(false), 400);
    }
  };

  // Handle input change
  const handleInputChange = (i, v) => {
    if (v !== '' && !(allowAlphanumeric ? /^[a-zA-Z0-9]$/.test(v) : /^[0-9]$/.test(v))) return;
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
    <div className={`flex flex-col items-center relative ${className}`} dir={direction}>
      <div className={`flex justify-center space-x-2 w-full ${pasteAnim ? 'animate-shake' : ''}`}>
        {[...Array(length)].map((_, i) => (
          <input
            key={i}
            ref={el => (inputRefs.current[i] = el)}
            type={allowAlphanumeric ? 'text' : 'tel'}
            maxLength={1}
            value={value[i] || ''}
            onFocus={e => handleFocus(i, e)}
            onBlur={() => setFocusedIndex(-1)}
            onChange={e => handleInputChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            autoComplete="one-time-code"
            inputMode={allowAlphanumeric ? 'text' : 'numeric'}
            pattern={allowAlphanumeric ? '[a-zA-Z0-9]*' : '[0-9]*'}
            aria-label={`OTP digit ${i + 1}`}
            className={`w-10 h-10 text-center text-lg font-bold border-2 rounded-lg focus:outline-none transition-all duration-200
              ${locked ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed' :
                localSuccess || success
                ? 'border-green-500 bg-green-50'
                : localError || error
                ? 'border-red-500 bg-red-50'
                : value[i]
                ? 'border-green-500 bg-green-50'
                : focusedIndex === i
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300'}
            `}
            placeholder={placeholder}
            disabled={loading || locked}
            autoCapitalize="off"
            spellCheck={false}
          />
        ))}
        {loading && (
          <div className="absolute flex items-center justify-center w-full h-full pointer-events-none top-0 left-0">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
          </div>
        )}
      </div>
      {/* Status Message Box (error/success/timer/info) */}
      {statusMessage && (
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 z-10 shadow-sm flex items-center justify-center
            rounded-md
            ${statusBoxColor.bg ? statusBoxColor.bg :
              statusType === 'error' ? 'bg-red-50' :
              statusType === 'success' ? 'bg-green-50' :
              statusType === 'timer' ? 'bg-blue-50' :
              'bg-gray-50'}
            ${statusBoxColor.border ? statusBoxColor.border :
              statusType === 'error' ? 'border border-red-200' :
              statusType === 'success' ? 'border border-green-200' :
              statusType === 'timer' ? 'border border-blue-200' :
              'border border-gray-200'}
          `}
          style={{ width: 'max-content', minWidth: 'auto', maxWidth: 260, padding: '0.25rem 1.25rem' }}
        >
          <p className={`text-xs font-medium text-center whitespace-nowrap px-2
            ${statusBoxColor.text ? statusBoxColor.text :
              statusType === 'error' ? 'text-red-600' :
              statusType === 'success' ? 'text-green-600' :
              statusType === 'timer' ? 'text-blue-600' :
              'text-gray-600'}
          `}>
            {statusMessage}
          </p>
        </div>
      )}
    </div>
  );
};

OtpInput.propTypes = {
  statusMessage: PropTypes.string,
  statusType: PropTypes.oneOf(['error', 'success', 'timer', 'info', '']),
  statusBoxColor: PropTypes.shape({
    bg: PropTypes.string,
    border: PropTypes.string,
    text: PropTypes.string,
  }),
  errorHighlightDuration: PropTypes.number,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onVerify: PropTypes.func,
  onComplete: PropTypes.func,
  error: PropTypes.bool,
  success: PropTypes.bool,
  loading: PropTypes.bool,
  length: PropTypes.number,
  className: PropTypes.string,
  focusOnErrorTrigger: PropTypes.any,
  allowAlphanumeric: PropTypes.bool,
  placeholder: PropTypes.string,
  locked: PropTypes.bool,
  autoSubmitOnComplete: PropTypes.bool,
  onAutoSubmit: PropTypes.func,
  direction: PropTypes.oneOf(['ltr', 'rtl']),
  i18n: PropTypes.object,
};
// Paste shake animation
// Add this to your global CSS or Tailwind config:
// .animate-shake { animation: shake 0.4s; }
// @keyframes shake { 0% { transform: translateX(0); } 20% { transform: translateX(-4px); } 40% { transform: translateX(4px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } 100% { transform: translateX(0); } }

export default OtpInput;
