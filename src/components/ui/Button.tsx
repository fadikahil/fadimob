import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_FAMILY } from '@/utils/theme';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  startIcon,
  endIcon,
  style,
  textStyle,
  testID,
}) => {
  // Container styles based on variant
  const getContainerStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryContainer;
      case 'secondary':
        return styles.secondaryContainer;
      case 'outline':
        return styles.outlineContainer;
      case 'text':
        return styles.textContainer;
      default:
        return styles.primaryContainer;
    }
  };

  // Text styles based on variant
  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'text':
        return styles.textText;
      default:
        return styles.primaryText;
    }
  };

  // Size styles
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallSize;
      case 'medium':
        return styles.mediumSize;
      case 'large':
        return styles.largeSize;
      default:
        return styles.mediumSize;
    }
  };

  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallText;
      case 'medium':
        return styles.mediumText;
      case 'large':
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.baseContainer,
        getContainerStyle(),
        getSizeStyle(),
        disabled && styles.disabledContainer,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? 'white' : COLORS.PRIMARY}
        />
      ) : (
        <>
          {startIcon}
          <Text
            style={[
              styles.baseText,
              getTextStyle(),
              getTextSizeStyle(),
              disabled && styles.disabledText,
              startIcon && { marginLeft: SPACING.SMALL },
              endIcon && { marginRight: SPACING.SMALL },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {endIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.MEDIUM,
  },
  primaryContainer: {
    backgroundColor: COLORS.PRIMARY,
  },
  secondaryContainer: {
    backgroundColor: COLORS.SECONDARY,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },
  textContainer: {
    backgroundColor: 'transparent',
  },
  disabledContainer: {
    opacity: 0.6,
  },
  smallSize: {
    paddingVertical: SPACING.TINY,
    paddingHorizontal: SPACING.SMALL,
  },
  mediumSize: {
    paddingVertical: SPACING.SMALL,
    paddingHorizontal: SPACING.MEDIUM,
  },
  largeSize: {
    paddingVertical: SPACING.MEDIUM,
    paddingHorizontal: SPACING.LARGE,
  },
  baseText: {
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: FONT_FAMILY.MEDIUM,
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: COLORS.PRIMARY,
  },
  outlineText: {
    color: COLORS.PRIMARY,
  },
  textText: {
    color: COLORS.PRIMARY,
  },
  disabledText: {
    opacity: 0.8,
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
});