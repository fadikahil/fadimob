import { QueryClient } from '@tanstack/react-query';
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
    console.error(`Query error for ${path}:`, error);
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
      console.error(`Query error for ${path}:`, error);
      throw error;
    }
  };
};