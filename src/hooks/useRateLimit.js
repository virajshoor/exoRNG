/**
 * Rate Limiting Hook
 * Prevents abuse by limiting the number of operations per time window
 */

import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Custom hook for rate limiting
 * @param {number} maxAttempts - Maximum attempts allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {object} - { attempt, remaining, resetAt, isLimited }
 */
export const useRateLimit = (maxAttempts = 100, windowMs = 60000) => {
  const [attempts, setAttempts] = useState(0);
  const [resetAt, setResetAt] = useState(Date.now() + windowMs);
  const timerRef = useRef(null);
  
  // Reset counter after window expires
  useEffect(() => {
    const timeUntilReset = resetAt - Date.now();
    
    if (timeUntilReset > 0) {
      timerRef.current = setTimeout(() => {
        setAttempts(0);
        setResetAt(Date.now() + windowMs);
      }, timeUntilReset);
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [resetAt, windowMs]);
  
  const attempt = useCallback(() => {
    const now = Date.now();
    
    // Reset if window has expired
    if (now >= resetAt) {
      setAttempts(1);
      setResetAt(now + windowMs);
      return { allowed: true, remaining: maxAttempts - 1 };
    }
    
    // Check if limit exceeded
    if (attempts >= maxAttempts) {
      return { allowed: false, remaining: 0 };
    }
    
    // Increment attempts
    setAttempts(prev => prev + 1);
    return { allowed: true, remaining: maxAttempts - attempts - 1 };
  }, [attempts, maxAttempts, resetAt, windowMs]);
  
  const reset = useCallback(() => {
    setAttempts(0);
    setResetAt(Date.now() + windowMs);
  }, [windowMs]);
  
  const remaining = Math.max(0, maxAttempts - attempts);
  const isLimited = attempts >= maxAttempts && Date.now() < resetAt;
  
  return {
    attempt,
    reset,
    remaining,
    resetAt,
    isLimited,
    attempts,
  };
};

export default useRateLimit;
