/**
 * Profanity Filter Utility
 * Filters inappropriate content and maintains a safe user experience
 */

// Common profanity list (sanitized for code - add more as needed)
const profanityList = [
  'damn', 'hell', 'crap', 'piss', 'bastard', 'bitch', 'ass',
  'dick', 'cock', 'pussy', 'shit', 'fuck', 'motherfucker',
  'asshole', 'whore', 'slut', 'fag', 'faggot', 'nigger', 'nigga',
  'cunt', 'twat', 'wanker', 'bollocks', 'prick', 'douche',
  // Add leetspeak variants
  'f*ck', 'sh!t', 'b!tch', 'a$$', 'd!ck', 'fuk', 'fuc',
  'fck', 'fcuk', 'phuck', 'phuk', 'shyt', 'shiit', 'azz',
  // Common obfuscations
  'f u c k', 'sh1t', 'b1tch', 'a55', 'f@ck', 'sh@t',
];

/**
 * Checks if text contains profanity
 * @param {string} text - Text to check
 * @returns {boolean} - True if profanity is detected
 */
export const containsProfanity = (text) => {
  if (!text || typeof text !== 'string') return false;
  
  const normalizedText = text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special chars
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
  
  // Check for exact matches and word boundaries
  return profanityList.some(word => {
    const wordRegex = new RegExp(`\\b${word}\\b`, 'i');
    return wordRegex.test(normalizedText) || normalizedText.includes(word);
  });
};

/**
 * Filters profanity from text
 * @param {string} text - Text to filter
 * @param {string} replacement - Replacement character (default: *)
 * @returns {string} - Filtered text
 */
export const filterProfanity = (text, replacement = '*') => {
  if (!text || typeof text !== 'string') return text;
  
  let filteredText = text;
  
  profanityList.forEach(word => {
    const wordRegex = new RegExp(`\\b${word}\\b`, 'gi');
    filteredText = filteredText.replace(wordRegex, replacement.repeat(word.length));
  });
  
  return filteredText;
};

/**
 * Validates and sanitizes user input
 * @param {string} input - User input to sanitize
 * @param {number} maxLength - Maximum allowed length
 * @returns {object} - { isValid, sanitized, error }
 */
export const sanitizeInput = (input, maxLength = 100) => {
  if (!input) {
    return { isValid: true, sanitized: '', error: null };
  }
  
  if (typeof input !== 'string') {
    return { isValid: false, sanitized: '', error: 'Input must be a string' };
  }
  
  // Check length
  if (input.length > maxLength) {
    return { 
      isValid: false, 
      sanitized: input.slice(0, maxLength), 
      error: `Input exceeds maximum length of ${maxLength} characters` 
    };
  }
  
  // Check for profanity
  if (containsProfanity(input)) {
    return { 
      isValid: false, 
      sanitized: filterProfanity(input), 
      error: 'Input contains inappropriate language' 
    };
  }
  
  // Basic XSS prevention
  const sanitized = input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
  
  return { isValid: true, sanitized, error: null };
};

export default {
  containsProfanity,
  filterProfanity,
  sanitizeInput,
};
