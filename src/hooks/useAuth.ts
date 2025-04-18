import { useState, useEffect } from 'react';
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
        message: `Welcome back, ${userData.fullName || userData.username}!`,
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
        message: `Welcome, ${userData.fullName || userData.username}! Your account has been created.`,
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
};