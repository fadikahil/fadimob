import React, { ReactNode, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Tabs: React.FC<TabsProps> = ({
  value,
  onValueChange,
  children,
  style,
}) => {
  return (
    <View style={[styles.tabsContainer, style]}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            value,
            onValueChange,
          });
        }
        return child;
      })}
    </View>
  );
};

interface TabsListProps {
  children: ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}

export const TabsList: React.FC<TabsListProps> = ({
  children,
  value,
  onValueChange,
  style,
}) => {
  const { theme } = useTheme();
  
  const childCount = React.Children.count(children);
  
  return (
    <View style={[
      styles.tabsListContainer,
      { backgroundColor: theme.colors.background },
      style,
    ]}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            value,
            onValueChange,
            style: { flex: 1 / childCount },
          });
        }
        return child;
      })}
    </View>
  );
};

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  triggerValue?: string;
  onValueChange?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  triggerValue,
  onValueChange,
  style,
  textStyle,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const isActive = value === triggerValue;
  
  const handlePress = () => {
    if (!disabled && onValueChange) {
      onValueChange(triggerValue || '');
    }
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.tabsTrigger,
        isActive && [
          styles.tabsTriggerActive,
          { borderBottomColor: theme.colors.primary }
        ],
        disabled && styles.tabsTriggerDisabled,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.tabsTriggerText,
          { 
            color: isActive 
              ? theme.colors.primary 
              : theme.colors.gray[600],
          },
          isActive && styles.tabsTriggerTextActive,
          disabled && { color: theme.colors.gray[400] },
          textStyle,
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

interface TabsContentProps {
  value: string;
  children: ReactNode;
  contentValue?: string;
  style?: StyleProp<ViewStyle>;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  contentValue,
  style,
}) => {
  if (value !== contentValue) {
    return null;
  }
  
  return (
    <View style={[styles.tabsContent, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    width: '100%',
  },
  tabsListContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 16,
  },
  tabsTrigger: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabsTriggerActive: {
    borderBottomWidth: 2,
  },
  tabsTriggerDisabled: {
    opacity: 0.5,
  },
  tabsTriggerText: {
    fontSize: 16,
    fontWeight: '500',
  },
  tabsTriggerTextActive: {
    fontWeight: '600',
  },
  tabsContent: {
    width: '100%',
  },
});

export default {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
};