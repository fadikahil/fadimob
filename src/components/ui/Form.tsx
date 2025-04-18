import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface FormProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onSubmit?: () => void;
}

export const Form: React.FC<FormProps> = ({ children, style, onSubmit }) => {
  return (
    <View style={[styles.form, style]}>
      {children}
    </View>
  );
};

interface FormItemProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const FormItem: React.FC<FormItemProps> = ({ children, style }) => {
  return (
    <View style={[styles.formItem, style]}>
      {children}
    </View>
  );
};

interface FormErrorProps {
  message?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <View style={styles.errorContainer}>
      {/* Error component will be rendered by the Input itself */}
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    width: '100%',
  },
  formItem: {
    marginBottom: 16,
  },
  errorContainer: {
    marginTop: 4,
  },
});

export default { Form, FormItem, FormError };