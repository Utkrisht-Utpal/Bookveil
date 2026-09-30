import { useState, useEffect, useRef, useCallback } from 'react';

export function useAutoIdleToolbar(
  enabled: boolean = true,
  idleDelayMs: number = 3200,
  isPanelOpen: boolean = false
) {
  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    setIsVisible(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (enabled && !isPanelOpen) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, idleDelayMs);
    }
  }, [enabled, idleDelayMs, isPanelOpen]);

  useEffect(() => {
    if (isPanelOpen) {
      setIsVisible(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    const handleActivity = () => {
      resetTimer();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('keydown', handleActivity);

    resetTimer();

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resetTimer, isPanelOpen]);

  const toggleVisibility = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  return { isVisible, setIsVisible, toggleVisibility, resetTimer };
}
