import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { COLORS, SPACING } from '@/utils/theme';
import { useToast } from '@/contexts/ToastContext';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

// User role options
type UserRole = 'client' | 'expert' | 'business';

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { registerMutation, user } = useAuth();
  const { showToast } = useToast();
  
  // Form state
  const [selectedRole, setSelectedRole] = useState<UserRole>('client');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    businessName: '',
    expertise: '',
    phone: '',
  });
  
  // Validation state
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    businessName: '',
    expertise: '',
    phone: '',
  });
  
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
    name: false,
    businessName: false,
    expertise: false,
    phone: false,
  });

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (user) {
      navigation.navigate('Home');
    }
  }, [user, navigation]);

  // Update a specific field in the form
  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Mark a field as touched for validation display
  const markTouched = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = { ...errors };
    let isValid = true;

    // Common validations for all roles
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    // Role-specific validations
    if (selectedRole === 'client' || selectedRole === 'expert') {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
        isValid = false;
      }
    }

    if (selectedRole === 'business') {
      if (!formData.businessName.trim()) {
        newErrors.businessName = 'Business name is required';
        isValid = false;
      }
    }

    if (selectedRole === 'expert') {
      if (!formData.expertise.trim()) {
        newErrors.expertise = 'Expertise is required';
        isValid = false;
      }
    }

    setErrors(newErrors);
    
    // Mark all fields as touched to show validation
    const allTouched = Object.keys(touched).reduce((acc, key) => {
      acc[key as keyof typeof touched] = true;
      return acc;
    }, {} as typeof touched);
    
    setTouched(allTouched);
    
    return isValid;
  };

  // Handle registration submission
  const handleRegister = () => {
    if (validateForm()) {
      // Prepare the data based on selected role
      const registrationData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: selectedRole,
        ...(selectedRole === 'client' && { name: formData.name }),
        ...(selectedRole === 'expert' && { 
          name: formData.name,
          expertise: formData.expertise,
          phone: formData.phone,
        }),
        ...(selectedRole === 'business' && { 
          businessName: formData.businessName,
          phone: formData.phone,
        }),
      };

      registerMutation.mutate(registrationData as any, {
        onSuccess: () => {
          showToast({
            message: 'Registration successful!',
            type: 'success',
          });
        },
        onError: (error: any) => {
          showToast({
            message: error.response?.data?.message || 'Registration failed. Please try again.',
            type: 'error',
          });
        }
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Create Account</Text>
            <Text style={styles.subtitleText}>Join the Tlobni community</Text>
          </View>

          <Card style={styles.card}>
            {/* Role Selection */}
            <Text style={styles.sectionTitle}>Select Account Type</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  selectedRole === 'client' && styles.roleButtonSelected,
                ]}
                onPress={() => setSelectedRole('client')}
              >
                <Text
                  style={[
                    styles.roleText,
                    selectedRole === 'client' && styles.roleTextSelected,
                  ]}
                >
                  Client
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  selectedRole === 'expert' && styles.roleButtonSelected,
                ]}
                onPress={() => setSelectedRole('expert')}
              >
                <Text
                  style={[
                    styles.roleText,
                    selectedRole === 'expert' && styles.roleTextSelected,
                  ]}
                >
                  Expert
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  selectedRole === 'business' && styles.roleButtonSelected,
                ]}
                onPress={() => setSelectedRole('business')}
              >
                <Text
                  style={[
                    styles.roleText,
                    selectedRole === 'business' && styles.roleTextSelected,
                  ]}
                >
                  Business
                </Text>
              </TouchableOpacity>
            </View>

            {/* Common Fields */}
            <Text style={styles.sectionTitle}>Account Information</Text>
            <Input
              label="Username"
              placeholder="Create a username"
              value={formData.username}
              onChangeText={(value) => updateField('username', value)}
              error={errors.username}
              touched={touched.username}
              onBlur={() => markTouched('username')}
              autoCapitalize="none"
            />

            <Input
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              error={errors.email}
              touched={touched.email}
              onBlur={() => markTouched('email')}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Input
              label="Password"
              placeholder="Create a password"
              value={formData.password}
              onChangeText={(value) => updateField('password', value)}
              error={errors.password}
              touched={touched.password}
              onBlur={() => markTouched('password')}
              secure
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={(value) => updateField('confirmPassword', value)}
              error={errors.confirmPassword}
              touched={touched.confirmPassword}
              onBlur={() => markTouched('confirmPassword')}
              secure
            />

            {/* Conditional Fields Based on Role */}
            <Text style={styles.sectionTitle}>
              {selectedRole === 'client' 
                ? 'Personal Information' 
                : selectedRole === 'expert' 
                  ? 'Professional Information' 
                  : 'Business Information'
              }
            </Text>

            {/* Client Fields */}
            {selectedRole === 'client' && (
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(value) => updateField('name', value)}
                error={errors.name}
                touched={touched.name}
                onBlur={() => markTouched('name')}
              />
            )}

            {/* Expert Fields */}
            {selectedRole === 'expert' && (
              <>
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChangeText={(value) => updateField('name', value)}
                  error={errors.name}
                  touched={touched.name}
                  onBlur={() => markTouched('name')}
                />
                <Input
                  label="Expertise"
                  placeholder="Your area of expertise"
                  value={formData.expertise}
                  onChangeText={(value) => updateField('expertise', value)}
                  error={errors.expertise}
                  touched={touched.expertise}
                  onBlur={() => markTouched('expertise')}
                />
                <Input
                  label="Phone (optional)"
                  placeholder="Your contact number"
                  value={formData.phone}
                  onChangeText={(value) => updateField('phone', value)}
                  keyboardType="phone-pad"
                />
              </>
            )}

            {/* Business Fields */}
            {selectedRole === 'business' && (
              <>
                <Input
                  label="Business Name"
                  placeholder="Enter your business name"
                  value={formData.businessName}
                  onChangeText={(value) => updateField('businessName', value)}
                  error={errors.businessName}
                  touched={touched.businessName}
                  onBlur={() => markTouched('businessName')}
                />
                <Input
                  label="Phone (optional)"
                  placeholder="Business contact number"
                  value={formData.phone}
                  onChangeText={(value) => updateField('phone', value)}
                  keyboardType="phone-pad"
                />
              </>
            )}

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={registerMutation.isPending}
              disabled={registerMutation.isPending}
              fullWidth
              style={styles.button}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.MEDIUM,
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: SPACING.LARGE,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  subtitleText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.TINY,
  },
  card: {
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.LARGE,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: SPACING.MEDIUM,
    marginTop: SPACING.MEDIUM,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.LARGE,
  },
  roleButton: {
    flex: 1,
    paddingVertical: SPACING.MEDIUM,
    paddingHorizontal: SPACING.SMALL,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: SPACING.SMALL,
    marginHorizontal: SPACING.TINY,
    alignItems: 'center',
  },
  roleButtonSelected: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  roleText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
  },
  roleTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  button: {
    marginTop: SPACING.LARGE,
    marginBottom: SPACING.MEDIUM,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.SMALL,
  },
  loginText: {
    color: COLORS.TEXT_SECONDARY,
  },
  loginLink: {
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;