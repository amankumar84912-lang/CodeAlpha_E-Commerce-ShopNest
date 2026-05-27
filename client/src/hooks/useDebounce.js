import { useState, useEffect } from "react";

/**
 * useDebounce — delays updating a value until after `delay` ms of no changes.
 * Prevents API calls / expensive operations on every keystroke.
 *
 * @param {*}      value  - The value to debounce (typically a search string)
 * @param {number} delay  - Delay in ms (default 300ms)
 * @returns debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
