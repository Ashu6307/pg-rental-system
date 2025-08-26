// Console utility for production-ready logging
export const devLog = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

export const devWarn = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(...args);
  }
};

export const devError = (...args) => {
  // Always show errors but with less detail in production
  if (process.env.NODE_ENV === 'development') {
    console.error(...args);
  } else {
    console.error('An error occurred'); // Generic message for production
  }
};

// Disable console.log in production globally
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.warn = () => {};
  // Keep console.error for critical issues
}
