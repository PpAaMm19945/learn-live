import { useState, useEffect, useCallback, useRef } from 'react';

export function useAutoHide(timeoutMs = 3000) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);

  const show = useCallback(() => {
    setIsVisible(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(hide, timeoutMs);
  }, [hide, timeoutMs]);

  const toggle = useCallback(() => {
    if (isVisible) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      hide();
    } else {
      show();
    }
  }, [isVisible, hide, show]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { isVisible, show, hide, toggle };
}
