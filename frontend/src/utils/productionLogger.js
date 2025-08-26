// Production Logger Configuration
const isDevelopment = process.env.NODE_ENV === 'development';

class ProductionLogger {
  static log(...args) {
    if (isDevelopment) {
      console.log(...args);
    }
  }

  static debug(...args) {
    if (isDevelopment) {
      console.debug(...args);
    }
  }

  static warn(...args) {
    console.warn(...args);
  }

  static error(...args) {
    console.error(...args);
  }

  static info(...args) {
    console.info(...args);
  }
}

// Replace console methods in production
if (!isDevelopment) {
  // Override console.log in production to prevent debug output
  console.log = () => {};
  console.debug = () => {};
}

export default ProductionLogger;
