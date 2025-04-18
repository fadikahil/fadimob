import React, { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  maxHeight?: number | string;
  disableBackdropClick?: boolean;
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxHeight = '80%',
  disableBackdropClick = false,
}) => {
  const { colors } = useTheme();
  
  const handleBackdropPress = () => {
    if (!disableBackdropClick) {
      onClose();
    }
  };
  
  const handleContentPress = (event: any) => {
    // Prevent propagation to backdrop
    event.stopPropagation();
  };
  
  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <TouchableWithoutFeedback onPress={handleContentPress}>
            <View
              style={[
                styles.dialogContainer,
                { backgroundColor: colors.background, maxHeight },
              ]}
            >
              <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              {description && (
                <Text style={[styles.description, { color: colors.gray[600] }]}>
                  {description}
                </Text>
              )}
              
              <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
              >
                {children}
              </ScrollView>
              
              {footer && <View style={styles.footer}>{footer}</View>}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export const DialogFooter: React.FC<{
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  confirmDisabled?: boolean;
  confirmLoading?: boolean;
  children?: ReactNode;
}> = ({
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  onCancel,
  onConfirm,
  confirmDisabled = false,
  confirmLoading = false,
  children,
}) => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.dialogFooter}>
      {children || (
        <>
          {onCancel && (
            <TouchableOpacity
              style={[
                styles.footerButton,
                styles.cancelButton,
                { borderColor: colors.border },
              ]}
              onPress={onCancel}
            >
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                {cancelText}
              </Text>
            </TouchableOpacity>
          )}
          
          {onConfirm && (
            <TouchableOpacity
              style={[
                styles.footerButton,
                styles.confirmButton,
                {
                  backgroundColor: confirmDisabled
                    ? `${colors.primary}50`
                    : colors.primary,
                },
              ]}
              onPress={onConfirm}
              disabled={confirmDisabled || confirmLoading}
            >
              {confirmLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={[styles.confirmButtonText, { color: "#FFFFFF" }]}>
                  {confirmText}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialogContainer: {
    width: '100%',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 0,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  dialogFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
  },
  footerButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    marginRight: 8,
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  confirmButton: {},
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Dialog;