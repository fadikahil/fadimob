import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING, SHADOW } from '@/utils/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

interface TouchableCardProps extends CardProps {
  onPress: () => void;
  activeOpacity?: number;
}

export const Card: React.FC<CardProps> = ({ children, style, testID }) => {
  return (
    <View style={[styles.card, style]} testID={testID}>
      {children}
    </View>
  );
};

export const TouchableCard: React.FC<TouchableCardProps> = ({
  children,
  style,
  onPress,
  activeOpacity = 0.7,
  testID,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={activeOpacity}
      testID={testID}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.CARD,
    borderRadius: BORDER_RADIUS.MEDIUM,
    padding: SPACING.MEDIUM,
    ...SHADOW.SMALL,
  },
});