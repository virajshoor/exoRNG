/**
 * Input Validation Utilities
 * Ensures safe and valid user inputs
 */

/**
 * Validates number input
 * @param {any} value - Value to validate
 * @param {object} options - Validation options
 * @returns {object} - { isValid, value, error }
 */
export const validateNumber = (value, options = {}) => {
  const {
    min = -Infinity,
    max = Infinity,
    allowFloat = true,
    required = false,
  } = options;
  
  // Check if value is provided when required
  if (required && (value === null || value === undefined || value === '')) {
    return { isValid: false, value: null, error: 'This field is required' };
  }
  
  // Allow empty non-required fields
  if (!required && (value === null || value === undefined || value === '')) {
    return { isValid: true, value: null, error: null };
  }
  
  // Convert to number
  const numValue = Number(value);
  
  // Check if it's a valid number
  if (isNaN(numValue)) {
    return { isValid: false, value: null, error: 'Please enter a valid number' };
  }
  
  // Check for infinity
  if (!isFinite(numValue)) {
    return { isValid: false, value: null, error: 'Number must be finite' };
  }
  
  // Check if float is allowed
  if (!allowFloat && !Number.isInteger(numValue)) {
    return { isValid: false, value: null, error: 'Only integers are allowed' };
  }
  
  // Check min/max bounds
  if (numValue < min) {
    return { isValid: false, value: numValue, error: `Value must be at least ${min}` };
  }
  
  if (numValue > max) {
    return { isValid: false, value: numValue, error: `Value must be at most ${max}` };
  }
  
  return { isValid: true, value: numValue, error: null };
};

/**
 * Validates range (min/max pair)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {object} - { isValid, error }
 */
export const validateRange = (min, max) => {
  if (min === null || min === undefined || max === null || max === undefined) {
    return { isValid: false, error: 'Both minimum and maximum values are required' };
  }
  
  const minNum = Number(min);
  const maxNum = Number(max);
  
  if (isNaN(minNum) || isNaN(maxNum)) {
    return { isValid: false, error: 'Please enter valid numbers' };
  }
  
  if (minNum >= maxNum) {
    return { isValid: false, error: 'Minimum must be less than maximum' };
  }
  
  // Reasonable bounds to prevent system abuse
  const SAFE_RANGE = 1e15; // 1 quadrillion
  if (Math.abs(maxNum - minNum) > SAFE_RANGE) {
    return { isValid: false, error: 'Range is too large for safe generation' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Security: Prevents timing attacks by using constant-time comparison
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {boolean} - True if strings are equal
 */
export const constantTimeCompare = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }
  
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
};

/**
 * Safely parses JSON input
 * @param {string} jsonString - JSON string to parse
 * @returns {object} - { success, data, error }
 */
export const safeJSONParse = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
};

/**
 * Rate limiting check
 * @param {string} key - Unique key for rate limiting
 * @param {number} maxAttempts - Maximum attempts allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {object} - { allowed, remaining, resetAt }
 */
const rateLimitStore = new Map();

export const checkRateLimit = (key, maxAttempts = 100, windowMs = 60000) => {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetAt) {
    // Create new record
    rateLimitStore.set(key, {
      attempts: 1,
      resetAt: now + windowMs,
    });
    return { allowed: true, remaining: maxAttempts - 1, resetAt: now + windowMs };
  }
  
  if (record.attempts >= maxAttempts) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }
  
  // Increment attempts
  record.attempts += 1;
  rateLimitStore.set(key, record);
  
  return { allowed: true, remaining: maxAttempts - record.attempts, resetAt: record.resetAt };
};

/**
 * Clears rate limit for a key (useful for testing)
 * @param {string} key - Key to clear
 */
export const clearRateLimit = (key) => {
  rateLimitStore.delete(key);
};

export default {
  validateNumber,
  validateRange,
  constantTimeCompare,
  safeJSONParse,
  checkRateLimit,
  clearRateLimit,
};
