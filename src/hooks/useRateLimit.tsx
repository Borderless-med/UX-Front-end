
import { useState, useRef } from 'react';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs?: number;
}

export const useRateLimit = (config: RateLimitConfig) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const attemptsRef = useRef<number[]>([]);
  const blockUntilRef = useRef<number>(0);

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    
    // Check if currently blocked
    if (blockUntilRef.current > now) {
      setIsBlocked(true);
      return false;
    }
    
    // Remove old attempts outside the window
    attemptsRef.current = attemptsRef.current.filter(
      timestamp => now - timestamp < config.windowMs
    );
    
    // Check if we've exceeded the limit
    if (attemptsRef.current.length >= config.maxAttempts) {
      // Block for the specified duration
      blockUntilRef.current = now + (config.blockDurationMs || config.windowMs);
      setIsBlocked(true);
      return false;
    }
    
    // Record this attempt
    attemptsRef.current.push(now);
    setIsBlocked(false);
    return true;
  };

  const getRemainingTime = (): number => {
    const now = Date.now();
    return Math.max(0, blockUntilRef.current - now);
  };

  const reset = () => {
    attemptsRef.current = [];
    blockUntilRef.current = 0;
    setIsBlocked(false);
  };

  return {
    checkRateLimit,
    isBlocked,
    getRemainingTime,
    reset,
    attemptsRemaining: Math.max(0, config.maxAttempts - attemptsRef.current.length)
  };
};
