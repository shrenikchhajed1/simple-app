import { useEffect, useState } from "react";

/**
 * Throttle hook: returns a throttled version of `value` that only updates
 * at most once every `delay` ms.
 */
export default function useThrottle(value, delay = 600) {
  const [throttled, setThrottled] = useState(value);

  useEffect(() => {
    const lastRan = { current: Date.now() };

    if (Date.now() - lastRan.current >= delay) {
      setThrottled(value);
      lastRan.current = Date.now();
    } else {
      const handler = setTimeout(() => {
        setThrottled(value);
        lastRan.current = Date.now();
      }, delay - (Date.now() - lastRan.current));

      return () => clearTimeout(handler);
    }
  }, [value, delay]);

  return throttled;
}
