import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Dialog, { DialogFooter } from '../ui/Dialog';
import { UserRole } from '../../types/auth';

interface RegistrationSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
  name: string;
}

const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({
  isOpen,
  onClose,
  role,
  name,
}) => {
  const { colors } = useTheme();
  
  // Get role-specific message
  const getMessage = () => {
    const firstName = name.split(' ')[0];
    
    switch (role) {
      case 'expert':
        return `Congratulations ${firstName}! You've successfully registered as an Expert. You can now showcase your services and start connecting with clients.`;
      case 'business':
        return `Congratulations ${firstName}! Your business account has been created successfully. You can now set up your business profile and start offering services.`;
      case 'client':
      default:
        return `Welcome to Tlobni, ${firstName}! Your account has been created successfully. You can now explore services and connect with experts.`;
    }
  };
  
  // Get next steps based on role
  const getNextSteps = () => {
    switch (role) {
      case 'expert':
        return [
          'Complete your profile with qualifications and experience',
          'Add your services and pricing',
          'Set your availability',
          'Start receiving booking requests',
        ];
      case 'business':
        return [
          'Complete your business profile',
          'Add team members and services',
          'Set up your business hours',
          'Start connecting with potential clients',
        ];
      case 'client':
      default:
        return [
          'Complete your profile',
          'Browse available services',
          'Connect with experts',
          'Book your first appointment',
        ];
    }
  };
  
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Registration Successful"
      disableBackdropClick={true}
      footer={
        <DialogFooter
          confirmText="Get Started"
          onConfirm={onClose}
        />
      }
    >
      <View style={styles.container}>
        <View style={[styles.iconContainer, { backgroundColor: `${colors.success}20` }]}>
          <Ionicons name="checkmark-circle" size={60} color={colors.success} />
        </View>
        
        <Text style={[styles.message, { color: colors.text }]}>{getMessage()}</Text>
        
        <View style={styles.nextStepsContainer}>
          <Text style={[styles.nextStepsTitle, { color: colors.text }]}>
            Next Steps:
          </Text>
          
          {getNextSteps().map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <Ionicons
                name="arrow-forward-circle"
                size={20}
                color={colors.primary}
                style={styles.stepIcon}
              />
              <Text style={[styles.stepText, { color: colors.text }]}>{step}</Text>
            </View>
          ))}
        </View>
      </View>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  nextStepsContainer: {
    alignSelf: 'stretch',
    marginBottom: 8,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepIcon: {
    marginRight: 8,
  },
  stepText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default RegistrationSuccess;