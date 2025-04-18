import React from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useToast } from '../../contexts/ToastContext';
import { useTheme } from '../../contexts/ThemeContext';

const Toast: React.FC = () => {
  const { activeToasts, dismiss } = useToast();
  const { theme } = useTheme();

  if (activeToasts.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {activeToasts.map((toast) => {
        const backgroundColor = 
          toast.variant === 'destructive' ? theme.colors.error :
          toast.variant === 'success' ? theme.colors.success :
          theme.colors.primary;

        const iconName = 
          toast.variant === 'destructive' ? 'alert-circle' :
          toast.variant === 'success' ? 'checkmark-circle' :
          'information-circle';

        return (
          <Animated.View 
            key={toast.id}
            style={[
              styles.toast,
              { backgroundColor }
            ]}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={iconName} size={22} color="white" />
            </View>
            <View style={styles.contentContainer}>
              {toast.title && (
                <Text style={styles.title}>{toast.title}</Text>
              )}
              {toast.description && (
                <Text style={styles.description}>{toast.description}</Text>
              )}
            </View>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => dismiss(toast.id)}
            >
              <Ionicons name="close" size={18} color="white" />
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    width: '90%',
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 2,
  },
  description: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
  closeButton: {
    padding: 4,
  },
});

export default Toast;