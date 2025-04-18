import React, { createContext, useState, useContext, useRef, useCallback, useEffect } from 'react';
import { StyleSheet, Animated, Text, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW, FONT_FAMILY } from '@/utils/theme';

// Toast types
type ToastType = 'success' | 'error' | 'info' | 'warning';

// Toast data structure
interface ToastData {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// Context interface
interface ToastContextProps {
  showToast: (params: { message: string; type: ToastType; duration?: number }) => void;
  hideToast: (id: string) => void;
}

// Create context with default values
const ToastContext = createContext<ToastContextProps>({
  showToast: () => {},
  hideToast: () => {},
});

// Toast item component
const Toast: React.FC<{
  toast: ToastData;
  onHide: () => void;
  style?: any;
}> = ({ toast, onHide, style }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;
  
  // Get icon and background color based on toast type
  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: COLORS.SUCCESS,
          textColor: '#FFFFFF',
        };
      case 'error':
        return {
          backgroundColor: COLORS.ERROR,
          textColor: '#FFFFFF',
        };
      case 'warning':
        return {
          backgroundColor: COLORS.WARNING,
          textColor: '#000000',
        };
      case 'info':
      default:
        return {
          backgroundColor: COLORS.INFO,
          textColor: '#FFFFFF',
        };
    }
  };

  const { backgroundColor, textColor } = getToastStyles(toast.type);

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Automatically dismiss after duration
    const timeout = setTimeout(() => {
      hideToast();
    }, toast.duration || 3000);

    return () => clearTimeout(timeout);
  }, [fadeAnim, translateY, toast.duration]);

  const hideToast = () => {
    // Animate out
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          backgroundColor,
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
        style,
      ]}
    >
      <View style={styles.contentContainer}>
        <Text style={[styles.messageText, { color: textColor }]}>{toast.message}</Text>
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={hideToast}>
        <Text style={[styles.closeText, { color: textColor }]}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Provider component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const insets = useSafeAreaInsets();

  // Generate unique id for each toast
  const generateId = () => `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Show a new toast notification
  const showToast = useCallback(
    ({ message, type, duration = 3000 }: { message: string; type: ToastType; duration?: number }) => {
      const id = generateId();
      setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);
    },
    []
  );

  // Hide a specific toast by id
  const hideToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <View
        style={[
          styles.toastsWrapper,
          {
            paddingTop: insets.top + SPACING.SMALL,
            paddingBottom: insets.bottom + SPACING.SMALL,
            paddingLeft: insets.left + SPACING.SMALL,
            paddingRight: insets.right + SPACING.SMALL,
          },
        ]}
        pointerEvents="box-none"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onHide={() => hideToast(toast.id)} />
        ))}
      </View>
    </ToastContext.Provider>
  );
};

// Hook to use the toast context
export const useToast = () => useContext(ToastContext);

// Styles
const styles = StyleSheet.create({
  toastsWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: 'center',
  },
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: BORDER_RADIUS.MEDIUM,
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.SMALL,
    marginBottom: SPACING.SMALL,
    width: '100%',
    maxWidth: 500,
    ...SHADOW.MEDIUM,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageText: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONT_FAMILY.MEDIUM,
  },
  closeButton: {
    marginLeft: SPACING.SMALL,
    padding: SPACING.TINY,
  },
  closeText: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.MEDIUM,
  },
});

export default ToastContext;