import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface RadioOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  description?: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  optionStyle?: StyleProp<ViewStyle>;
  radioStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  error?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
  label,
  style,
  containerStyle,
  optionStyle,
  radioStyle,
  labelStyle,
  error,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[
          styles.label, 
          { color: theme.colors.primary }, 
          labelStyle
        ]}>
          {label}
        </Text>
      )}
      
      <View style={[styles.radioGroup, containerStyle]}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.radioOption,
              { borderColor: value === option.value ? theme.colors.primary : theme.colors.gray[300] },
              optionStyle,
            ]}
            onPress={() => onChange(option.value)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.radio, 
              { borderColor: value === option.value ? theme.colors.primary : theme.colors.gray[300] },
              radioStyle,
            ]}>
              {value === option.value && (
                <View style={[styles.radioInner, { backgroundColor: theme.colors.primary }]} />
              )}
            </View>
            
            <View style={styles.radioContent}>
              <View style={styles.radioLabelContainer}>
                {option.icon && <View style={styles.radioIcon}>{option.icon}</View>}
                <Text style={[
                  styles.radioLabel, 
                  { color: theme.colors.gray[800] }
                ]}>
                  {option.label}
                </Text>
              </View>
              
              {option.description && (
                <Text style={[
                  styles.radioDescription, 
                  { color: theme.colors.gray[600] }
                ]}>
                  {option.description}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      {error && (
        <Text style={[
          styles.errorText, 
          { color: theme.colors.error }
        ]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  radioGroup: {
    width: '100%',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  radioContent: {
    flex: 1,
  },
  radioLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  radioIcon: {
    marginRight: 8,
  },
  radioDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default RadioGroup;