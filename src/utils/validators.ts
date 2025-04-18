// Form validation utilities

/**
 * Validates an email address
 * @param email Email string to validate
 * @returns Boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a username
 * @param username Username to validate
 * @returns Boolean indicating if username is valid
 */
export const isValidUsername = (username: string): boolean => {
  // Username must be 3-20 characters and can contain letters, numbers, underscores, and hyphens
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Validates a password
 * @param password Password to validate
 * @returns Boolean indicating if password is valid
 */
export const isValidPassword = (password: string): boolean => {
  // Password must be at least 8 characters long
  return password.length >= 8;
};

/**
 * Validates a Lebanese phone number
 * @param phone Phone number to validate
 * @returns Boolean indicating if phone number is valid
 */
export const isValidLebanesePhone = (phone: string): boolean => {
  // Remove any spaces, dashes, or parentheses
  const cleanedPhone = phone.replace(/[\s\-()]/g, '');
  
  // Check for Lebanese phone format
  // Format can be: +961XXXXXXXX, 961XXXXXXXX, 03XXXXXX, or 3XXXXXX
  const phoneRegex1 = /^(\+?961|0)?[1-9]\d{6,7}$/;
  
  return phoneRegex1.test(cleanedPhone);
};

/**
 * Formats a phone number with the Lebanese format
 * @param phone Phone number to format
 * @returns Formatted phone number
 */
export const formatLebanesePhone = (phone: string): string => {
  // Remove any non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Check if the number starts with the country code
  if (digits.startsWith('961')) {
    // Format: +961 xx xxxxxx
    const areaCode = digits.substring(3, 5);
    const number = digits.substring(5);
    return `+961 ${areaCode} ${number}`;
  } else if (digits.startsWith('0')) {
    // Format: 0x xxxxxx
    const areaCode = digits.substring(1, 2);
    const number = digits.substring(2);
    return `0${areaCode} ${number}`;
  } else {
    // Just return the cleaned number
    return digits;
  }
};

/**
 * Validates that a value is not empty
 * @param value Value to check
 * @returns Boolean indicating if value is not empty
 */
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validation error messages
 */
export const ValidationMessages = {
  REQUIRED: 'This field is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  USERNAME_INVALID: 'Username must be 3-20 characters and can contain only letters, numbers, underscores, and hyphens',
  PASSWORD_SHORT: 'Password must be at least 8 characters long',
  PASSWORD_MISMATCH: 'Passwords do not match',
  PHONE_INVALID: 'Please enter a valid Lebanese phone number',
  CATEGORIES_REQUIRED: 'Please select at least one category',
  LOCATION_REQUIRED: 'Please select a location',
};