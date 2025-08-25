// Production console override - disable console logs in production
if (process.env.NODE_ENV === 'production') {
  // Store original console methods
  const originalLog = console.log;
  const originalWarn = console.warn;
  
  // Override console.log and console.warn in production
  console.log = () => {};
  console.warn = () => {};
  
  // Keep console.error for critical issues
  // Keep console.info for important messages
}

// Also disable in development if needed for cleaner output
const disableAllLogs = true; // Set to true to disable all logs even in development

if (disableAllLogs) {
  console.log = () => {};
  console.warn = () => {};
}

// Development-only logging utilities
export const devLog = (...args) => {
  if (process.env.NODE_ENV === 'development' && !disableAllLogs) {
    console.log(...args);
  }
};

export const devWarn = (...args) => {
  if (process.env.NODE_ENV === 'development' && !disableAllLogs) {
    console.warn(...args);
  }
};
