import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Auth Screens
import WelcomeScreen from '@/screens/auth/WelcomeScreen';
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import ForgotPasswordScreen from '@/screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '@/screens/auth/ResetPasswordScreen';

// Main App Screens (placeholder components to be implemented)
import HomeScreen from '@/screens/home/HomeScreen';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import ServicesScreen from '@/screens/services/ServicesScreen';
import MessagesScreen from '@/screens/messages/MessagesScreen';

// Import auth hook
import { useAuth } from '@/hooks/useAuth';

// Types
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  Home: undefined; // For skip navigation
};

export type MainTabParamList = {
  Home: undefined;
  Services: undefined;
  Messages: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

// Create navigators
const AuthStack = createStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const RootStack = createStackNavigator<RootStackParamList>();

// Auth Navigator
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </AuthStack.Navigator>
  );
};

// Main Tab Navigator
const MainNavigator = () => {
  return (
    <MainTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0D233F',
        tabBarInactiveTintColor: '#888888',
      }}
    >
      <MainTab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <MainTab.Screen 
        name="Services" 
        component={ServicesScreen} 
        options={{
          tabBarLabel: 'Services',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" color={color} size={size} />
          ),
        }}
      />
      <MainTab.Screen 
        name="Messages" 
        component={MessagesScreen} 
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" color={color} size={size} />
          ),
        }}
      />
      <MainTab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </MainTab.Navigator>
  );
};

// Root Navigator
export const AppNavigator = ({ onLayout }: { onLayout?: () => Promise<void> }) => {
  // Check auth state
  const { user, isLoading } = useAuth();
  const isAuthenticated = !!user;
  
  // Special handler for the Home screen from the AuthNavigator
  const linking = {
    prefixes: [],
    config: {
      screens: {
        Auth: {
          screens: {
            Home: 'home', // This will be caught and redirected to the Main stack
          },
        },
        Main: {
          screens: {
            Home: 'home',
          },
        },
      },
    },
  };
  
  if (isLoading) {
    // Return a loading screen
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Ionicons name="hourglass-outline" size={40} color="#0D233F" />
      </View>
    );
  }
  
  return (
    <SafeAreaProvider>
      <NavigationContainer 
        onReady={onLayout}
        linking={linking}
      >
        <StatusBar style="dark" />
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <RootStack.Screen name="Main" component={MainNavigator} />
          ) : (
            <RootStack.Screen name="Auth" component={AuthNavigator} />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppNavigator;