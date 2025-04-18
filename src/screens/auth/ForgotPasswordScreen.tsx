import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/ui/Button';

const ForgotPasswordScreen = () => {
  // Hooks
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const { forgotPassword } = useAuth();
  const { toast } = useToast();
  
  // State
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Handle forgot password
  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: 'Please enter your email',
        variant: 'warning',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await forgotPassword(email);
      setSubmitted(true);
      toast({
        title: 'Password reset link sent',
        description: 'Check your email for instructions',
        variant: 'success',
      });
    } catch (error) {
      let errorMessage = 'Failed to send reset link';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String(error.message);
      }
      
      toast({
        title: 'Reset Failed',
        description: errorMessage,
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Forgot Password</Text>
          <Text style={[styles.subtitle, { color: colors.gray[600] }]}>
            Enter your email to reset your password
          </Text>
        </View>
        
        {!submitted ? (
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.card,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="your@email.com"
                placeholderTextColor={colors.gray[400]}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            </View>
            
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleForgotPassword}
              disabled={isLoading}
              loading={isLoading}
              style={styles.submitButton}
            >
              Send Reset Link
            </Button>
            
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={styles.backToLoginLink}
            >
              <Text style={{ color: colors.primary }}>Back to login</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.successContainer}>
            <Text style={[styles.successText, { color: colors.text }]}>
              If an account exists with email {email}, you will receive a password reset link
              shortly.
            </Text>
            <Text style={[styles.instructionText, { color: colors.gray[600] }]}>
              Please check your email and follow the instructions to reset your password.
            </Text>
            
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={() => navigation.navigate('Login')}
              style={styles.backButton}
            >
              Back to Login
            </Button>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  submitButton: {
    marginBottom: 16,
  },
  backToLoginLink: {
    alignSelf: 'center',
    padding: 8,
  },
  successContainer: {
    width: '100%',
    padding: 16,
    alignItems: 'center',
  },
  successText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  instructionText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  backButton: {
    marginTop: 16,
  },
});

export default ForgotPasswordScreen;