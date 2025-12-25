/**
 * Profanity Filter Tests
 */

import { containsProfanity, filterProfanity, sanitizeInput } from './profanityFilter';

describe('Profanity Filter', () => {
  describe('containsProfanity', () => {
    test('detects basic profanity', () => {
      expect(containsProfanity('This is shit')).toBe(true);
      expect(containsProfanity('What the fuck')).toBe(true);
      expect(containsProfanity('You are an asshole')).toBe(true);
    });

    test('detects leetspeak variants', () => {
      expect(containsProfanity('sh1t')).toBe(true);
      expect(containsProfanity('fck')).toBe(true);
      expect(containsProfanity('a55')).toBe(true);
    });

    test('detects spaced variants', () => {
      expect(containsProfanity('f u c k')).toBe(true);
    });

    test('returns false for clean text', () => {
      expect(containsProfanity('Hello world')).toBe(false);
      expect(containsProfanity('This is a nice day')).toBe(false);
      expect(containsProfanity('Random number 42')).toBe(false);
    });

    test('handles empty or invalid input', () => {
      expect(containsProfanity('')).toBe(false);
      expect(containsProfanity(null)).toBe(false);
      expect(containsProfanity(undefined)).toBe(false);
      expect(containsProfanity(123)).toBe(false);
    });

    test('is case insensitive', () => {
      expect(containsProfanity('SHIT')).toBe(true);
      expect(containsProfanity('Fuck')).toBe(true);
      expect(containsProfanity('AsShOlE')).toBe(true);
    });
  });

  describe('filterProfanity', () => {
    test('replaces profanity with asterisks', () => {
      expect(filterProfanity('This is shit')).toBe('This is ****');
      expect(filterProfanity('What the fuck')).toBe('What the ****');
    });

    test('uses custom replacement character', () => {
      expect(filterProfanity('This is shit', '#')).toBe('This is ####');
    });

    test('leaves clean text unchanged', () => {
      expect(filterProfanity('Hello world')).toBe('Hello world');
      expect(filterProfanity('Nice day')).toBe('Nice day');
    });

    test('handles multiple profanities', () => {
      const result = filterProfanity('shit fuck damn');
      expect(result).toContain('****');
    });

    test('handles empty or invalid input', () => {
      expect(filterProfanity('')).toBe('');
      expect(filterProfanity(null)).toBe(null);
      expect(filterProfanity(undefined)).toBe(undefined);
    });
  });

  describe('sanitizeInput', () => {
    test('accepts clean input', () => {
      const result = sanitizeInput('Hello world');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe(null);
    });

    test('rejects input with profanity', () => {
      const result = sanitizeInput('This is shit');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('inappropriate');
      expect(result.sanitized).toBe('This is ****');
    });

    test('rejects input exceeding max length', () => {
      const longText = 'a'.repeat(101);
      const result = sanitizeInput(longText, 100);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('maximum length');
    });

    test('sanitizes HTML/XSS attempts', () => {
      const result = sanitizeInput('<script>alert("xss")</script>');
      expect(result.sanitized).not.toContain('<script>');
      expect(result.sanitized).toContain('&lt;');
      expect(result.sanitized).toContain('&gt;');
    });

    test('handles quotes and special characters', () => {
      const result = sanitizeInput('Test "quotes" and \'apostrophes\'');
      expect(result.sanitized).toContain('&quot;');
      expect(result.sanitized).toContain('&#x27;');
    });

    test('handles empty input', () => {
      const result = sanitizeInput('');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('');
    });

    test('handles null/undefined input', () => {
      expect(sanitizeInput(null).isValid).toBe(true);
      expect(sanitizeInput(undefined).isValid).toBe(true);
    });

    test('rejects non-string input', () => {
      const result = sanitizeInput(123);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be a string');
    });
  });
});
