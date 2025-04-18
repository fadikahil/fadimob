import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export interface Option {
  id: number | string;
  name: string;
  value?: string;
  icon?: string;
}

interface MultiSelectProps {
  label: string;
  options: Option[];
  selectedOptions: Option[];
  onSelectionChange: (selected: Option[]) => void;
  placeholder?: string;
  error?: string;
  maxSelections?: number;
  required?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  selectedOptions,
  onSelectionChange,
  placeholder = 'Select options',
  error,
  maxSelections,
  required = false,
}) => {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [localSelected, setLocalSelected] = useState<Option[]>([]);
  
  // Initialize local state with props
  useEffect(() => {
    setLocalSelected(selectedOptions);
  }, [selectedOptions]);
  
  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Toggle selection of an option
  const toggleOption = (option: Option) => {
    const isSelected = localSelected.some((item) => item.id === option.id);
    
    if (isSelected) {
      // Remove from selection
      setLocalSelected(localSelected.filter((item) => item.id !== option.id));
    } else {
      // Add to selection if max selections not reached
      if (maxSelections && localSelected.length >= maxSelections) {
        return; // Max selections reached
      }
      setLocalSelected([...localSelected, option]);
    }
  };
  
  // Apply selection
  const applySelection = () => {
    onSelectionChange(localSelected);
    setModalVisible(false);
  };
  
  // Cancel selection
  const cancelSelection = () => {
    setLocalSelected(selectedOptions);
    setModalVisible(false);
  };
  
  // Clear all selections
  const clearSelections = () => {
    setLocalSelected([]);
  };
  
  // Remove a single selected option
  const removeOption = (optionId: number | string) => {
    setLocalSelected(localSelected.filter((item) => item.id !== optionId));
    onSelectionChange(localSelected.filter((item) => item.id !== optionId));
  };
  
  // Render option item
  const renderOption = ({ item }: { item: Option }) => {
    const isSelected = localSelected.some((option) => option.id === item.id);
    
    return (
      <TouchableOpacity
        style={[
          styles.optionItem,
          {
            backgroundColor: isSelected ? `${colors.primary}10` : colors.card,
            borderColor: isSelected ? colors.primary : colors.border,
          },
        ]}
        onPress={() => toggleOption(item)}
      >
        <Text
          style={[styles.optionText, { color: isSelected ? colors.primary : colors.text }]}
        >
          {item.name}
        </Text>
        
        {isSelected && (
          <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
        )}
      </TouchableOpacity>
    );
  };
  
  // Render selected items
  const renderSelectedChips = () => {
    if (localSelected.length === 0) {
      return (
        <Text style={[styles.placeholder, { color: colors.gray[400] }]}>
          {placeholder}
        </Text>
      );
    }
    
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {localSelected.map((option) => (
          <View
            key={option.id}
            style={[
              styles.chip,
              { backgroundColor: `${colors.primary}15`, borderColor: colors.primary },
            ]}
          >
            <Text style={[styles.chipText, { color: colors.primary }]}>{option.name}</Text>
            <TouchableOpacity onPress={() => removeOption(option.id)}>
              <Ionicons name="close-circle" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
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
        {renderSelectedChips()}
        <Ionicons name="chevron-down" size={20} color={colors.gray[400]} />
      </TouchableOpacity>
      
      {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
      
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => cancelSelection()}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Select {label}
              </Text>
              <TouchableOpacity onPress={() => cancelSelection()}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
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
            
            <View style={styles.selectedCountContainer}>
              <Text style={[styles.selectedCount, { color: colors.gray[600] }]}>
                {localSelected.length} selected
                {maxSelections && ` (max ${maxSelections})`}
              </Text>
              
              {localSelected.length > 0 && (
                <TouchableOpacity onPress={clearSelections}>
                  <Text style={[styles.clearButton, { color: colors.primary }]}>
                    Clear all
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            
            <FlatList
              data={filteredOptions}
              renderItem={renderOption}
              keyExtractor={(item) => item.id.toString()}
              style={styles.optionsList}
              contentContainerStyle={styles.optionsListContent}
              showsVerticalScrollIndicator={false}
            />
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.cancelButton, { borderColor: colors.border }]}
                onPress={cancelSelection}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.applyButton, { backgroundColor: colors.primary }]}
                onPress={applySelection}
              >
                <Text style={[styles.applyButtonText, { color: colors.white }]}>Apply</Text>
              </TouchableOpacity>
            </View>
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
    minHeight: 50,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  placeholder: {
    flex: 1,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    marginRight: 4,
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
  selectedCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  selectedCount: {
    fontSize: 12,
  },
  clearButton: {
    fontSize: 12,
    fontWeight: '500',
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
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  applyButton: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default MultiSelect;