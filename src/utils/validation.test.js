/**
 * Validation Utilities Tests
 */

import { validateNumber, validateRange, constantTimeCompare, safeJSONParse } from './validation';

describe('Validation Utilities', () => {
  describe('validateNumber', () => {
    test('accepts valid integers', () => {
      const result = validateNumber(42);
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(42);
      expect(result.error).toBe(null);
    });

    test('accepts valid floats', () => {
      const result = validateNumber(3.14, { allowFloat: true });
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(3.14);
    });

    test('rejects floats when integers required', () => {
      const result = validateNumber(3.14, { allowFloat: false });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('integers');
    });

    test('enforces minimum value', () => {
      const result = validateNumber(5, { min: 10 });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at least');
    });

    test('enforces maximum value', () => {
      const result = validateNumber(15, { max: 10 });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at most');
    });

    test('rejects non-numeric values', () => {
      expect(validateNumber('abc').isValid).toBe(false);
      expect(validateNumber('abc').error).toContain('valid number');
    });

    test('rejects infinity', () => {
      const result = validateNumber(Infinity);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('finite');
    });

    test('rejects NaN', () => {
      const result = validateNumber(NaN);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('valid number');
    });

    test('handles required field validation', () => {
      const result = validateNumber(null, { required: true });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('required');
    });

    test('allows empty non-required fields', () => {
      const result = validateNumber(null, { required: false });
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(null);
    });

    test('converts string numbers', () => {
      const result = validateNumber('42');
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(42);
    });
  });

  describe('validateRange', () => {
    test('accepts valid ranges', () => {
      const result = validateRange(0, 100);
      expect(result.isValid).toBe(true);
      expect(result.error).toBe(null);
    });

    test('rejects when min >= max', () => {
      const result = validateRange(100, 50);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('less than');
    });

    test('rejects when min equals max', () => {
      const result = validateRange(50, 50);
      expect(result.isValid).toBe(false);
    });

    test('rejects excessively large ranges', () => {
      const result = validateRange(0, 1e16);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('too large');
    });

    test('handles negative ranges', () => {
      const result = validateRange(-100, 100);
      expect(result.isValid).toBe(true);
    });

    test('rejects non-numeric values', () => {
      expect(validateRange('a', 'b').isValid).toBe(false);
      expect(validateRange(null, 100).isValid).toBe(false);
    });
  });

  describe('constantTimeCompare', () => {
    test('returns true for equal strings', () => {
      expect(constantTimeCompare('hello', 'hello')).toBe(true);
      expect(constantTimeCompare('test123', 'test123')).toBe(true);
    });

    test('returns false for different strings', () => {
      expect(constantTimeCompare('hello', 'world')).toBe(false);
      expect(constantTimeCompare('test', 'TEST')).toBe(false);
    });

    test('returns false for different lengths', () => {
      expect(constantTimeCompare('hello', 'hello world')).toBe(false);
      expect(constantTimeCompare('hi', 'hello')).toBe(false);
    });

    test('handles empty strings', () => {
      expect(constantTimeCompare('', '')).toBe(true);
      expect(constantTimeCompare('', 'test')).toBe(false);
    });

    test('handles non-string inputs', () => {
      expect(constantTimeCompare(null, 'test')).toBe(false);
      expect(constantTimeCompare(123, 456)).toBe(false);
    });
  });

  describe('safeJSONParse', () => {
    test('parses valid JSON', () => {
      const result = safeJSONParse('{"name":"John","age":30}');
      expect(result.success).toBe(true);
      expect(result.data.name).toBe('John');
      expect(result.data.age).toBe(30);
      expect(result.error).toBe(null);
    });

    test('handles invalid JSON', () => {
      const result = safeJSONParse('{invalid json}');
      expect(result.success).toBe(false);
      expect(result.data).toBe(null);
      expect(result.error).toBeTruthy();
    });

    test('handles arrays', () => {
      const result = safeJSONParse('[1,2,3]');
      expect(result.success).toBe(true);
      expect(result.data).toEqual([1, 2, 3]);
    });

    test('handles primitives', () => {
      expect(safeJSONParse('42').data).toBe(42);
      expect(safeJSONParse('"hello"').data).toBe('hello');
      expect(safeJSONParse('true').data).toBe(true);
      expect(safeJSONParse('null').data).toBe(null);
    });

    test('handles empty string', () => {
      const result = safeJSONParse('');
      expect(result.success).toBe(false);
    });
  });
});
