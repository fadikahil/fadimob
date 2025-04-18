import { useState, useCallback } from 'react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

/**
 * Hook for showing toast notifications in the app
 */
export const useToast = () => {
  const [toast, setToast] = useState<ToastProps | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  /**
   * Show a toast notification
   */
  const showToast = useCallback(({ message, type = 'info', duration = 3000 }: ToastProps) => {
    // Hide any existing toast first
    if (visible) {
      setVisible(false);
      
      // Small delay to ensure animation completes
      setTimeout(() => {
        setToast({ message, type, duration });
        setVisible(true);
      }, 300);
    } else {
      setToast({ message, type, duration });
      setVisible(true);
    }
    
    // Auto-hide the toast after duration
    setTimeout(() => {
      setVisible(false);
    }, duration);
  }, [visible]);

  /**
   * Hide the current toast
   */
  const hideToast = useCallback(() => {
    setVisible(false);
  }, []);

  return {
    toast,
    visible,
    showToast,
    hideToast,
  };
};