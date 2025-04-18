import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export interface SelectOption {
  id: number | string;
  label: string;
  value: string;
}

interface SelectInputProps {
  label: string;
  options: SelectOption[];
  selectedOption?: SelectOption | null;
  onSelect: (option: SelectOption) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  searchable?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  options,
  selectedOption,
  onSelect,
  placeholder = 'Select an option',
  error,
  required = false,
  searchable = false,
}) => {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter options based on search query
  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;
  
  // Select option
  const handleSelect = (option: SelectOption) => {
    onSelect(option);
    setModalVisible(false);
    setSearchQuery('');
  };
  
  // Render option item
  const renderOption = ({ item }: { item: SelectOption }) => {
    const isSelected = selectedOption?.id === item.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.optionItem,
          {
            backgroundColor: isSelected ? `${colors.primary}10` : colors.card,
            borderColor: isSelected ? colors.primary : colors.border,
          },
        ]}
        onPress={() => handleSelect(item)}
      >
        <Text
          style={[
            styles.optionText,
            { color: isSelected ? colors.primary : colors.text },
          ]}
        >
          {item.label}
        </Text>
        
        {isSelected && (
          <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        {required && <Text style={[styles.required, { color: colors.error }]}>*</Text>}
      </View>
      
      <TouchableOpacity
        style={[
          styles.selectButton,
          {
            borderColor: error ? colors.error : colors.border,
            backgroundColor: colors.card,
          },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={[
            styles.selectedText,
            {
              color: selectedOption ? colors.text : colors.gray[400],
            },
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.gray[400]} />
      </TouchableOpacity>
      
      {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
      
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select {label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            {searchable && (
              <View
                style={[
                  styles.searchContainer,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Ionicons name="search" size={20} color={colors.gray[400]} />
                <TextInput
                  style={[styles.searchInput, { color: colors.text }]}
                  placeholder="Search options..."
                  placeholderTextColor={colors.gray[400]}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color={colors.gray[400]} />
                  </TouchableOpacity>
                )}
              </View>
            )}
            
            <FlatList
              data={filteredOptions}
              renderItem={renderOption}
              keyExtractor={(item) => item.id.toString()}
              style={styles.optionsList}
              contentContainerStyle={styles.optionsListContent}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  required: {
    marginLeft: 4,
    fontSize: 14,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  selectedText: {
    flex: 1,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  optionsList: {
    flex: 1,
  },
  optionsListContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 14,
  },
});

export default SelectInput;