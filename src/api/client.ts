import axios from 'axios';

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
      enhancedError.name = `Error ${error.response.status}`;
    }
    
    return Promise.reject(enhancedError);
  }
);

export default apiClient;