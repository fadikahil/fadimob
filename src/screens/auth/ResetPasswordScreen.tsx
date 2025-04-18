import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useToast } from '../../contexts/ToastContext';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Form, FormItem } from '../../components/ui/Form';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '../../components/ui/Card';
import { useForm, Controller } from 'react-hook-form';
import { apiRequest } from '../../api/client';

type ResetPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;
type ResetPasswordRouteProp = RouteProp<RootStackParamList, 'ResetPassword'>;

// Define the form data type
type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

const ResetPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ResetPasswordScreenNavigationProp>();
  const route = useRoute<ResetPasswordRouteProp>();
  const { theme } = useTheme();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  
  const { token } = route.params;

  // Form setup with custom validation
  const { control, handleSubmit, formState: { errors }, setError } = useForm<ResetPasswordFormData>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  
  // Custom validation function
  const validateForm = (data: ResetPasswordFormData) => {
    let isValid = true;
    
    // Validate password length
    if (data.password.length < 6) {
      setError('password', { 
        type: 'manual',
        message: 'Password must be at least 6 characters'
      });
      isValid = false;
    }
    
    // Validate password match
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: "Passwords don't match"
      });
      isValid = false;
    }
    
    return isValid;
  };

  // Handle form submission
  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    
    try {
      await apiRequest('POST', '/api/reset-password', {
        token,
        password: data.password,
      });
      
      setResetComplete(true);
      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset successfully. You can now login with your new password.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to reset password. The token may be invalid or expired.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../utils/assets').ASSETS.LOGO}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Reset Password Card */}
          <Card.Card style={styles.card}>
            <CardHeader>
              <CardTitle>
                Reset Your Password
              </CardTitle>
              <CardDescription>
                Enter your new password below
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {!resetComplete ? (
                <Form>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <FormItem>
                        <Input
                          label="New Password"
                          placeholder="Enter new password"
                          isPassword
                          leftIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.colors.gray[500]} />}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          error={errors.password?.message}
                        />
                      </FormItem>
                    )}
                  />
                  
                  <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <FormItem>
                        <Input
                          label="Confirm Password"
                          placeholder="Confirm your new password"
                          isPassword
                          leftIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.colors.gray[500]} />}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          error={errors.confirmPassword?.message}
                        />
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onPress={handleSubmit((data) => validateForm(data) && onSubmit(data))}
                    isLoading={isLoading}
                    leftIcon={<Ionicons name="key-outline" size={20} color="white" />}
                    style={styles.actionButton}
                  >
                    Reset Password
                  </Button>
                </Form>
              ) : (
                <View style={styles.successContainer}>
                  <View style={[styles.successIcon, { backgroundColor: theme.colors.success }]}>
                    <Ionicons name="checkmark" size={36} color="white" />
                  </View>
                  
                  <Text style={[styles.successMessage, { color: theme.colors.gray[800] }]}>
                    Password Reset Successful
                  </Text>
                  
                  <Text style={[styles.instructionsText, { color: theme.colors.gray[600] }]}>
                    Your password has been reset successfully. You can now login with your new password.
                  </Text>
                  
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onPress={() => navigation.navigate('Login')}
                    leftIcon={<Ionicons name="log-in-outline" size={20} color="white" />}
                    style={styles.loginButton}
                  >
                    Go to Login
                  </Button>
                </View>
              )}
            </CardContent>
            
            <CardFooter style={styles.cardFooter}>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>
                  Back to Login
                </Text>
              </TouchableOpacity>
            </CardFooter>
          </Card.Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 100,
    height: 100,
  },
  card: {
    width: '100%',
  },
  actionButton: {
    marginTop: 16,
  },
  cardFooter: {
    justifyContent: 'center',
  },
  successContainer: {
    alignItems: 'center',
    padding: 16,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    marginTop: 16,
  },
});

export default ResetPasswordScreen;