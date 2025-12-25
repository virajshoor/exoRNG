/**
 * Random Number Generator Component
 * Generates random numbers with comprehensive safety features
 */

import React, { useState, useCallback, useEffect } from 'react';
import { validateNumber, validateRange } from '../utils/validation';
import { sanitizeInput } from '../utils/profanityFilter';
import useRateLimit from '../hooks/useRateLimit';
import './RandomNumberGenerator.css';

const RandomNumberGenerator = () => {
  // State management
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(999000);
  const [numberType, setNumberType] = useState('integer'); // 'integer' or 'float'
  const [generatedNumber, setGeneratedNumber] = useState(null);
  const [customLabel, setCustomLabel] = useState('');
  const [errors, setErrors] = useState({});
  const [showAnimation, setShowAnimation] = useState(false);
  const [history, setHistory] = useState([]);
  
  // Rate limiting: 100 generations per minute
  const { attempt, remaining, isLimited, resetAt } = useRateLimit(100, 60000);
  
  // Validate inputs on change
  useEffect(() => {
    const newErrors = {};
    
    // Validate min value
    const minValidation = validateNumber(minValue, {
      min: -1e15,
      max: 1e15,
      allowFloat: numberType === 'float',
    });
    if (!minValidation.isValid) {
      newErrors.min = minValidation.error;
    }
    
    // Validate max value
    const maxValidation = validateNumber(maxValue, {
      min: -1e15,
      max: 1e15,
      allowFloat: numberType === 'float',
    });
    if (!maxValidation.isValid) {
      newErrors.max = maxValidation.error;
    }
    
    // Validate range
    if (minValidation.isValid && maxValidation.isValid) {
      const rangeValidation = validateRange(minValue, maxValue);
      if (!rangeValidation.isValid) {
        newErrors.range = rangeValidation.error;
      }
    }
    
    // Validate custom label
    if (customLabel) {
      const labelValidation = sanitizeInput(customLabel, 50);
      if (!labelValidation.isValid) {
        newErrors.label = labelValidation.error;
      }
    }
    
    setErrors(newErrors);
  }, [minValue, maxValue, numberType, customLabel]);
  
  /**
   * Generate cryptographically secure random number
   */
  const generateSecureRandom = useCallback((min, max, isFloat) => {
    // Use Web Crypto API for secure random generation
    const randomBuffer = new Uint32Array(1);
    window.crypto.getRandomValues(randomBuffer);
    
    // Convert to value between 0 and 1
    const randomValue = randomBuffer[0] / (0xFFFFFFFF + 1);
    
    // Scale to desired range
    const result = min + randomValue * (max - min);
    
    return isFloat ? result : Math.floor(result);
  }, []);
  
  /**
   * Handle number generation with safety checks
   */
  const handleGenerate = useCallback(() => {
    // Check for validation errors
    if (Object.keys(errors).length > 0) {
      alert('Please fix the validation errors before generating a number.');
      return;
    }
    
    // Check rate limit
    const rateLimitResult = attempt();
    if (!rateLimitResult.allowed) {
      const timeRemaining = Math.ceil((resetAt - Date.now()) / 1000);
      alert(`Rate limit exceeded. Please wait ${timeRemaining} seconds before generating more numbers.`);
      return;
    }
    
    try {
      // Generate number with validation
      const min = Number(minValue);
      const max = Number(maxValue);
      const isFloat = numberType === 'float';
      
      // Final safety check
      if (isNaN(min) || isNaN(max) || min >= max) {
        throw new Error('Invalid range values');
      }
      
      // Generate secure random number
      const number = generateSecureRandom(min, max, isFloat);
      
      // Validate generated number
      const validation = validateNumber(number, {
        min: min,
        max: max,
        allowFloat: isFloat,
      });
      
      if (!validation.isValid) {
        throw new Error('Generated number failed validation');
      }
      
      // Format number for display
      const formattedNumber = isFloat ? number.toFixed(6) : number;
      
      // Update state
      setGeneratedNumber(formattedNumber);
      setShowAnimation(true);
      
      // Add to history (keep last 10)
      setHistory(prev => [
        {
          number: formattedNumber,
          type: numberType,
          min,
          max,
          timestamp: new Date().toISOString(),
          label: customLabel || null,
        },
        ...prev.slice(0, 9),
      ]);
      
      // Reset animation
      setTimeout(() => setShowAnimation(false), 500);
      
    } catch (error) {
      console.error('Error generating number:', error);
      alert('An error occurred while generating the number. Please try again.');
    }
  }, [minValue, maxValue, numberType, customLabel, errors, attempt, resetAt, generateSecureRandom]);
  
  /**
   * Handle input changes with validation
   */
  const handleMinChange = (e) => {
    const value = e.target.value;
    setMinValue(value === '' ? 0 : value);
  };
  
  const handleMaxChange = (e) => {
    const value = e.target.value;
    setMaxValue(value === '' ? 0 : value);
  };
  
  const handleLabelChange = (e) => {
    const value = e.target.value;
    setCustomLabel(value);
  };
  
  /**
   * Clear history
   */
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear the history?')) {
      setHistory([]);
    }
  };
  
  /**
   * Export history as JSON
   */
  const handleExportHistory = () => {
    if (history.length === 0) {
      alert('No history to export');
      return;
    }
    
    try {
      const dataStr = JSON.stringify(history, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rng-history-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting history:', error);
      alert('Failed to export history');
    }
  };
  
  return (
    <div className="rng-container">
      <div className="rng-header">
        <h1>Secure Random Number Generator</h1>
        <p className="rng-subtitle">With Built-in Safety Features &amp; Profanity Filter</p>
      </div>
      
      {/* Rate Limit Warning */}
      {remaining < 20 && (
        <div className="warning-banner">
          ⚠️ Warning: {remaining} generations remaining in this minute
        </div>
      )}
      
      {isLimited && (
        <div className="error-banner">
          🚫 Rate limit exceeded. Please wait {Math.ceil((resetAt - Date.now()) / 1000)} seconds.
        </div>
      )}
      
      {/* Main Content */}
      <div className="options-container">
        <h3>Random Number Options</h3>
        
        {/* Min Value Input */}
        <div className="form-row">
          <label htmlFor="minValue">Min Value:</label>
          <input
            type="number"
            id="minValue"
            value={minValue}
            onChange={handleMinChange}
            className={errors.min ? 'input-error' : ''}
            disabled={isLimited}
          />
          {errors.min && <span className="error-text">{errors.min}</span>}
        </div>
        
        {/* Max Value Input */}
        <div className="form-row">
          <label htmlFor="maxValue">Max Value:</label>
          <input
            type="number"
            id="maxValue"
            value={maxValue}
            onChange={handleMaxChange}
            className={errors.max ? 'input-error' : ''}
            disabled={isLimited}
          />
          {errors.max && <span className="error-text">{errors.max}</span>}
        </div>
        
        {/* Range Error */}
        {errors.range && (
          <div className="form-row">
            <span className="error-text error-text-full">{errors.range}</span>
          </div>
        )}
        
        {/* Number Type */}
        <div className="form-row">
          <label>Type:</label>
          <div className="radio-options-group">
            <div>
              <input
                type="radio"
                id="integer"
                name="numberType"
                value="integer"
                checked={numberType === 'integer'}
                onChange={(e) => setNumberType(e.target.value)}
                disabled={isLimited}
              />
              <label htmlFor="integer">Integer</label>
            </div>
            <div>
              <input
                type="radio"
                id="float"
                name="numberType"
                value="float"
                checked={numberType === 'float'}
                onChange={(e) => setNumberType(e.target.value)}
                disabled={isLimited}
              />
              <label htmlFor="float">Float</label>
            </div>
          </div>
        </div>
        
        {/* Custom Label (with profanity filter) */}
        <div className="form-row">
          <label htmlFor="customLabel">Label (Optional):</label>
          <input
            type="text"
            id="customLabel"
            value={customLabel}
            onChange={handleLabelChange}
            placeholder="e.g., Lucky Number"
            maxLength={50}
            className={errors.label ? 'input-error' : ''}
            disabled={isLimited}
          />
          {errors.label && <span className="error-text">{errors.label}</span>}
        </div>
        
        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={Object.keys(errors).length > 0 || isLimited}
          className="generate-button"
        >
          Generate Number
        </button>
      </div>
      
      {/* Generated Number Display */}
      {generatedNumber !== null && (
        <div className="result-container">
          <div className={`generated-number ${showAnimation ? 'number-animated' : ''}`}>
            {customLabel && <div className="number-label">{sanitizeInput(customLabel).sanitized}</div>}
            <div className="number-value">{generatedNumber}</div>
          </div>
        </div>
      )}
      
      {/* History Section */}
      {history.length > 0 && (
        <div className="history-container">
          <div className="history-header">
            <h3>History (Last 10)</h3>
            <div className="history-actions">
              <button onClick={handleExportHistory} className="btn-small">
                Export
              </button>
              <button onClick={handleClearHistory} className="btn-small btn-danger">
                Clear
              </button>
            </div>
          </div>
          <div className="history-list">
            {history.map((entry, index) => (
              <div key={index} className="history-item">
                <div className="history-number">{entry.number}</div>
                <div className="history-details">
                  {entry.label && <div className="history-label">{entry.label}</div>}
                  <div className="history-meta">
                    Range: {entry.min} - {entry.max} | Type: {entry.type}
                  </div>
                  <div className="history-time">
                    {new Date(entry.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Security Information */}
      <div className="security-info">
        <h4>🔒 Security Features</h4>
        <ul>
          <li>✅ Cryptographically secure random generation (Web Crypto API)</li>
          <li>✅ Input validation and sanitization</li>
          <li>✅ Profanity filter for text inputs</li>
          <li>✅ Rate limiting (100 generations per minute)</li>
          <li>✅ XSS protection</li>
          <li>✅ Error boundary protection</li>
        </ul>
      </div>
    </div>
  );
};

export default RandomNumberGenerator;
