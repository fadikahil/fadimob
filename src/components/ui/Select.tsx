import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleProp,
  ViewStyle,
  TextStyle,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  triggerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  placeholder = 'Select an option',
  options,
  value,
  onChange,
  error,
  containerStyle,
  triggerStyle,
  labelStyle,
  valueStyle,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const { height } = Dimensions.get('window');

  const selectedOption = options.find(option => option.value === value);

  const toggleSelect = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (option: SelectOption) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[
          styles.label, 
          { color: theme.colors.primary }, 
          labelStyle
        ]}>
          {label}
        </Text>
      )}
      
      <TouchableOpacity
        style={[
          styles.trigger,
          {
            borderColor: error
              ? theme.colors.error
              : theme.colors.gray[300],
            backgroundColor: disabled ? theme.colors.gray[100] : theme.colors.white,
          },
          triggerStyle,
        ]}
        onPress={toggleSelect}
        activeOpacity={disabled ? 1 : 0.7}
      >
        <Text
          style={[
            styles.triggerText,
            {
              color: selectedOption
                ? theme.colors.gray[800]
                : theme.colors.gray[400],
            },
            valueStyle,
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color={theme.colors.gray[500]}
        />
      </TouchableOpacity>

      {error && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}

      <Modal
        transparent
        visible={isOpen}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View 
            style={[
              styles.modalContent,
              { 
                backgroundColor: theme.colors.white,
                maxHeight: height * 0.6,
              }
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalHeaderText, { color: theme.colors.primary }]}>
                {label || 'Select Option'}
              </Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Ionicons name="close" size={24} color={theme.colors.gray[500]} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.optionsList}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    option.value === value && { 
                      backgroundColor: `${theme.colors.primary}10`,
                    },
                  ]}
                  onPress={() => handleSelect(option)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: theme.colors.gray[800] },
                      option.value === value && { 
                        color: theme.colors.primary,
                        fontWeight: '600',
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                  {option.value === value && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={theme.colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
  },
  triggerText: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: '600',
  },
  optionsList: {
    width: '100%',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  optionText: {
    fontSize: 16,
  },
});

export default Select;