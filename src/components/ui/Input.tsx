import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  StyleProp,
  TextInputProps,
  Platform,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_FAMILY, SHADOW } from '@/utils/theme';

export interface InputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  touched?: boolean;
  helper?: string;
  secure?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  placeholderTextColor?: string;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  testID?: string;
  onBlur?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  touched,
  helper,
  secure = false,
  leftIcon,
  rightIcon,
  style,
  inputStyle,
  labelStyle,
  placeholderTextColor,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  testID,
  onBlur,
  ...rest
}) => {
  const [secureTextEntry, setSecureTextEntry] = useState(secure);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) {
      onBlur();
    }
  };

  // Determine if we should show an error
  const showError = error && touched;

  // Toggle password visibility
  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  // Allow space for icons
  const paddingLeft = leftIcon ? SPACING.XLARGE : SPACING.MEDIUM;
  const paddingRight = rightIcon || secure ? SPACING.XLARGE : SPACING.MEDIUM;

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, showError && styles.errorLabel, labelStyle]}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer,
        isFocused && styles.focusedContainer,
        showError && styles.errorContainer,
      ]}>
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            {
              paddingLeft,
              paddingRight,
              height: multiline ? (numberOfLines * 20) : undefined,
              textAlignVertical: multiline ? 'top' : 'center',
            },
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor || COLORS.TEXT_MUTED}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : undefined}
          maxLength={maxLength}
          onFocus={handleFocus}
          onBlur={handleBlur}
          testID={testID}
          {...rest}
        />
        
        {secure && (
          <TouchableOpacity 
            style={styles.rightIconContainer} 
            onPress={toggleSecureEntry}
            activeOpacity={0.7}
          >
            <Text style={styles.toggleText}>
              {secureTextEntry ? 'Show' : 'Hide'}
            </Text>
          </TouchableOpacity>
        )}
        
        {rightIcon && !secure && (
          <View style={styles.rightIconContainer}>{rightIcon}</View>
        )}
      </View>
      
      {(showError || helper) && (
        <Text style={[styles.helperText, showError && styles.errorText]}>
          {showError ? error : helper}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.MEDIUM,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: SPACING.TINY,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILY.MEDIUM,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CARD,
    borderRadius: BORDER_RADIUS.MEDIUM,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    ...Platform.select({
      ios: SHADOW.SMALL,
      android: {},
    }),
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILY.REGULAR,
  },
  focusedContainer: {
    borderColor: COLORS.PRIMARY,
  },
  errorContainer: {
    borderColor: COLORS.ERROR,
  },
  errorLabel: {
    color: COLORS.ERROR,
  },
  helperText: {
    fontSize: 12,
    marginTop: SPACING.TINY,
    color: COLORS.TEXT_MUTED,
    fontFamily: FONT_FAMILY.REGULAR,
  },
  errorText: {
    color: COLORS.ERROR,
  },
  leftIconContainer: {
    position: 'absolute',
    left: SPACING.SMALL,
    zIndex: 1,
  },
  rightIconContainer: {
    position: 'absolute',
    right: SPACING.SMALL,
    zIndex: 1,
  },
  toggleText: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILY.MEDIUM,
  },
});