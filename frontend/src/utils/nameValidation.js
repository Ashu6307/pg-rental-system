// Name validation utility functions

/**
 * Validates if a name contains only letters and spaces
 * Min 4-5 chars, Max 20 chars, No special chars, No numbers
 * @param {string} name - The name to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidName = (name) => {
  if (!name || typeof name !== 'string') return false;
  
  // Only allow letters (a-z, A-Z) and spaces - No special chars, No numbers
  const nameRegex = /^[a-zA-Z\s]+$/;
  
  const trimmedName = name.trim();
  
  // Check if name matches regex (only letters and spaces)
  if (!nameRegex.test(trimmedName)) {
    return false;
  }
  
  // Check length (minimum 4 characters, maximum 20 characters)
  if (trimmedName.length < 4 || trimmedName.length > 20) {
    return false;
  }
  
  // Check for consecutive spaces
  if (/\s{2,}/.test(trimmedName)) {
    return false;
  }
  
  // Name should not start or end with space
  if (trimmedName !== name.trim()) {
    return false;
  }
  
  return true;
};

/**
 * Gets name validation error message
 * @param {string} name - The name to validate
 * @returns {string} - Error message or empty string if valid
 */
export const getNameValidationError = (name) => {
  if (!name || !name.trim()) {
    return 'Name is required';
  }
  
  const trimmedName = name.trim();
  
  if (trimmedName.length < 4) {
    return 'Name must be at least 4 characters long';
  }
  
  if (trimmedName.length > 20) {
    return 'Name must not exceed 20 characters';
  }
  
  // Check for numbers
  if (/\d/.test(trimmedName)) {
    return 'Numbers are not allowed in name';
  }
  
  // Check for special characters (except spaces)
  if (/[^a-zA-Z\s]/.test(trimmedName)) {
    return 'Only letters and spaces are allowed';
  }
  
  // Check for consecutive spaces
  if (/\s{2,}/.test(trimmedName)) {
    return 'Multiple consecutive spaces not allowed';
  }
  
  return '';
};

/**
 * Formats name: First letter capital, rest small, after space again capital
 * Example: "ashUtosh kuMAr" → "Ashutosh Kumar"
 * @param {string} name - The name to format
 * @returns {string} - Formatted name with proper capitalization
 */
export const formatName = (name) => {
  if (!name) return '';
  
  return name
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .split(' ')
    .map(word => {
      if (word.length === 0) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

/**
 * Filters input to only allow valid name characters (letters and spaces only)
 * Automatically removes numbers and special characters while typing
 * Prevents space at beginning and formats in real-time
 * @param {string} input - The input to filter
 * @returns {string} - Filtered and formatted input (real-time capitalization)
 */
export const filterNameInput = (input) => {
  if (!input) return '';
  
  // Remove numbers and special characters, keep only letters and spaces
  let filtered = input
    .replace(/[^a-zA-Z\s]/g, '') // Remove everything except letters and spaces
    .replace(/^\s+/, '') // Remove leading spaces (prevent space at start)
    .replace(/\s+/g, ' '); // Replace multiple spaces with single space
  
  // Real-time capitalization while typing
  filtered = filtered
    .split(' ')
    .map(word => {
      if (word.length === 0) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
  
  return filtered;
};

/**
 * Handles name input change with real-time validation and formatting
 * Real-time capitalization और space handling
 * @param {string} value - Input value
 * @param {function} setter - State setter function
 * @param {function} errorSetter - Error state setter function
 * @returns {string} - Processed value
 */
export const handleNameChange = (value, setter, errorSetter) => {
  // First filter invalid characters and apply real-time formatting
  const filteredValue = filterNameInput(value);
  
  // Set the filtered and formatted value
  setter(filteredValue);
  
  // Validate and set error if needed
  const error = getNameValidationError(filteredValue);
  if (errorSetter) {
    errorSetter(error);
  }
  
  return filteredValue;
};
