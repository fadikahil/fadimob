import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User } from '../hooks/useAuth';
import { queryClient } from '../utils/queryClient';
import apiClient from '../api/client';

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  getToken: async () => null,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      try {
        // Check if we have a token in secure storage
        const token = await SecureStore.getItemAsync('authToken');
        
        if (token) {
          console.log('Found auth token, attempting to get user data');
          
          try {
            // Fetch user data with the token
            const response = await apiClient.get('/user');
            const userData = response.data;
            
            if (userData) {
              console.log('Successfully retrieved user data');
              setUser(userData);
              
              // Cache the user data in React Query
              queryClient.setQueryData(['/user'], userData);
            }
          } catch (error) {
            console.error('Failed to get user with token:', error);
            // If the token is invalid, remove it
            await SecureStore.deleteItemAsync('authToken');
          }
        } else {
          console.log('No auth token found in storage');
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (userData: User, token: string) => {
    try {
      // Store the token securely
      await SecureStore.setItemAsync('authToken', token);
      // Update the user state
      setUser(userData);
      // Cache the user data
      queryClient.setQueryData(['/user'], userData);
      
      console.log('User logged in successfully:', userData.username);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call logout API if available
      try {
        await apiClient.post('/logout');
      } catch (error) {
        console.log('API logout failed, continuing with client side logout');
      }
      
      // Always clear local storage and state
      await SecureStore.deleteItemAsync('authToken');
      setUser(null);
      
      // Clear cached user data
      queryClient.setQueryData(['/user'], null);
      queryClient.invalidateQueries({ queryKey: ['/user'] });
      
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const getToken = async () => {
    try {
      return await SecureStore.getItemAsync('authToken');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};