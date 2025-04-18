import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert 
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../hooks/useAuth';
// Import as named imports to match the export style
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';

// Define the form schema with validation
// IMPORTANT: Using 'email' field to match server-side API expectations
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginScreen = ({ navigation }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const { login, isLoginPending } = useAuth();
  const { showToast } = useToast();

  // Set up the form with validation
  const { control, handleSubmit, setValue, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Handle the login submission
  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      
      // Call the login mutation from useAuth
      await login(data);
      
      // Navigation will be handled by the onSuccess callback in the mutation
    } catch (error: any) {
      console.error('Login submission error:', error);
      Alert.alert('Login Error', error.message || 'Failed to log in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fill in test account credentials
  const fillTestAccount = () => {
    setValue('email', 'amira@mail.com');
    setValue('password', '123456');
    showToast({ 
      message: 'Test account credentials filled in',
      type: 'info' 
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Image 
            source={require('../../../assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.formContainer}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                placeholder="Enter your email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="Enter your password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                secureTextEntry
              />
            )}
          />

          <TouchableOpacity 
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          <Button 
            label="Sign In" 
            onPress={handleSubmit(onSubmit)} 
            isLoading={isLoading || isLoginPending}
            style={styles.button}
          />

          <TouchableOpacity 
            onPress={fillTestAccount}
            style={styles.testAccountButton}
          >
            <Text style={styles.testAccountText}>Use Test Account</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D233F',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#0D233F',
    fontSize: 14,
  },
  button: {
    marginBottom: 15,
  },
  testAccountButton: {
    alignSelf: 'center',
    padding: 10,
    marginBottom: 20,
  },
  testAccountText: {
    color: '#0D233F',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#666666',
    fontSize: 14,
  },
  registerLink: {
    color: '#0D233F',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen;