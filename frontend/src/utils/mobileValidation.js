// Indian Mobile Number Validation Utility
export const validateIndianMobile = (mobile) => {
  if (!mobile) return false;
  
  // Remove all spaces, dashes, and special characters
  const cleaned = mobile.replace(/[\s\-\(\)]/g, '');
  
  // Check different formats
  const patterns = [
    /^[6-9]\d{9}$/,           // 1234567890
    /^\+91[6-9]\d{9}$/,       // +911234567890
    /^91[6-9]\d{9}$/,         // 911234567890
    /^0[6-9]\d{9}$/           // 01234567890
  ];
  
  return patterns.some(pattern => pattern.test(cleaned));
};

// Format phone number for display
export const formatPhoneNumber = (value) => {
  if (!value) return '';
  
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  // Handle country code
  if (digits.startsWith('91') && digits.length > 11) {
    return digits.slice(0, 12);
  } else if (digits.startsWith('0') && digits.length > 11) {
    return digits.slice(0, 11);
  } else if (digits.length > 10) {
    return digits.slice(0, 10);
  }
  
  return digits;
};

// Get normalized mobile number (10 digits only)
export const getNormalizedMobile = (mobile) => {
  if (!mobile) return '';
  
  const cleaned = mobile.replace(/[\s\-\(\)]/g, '');
  
  // Extract 10-digit number
  if (cleaned.startsWith('+91')) {
    return cleaned.slice(3);
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    return cleaned.slice(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    return cleaned.slice(1);
  } else if (cleaned.length === 10) {
    return cleaned;
  }
  
  return cleaned;
};

// Check if mobile number is valid Indian format
export const isValidIndianMobile = (mobile) => {
  const normalized = getNormalizedMobile(mobile);
  return /^[6-9]\d{9}$/.test(normalized);
};
