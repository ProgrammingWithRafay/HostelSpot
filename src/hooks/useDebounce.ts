import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a rapidly changing value (e.g., search input keystrokes).
 * This delays the state update until the user has stopped typing for the specified delay,
 * preventing excessive API calls or expensive re-renders.
 * 
 * @template T The type of the value being debounced
 * @param {T} value - The dynamic value to debounce
 * @param {number} delay - The debounce delay in milliseconds
 * @returns {T} The debounced value, which updates only after the delay has passed
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: clears the timeout if the value or delay changes
    // This ensures the timeout is reset on every keystroke, achieving the debounce effect
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
