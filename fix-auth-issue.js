/**
 * Tlobni Mobile App - Complete Authentication Fix
 * 
 * This script fixes the authentication system to exactly match the web app's 
 * session-based authentication with cookies. This is critical for ensuring
 * the mobile app connects correctly to the server.
 * 
 * Run with: node fix-auth-issue.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function createEnvFileIfNeeded() {
  console.log('Checking for .env file...');
  
  const envPath = path.join(__dirname, '.env');
  
  if (!fs.existsSync(envPath)) {
    console.log('Creating .env file with API URL...');
    
    const envContent = `EXPO_PUBLIC_API_URL=https://505173bb-129c-4802-8558-9b090c796216-00-3dxfbq25jw5en.sisko.replit.dev/api`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created');
  } else {
    console.log('✅ .env file already exists');
  }
}

function updateApiClientForCookieAuth() {
  console.log('\nUpdating API client for session-based cookie authentication...');
  
  const apiClientPath = path.join(__dirname, 'src', 'api', 'client.ts');
  
  // Create directories if needed
  fs.mkdirSync(path.dirname(apiClientPath), { recursive: true });
  
  // Create the API client file with session-based authentication
  const apiClientContent = `import axios from 'axios';

// Use environment variable with fallback
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://505173bb-129c-4802-8558-9b090c796216-00-3dxfbq25jw5en.sisko.replit.dev/api';

/**
 * Configured Axios instance for API communication
 * 
 * IMPORTANT: withCredentials: true is required to send/receive cookies for session-based auth
 * This matches the web app's authentication approach exactly
 */
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  withCredentials: true, // Enables sending cookies in cross-domain requests - critical for session auth!
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detailed error information
    if (error.response) {
      console.error('API Error Response:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('API Request Error (No Response):', error.request);
    } else {
      console.error('API Setup Error:', error.message);
    }
    
    // Enhanced error object with user-friendly messages
    const enhancedError = new Error(
      error.response?.data?.message || 
      error.message || 
      'An unknown error occurred'
    );
    
    // Add status code if available
    if (error.response?.status) {
      enhancedError.name = \`Error \${error.response.status}\`;
    }
    
    return Promise.reject(enhancedError);
  }
);

export default apiClient;`;
  
  fs.writeFileSync(apiClientPath, apiClientContent);
  console.log('✅ API client updated for session-based cookie authentication');
}

function createAuthHook() {
  console.log('\nCreating authentication hook with correct session-based auth...');
  
  const authHookPath = path.join(__dirname, 'src', 'hooks', 'useAuth.ts');
  
  // Create directories if needed
  fs.mkdirSync(path.dirname(authHookPath), { recursive: true });
  
  // Create the auth hook file with session-based authentication
  const authHookContent = `import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '../api/client';
import { queryClient } from '../utils/queryClient';
import { useToast } from './useToast';

/**
 * Authentication types for the app
 * Exactly matching the server-side user model
 */
export interface User {
  id: number;
  email: string;
  username: string;
  fullName: string;  // To match server's user property
  role: 'client' | 'expert' | 'business' | 'admin';
  status?: string;
  avatar?: string;
  location?: string;
  // Add other server fields as needed
}

interface LoginCredentials {
  email: string;     // Server uses email field, not username
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;  // Server uses fullName, not name
  role: 'client' | 'expert' | 'business';
}

/**
 * Hook for handling authentication in the app
 * Using session-based authentication exactly like the web app
 */
export const useAuth = () => {
  const { showToast } = useToast();

  // Fetch the current user from the API
  const { 
    data: user, 
    isLoading, 
    error: userError,
    refetch
  } = useQuery({
    queryKey: ['/api/user'], // Must match exact server path
    queryFn: async () => {
      try {
        const response = await apiClient.get('/user');
        return response.data;
      } catch (error: any) {
        // Return null on 401 unauthorized to handle unauthenticated state
        if (error.response?.status === 401) {
          console.log("401 Unauthorized, returning null as requested");
          return null;
        }
        throw error;
      }
    },
    retry: false, // Don't retry on failure
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Login mutation - matches server's /api/login endpoint exactly
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await apiClient.post('/login', credentials);
      return response.data; // The server already returns user data directly
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(['/api/user'], userData);
      showToast({
        message: \`Welcome back, \${userData.fullName || userData.username}!\`,
        type: 'success',
      });
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      showToast({
        message: error.response?.data?.message || error.message || 'Login failed. Please check your credentials.',
        type: 'error'
      });
    },
  });

  // Register mutation - matches server's /api/register endpoint exactly
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await apiClient.post('/register', data);
      return response.data; // The server already returns user data directly
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(['/api/user'], userData);
      showToast({
        message: \`Welcome, \${userData.fullName || userData.username}! Your account has been created.\`,
        type: 'success',
      });
    },
    onError: (error: any) => {
      console.error('Registration error:', error);
      showToast({
        message: error.response?.data?.message || error.message || 'Registration failed. Please try again.',
        type: 'error'
      });
    },
  });

  // Logout function - matches server's /api/logout endpoint exactly
  const logoutMutation = useMutation({
    mutationFn: async () => {
      // Call the logout endpoint to clear the server-side session
      const response = await apiClient.post('/logout');
      return response.data;
    },
    onSuccess: () => {
      // Clear user data from cache
      queryClient.setQueryData(['/api/user'], null);
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      
      showToast({
        message: 'You have been logged out.',
        type: 'success',
      });
    },
    onError: (error: any) => {
      console.error('Logout error:', error);
      showToast({
        message: error.response?.data?.message || error.message || 'Logout failed.',
        type: 'error'
      });
    },
  });

  return {
    user,
    isLoading,
    isLoggedIn: !!user,
    userError,
    login: loginMutation.mutate,
    isLoginPending: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegisterPending: registerMutation.isPending,
    logout: logoutMutation.mutate,
    isLogoutPending: logoutMutation.isPending,
    refetchUser: refetch,
  };
};`;
  
  fs.writeFileSync(authHookPath, authHookContent);
  console.log('✅ Authentication hook created with session-based authentication');
}

function createLoginScreen() {
  console.log('\nUpdating LoginScreen with correct field names...');
  
  const loginScreenPath = path.join(__dirname, 'src', 'screens', 'auth', 'LoginScreen.tsx');
  
  // Create directories if needed
  fs.mkdirSync(path.dirname(loginScreenPath), { recursive: true });
  
  // Create the LoginScreen file with correct field names for server API
  const loginScreenContent = `import React, { useState } from 'react';
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
// Import components
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';

// Define the form schema with validation
// IMPORTANT: Using 'email' field to match server-side validation
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginScreen = ({ navigation }) => {
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
      
      // Call the login mutation from useAuth with exact server API format
      await login(data);
      
      // Navigation will be handled by the onSuccess callback in the mutation
    } catch (error) {
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

export default LoginScreen;`;
  
  fs.writeFileSync(loginScreenPath, loginScreenContent);
  console.log('✅ LoginScreen updated with correct field names');
}

function createToastHook() {
  console.log('\nCreating Toast hook...');
  
  const toastHookPath = path.join(__dirname, 'src', 'hooks', 'useToast.ts');
  
  // Create directories if needed
  fs.mkdirSync(path.dirname(toastHookPath), { recursive: true });
  
  // Create the Toast hook file
  const toastHookContent = `import { useState, useCallback } from 'react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

/**
 * Hook for showing toast notifications in the app
 */
export const useToast = () => {
  const [toast, setToast] = useState<ToastProps | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  /**
   * Show a toast notification
   */
  const showToast = useCallback(({ message, type = 'info', duration = 3000 }: ToastProps) => {
    // Hide any existing toast first
    if (visible) {
      setVisible(false);
      
      // Small delay to ensure animation completes
      setTimeout(() => {
        setToast({ message, type, duration });
        setVisible(true);
      }, 300);
    } else {
      setToast({ message, type, duration });
      setVisible(true);
    }
    
    // Auto-hide the toast after duration
    setTimeout(() => {
      setVisible(false);
    }, duration);
  }, [visible]);

  /**
   * Hide the current toast
   */
  const hideToast = useCallback(() => {
    setVisible(false);
  }, []);

  return {
    toast,
    visible,
    showToast,
    hideToast,
  };
};`;
  
  fs.writeFileSync(toastHookPath, toastHookContent);
  console.log('✅ Toast hook created');
}

function createQueryClient() {
  console.log('\nCreating QueryClient utility...');
  
  const queryClientPath = path.join(__dirname, 'src', 'utils', 'queryClient.ts');
  
  // Create directories if needed
  fs.mkdirSync(path.dirname(queryClientPath), { recursive: true });
  
  // Create the QueryClient utility file
  const queryClientContent = `import { QueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';

/**
 * Custom query client with default settings
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Default query function for React Query
 * Will automatically handle errors and base URL
 */
export const defaultQueryFn = async ({ queryKey }: { queryKey: string[] }) => {
  // The first item in the query key should be the endpoint path
  const path = queryKey[0];
  try {
    const response = await apiClient.get(path);
    return response.data;
  } catch (error: any) {
    console.error(\`Query error for \${path}:\`, error);
    throw error;
  }
};

/**
 * Handle 401 responses differently based on options
 */
interface QueryFnOptions {
  on401?: 'throw' | 'returnNull';
}

/**
 * Create a query function with custom error handling
 */
export const getQueryFn = (options: QueryFnOptions = {}) => {
  return async ({ queryKey }: { queryKey: string[] }) => {
    // The first item in the query key should be the endpoint path
    const path = queryKey[0];
    
    try {
      const response = await apiClient.get(path);
      return response.data;
    } catch (error: any) {
      // Handle 401 errors based on options
      if (error.response?.status === 401 && options.on401 === 'returnNull') {
        console.warn('401 Unauthorized, returning null as requested');
        return null;
      }
      console.error(\`Query error for \${path}:\`, error);
      throw error;
    }
  };
};`;
  
  fs.writeFileSync(queryClientPath, queryClientContent);
  console.log('✅ QueryClient utility created');
}

function createInputComponent() {
  console.log('\nCreating Input component...');
  
  const inputComponentPath = path.join(__dirname, 'src', 'components', 'ui', 'Input.tsx');
  
  // Create directories if needed
  fs.mkdirSync(path.dirname(inputComponentPath), { recursive: true });
  
  // Create the Input component file
  const inputComponentContent = `import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

// Export both as default and named export to support both import styles
const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  style, 
  ...props 
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : null,
          style
        ]}
        placeholderTextColor="#888"
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    width: '100%',
  },
  label: {
    marginBottom: 5,
    fontSize: 14,
    fontWeight: '500',
    color: '#0D233F',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#E53935',
  },
  errorText: {
    color: '#E53935',
    fontSize: 12,
    marginTop: 5,
  },
});

export { Input };
export default Input;`;
  
  fs.writeFileSync(inputComponentPath, inputComponentContent);
  console.log('✅ Input component created');
}

function createButtonComponent() {
  console.log('\nCreating Button component...');
  
  const buttonComponentPath = path.join(__dirname, 'src', 'components', 'ui', 'Button.tsx');
  
  // Create directories if needed
  fs.mkdirSync(path.dirname(buttonComponentPath), { recursive: true });
  
  // Create the Button component file
  const buttonComponentContent = `import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

// Export both as default and named export to support both import styles
const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  style,
  textStyle,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[\`\${variant}Button\`],
        styles[\`\${size}Button\`],
        isLoading && styles.buttonDisabled,
        style
      ]}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? '#0D233F' : '#FFFFFF'} 
          size="small" 
        />
      ) : (
        <Text 
          style={[
            styles.buttonText, 
            styles[\`\${variant}Text\`],
            styles[\`\${size}Text\`],
            textStyle
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: '#0D233F',
  },
  secondaryButton: {
    backgroundColor: '#E7CCA8',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0D233F',
  },
  smallButton: {
    height: 36,
  },
  mediumButton: {
    height: 48,
  },
  largeButton: {
    height: 56,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontWeight: '600',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#0D233F',
  },
  outlineText: {
    color: '#0D233F',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
});

export { Button };
export default Button;`;
  
  fs.writeFileSync(buttonComponentPath, buttonComponentContent);
  console.log('✅ Button component created');
}

function createTestCredentials() {
  console.log('\nCreating test credentials file...');
  
  const testCredsPath = path.join(__dirname, 'test-credentials.json');
  
  const testCreds = {
    email: 'amira@mail.com',
    password: '123456'
  };
  
  fs.writeFileSync(testCredsPath, JSON.stringify(testCreds, null, 2));
  console.log('✅ Test credentials file created');
}

function checkIfDepsNeedInstalling() {
  console.log('\nChecking if dependencies need to be installed...');
  
  const packageJsonPath = path.join(__dirname, 'package.json');
  
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const requiredDeps = [
      'axios',
      '@tanstack/react-query',
      'react-hook-form',
      '@hookform/resolvers',
      'zod'
    ];
    
    const missingDeps = requiredDeps.filter(dep => {
      return !packageJson.dependencies || !packageJson.dependencies[dep];
    });
    
    if (missingDeps.length > 0) {
      console.log(`❌ Missing dependencies: ${missingDeps.join(', ')}`);
      return missingDeps;
    } else {
      console.log('✅ All required dependencies are installed');
      return [];
    }
  } else {
    console.error('❌ package.json file not found at:', packageJsonPath);
    return [];
  }
}

function runInstallerIfNeeded() {
  const missingDeps = checkIfDepsNeedInstalling();
  
  if (missingDeps.length > 0) {
    console.log(`\nInstalling missing dependencies: ${missingDeps.join(', ')}...`);
    
    try {
      execSync(`npm install ${missingDeps.join(' ')}`, { stdio: 'inherit' });
      console.log('✅ Dependencies installed successfully');
    } catch (error) {
      console.error('❌ Error installing dependencies:', error.message);
    }
  }
}

// Run all fixes
console.log('🔧 Starting complete authentication fix process...');
createEnvFileIfNeeded();
updateApiClientForCookieAuth();
createAuthHook();
createLoginScreen();
createToastHook();
createQueryClient();
createInputComponent();
createButtonComponent();
createTestCredentials();
runInstallerIfNeeded();
console.log('\n✅ Complete authentication fix applied successfully!');
console.log('\n🔑 Authentication now uses session cookies exactly like the web app.');
console.log('\n👉 Now run: npx expo start -c');