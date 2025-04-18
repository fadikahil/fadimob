import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme, Platform } from 'react-native';

// Define theme colors
const lightColors = {
  primary: '#0D233F',
  secondary: '#E7CCA8',
  background: '#FAFAFA',
  card: '#FFFFFF',
  text: '#000000',
  border: '#E1E1E1',
  notification: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#0A84FF',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

const darkColors = {
  primary: '#1E6EFA',
  secondary: '#E7CCA8',
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  border: '#2C2C2C',
  notification: '#FF453A',
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  info: '#0A84FF',
  gray: {
    50: '#18191A',
    100: '#242526',
    200: '#3A3B3C',
    300: '#4E4F50',
    400: '#6A6C6D',
    500: '#8A8D8F',
    600: '#B0B3B8',
    700: '#D8DADF',
    800: '#E4E6EB',
    900: '#F5F5F5',
  },
};

// Theme types
export type ThemeColors = typeof lightColors;
export type ColorScheme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  isDark: boolean;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  colors: ThemeColors;
  setSystemColorScheme: () => void;
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Storage key
const COLOR_SCHEME_STORAGE_KEY = 'tlobni_color_scheme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get device color scheme
  const deviceColorScheme = useColorScheme() || 'light';
  
  // State
  const [colorScheme, setColorScheme] = useState<ColorScheme>('system');
  const [isDark, setIsDark] = useState(deviceColorScheme === 'dark');

  // Set the active color scheme
  useEffect(() => {
    // Read from storage in future implementation
    const storedScheme: ColorScheme = 'system';
    setColorScheme(storedScheme);
  }, []);

  // Update dark mode when color scheme changes
  useEffect(() => {
    if (colorScheme === 'system') {
      setIsDark(deviceColorScheme === 'dark');
    } else {
      setIsDark(colorScheme === 'dark');
    }
  }, [colorScheme, deviceColorScheme]);

  // Change color scheme
  const changeColorScheme = (newScheme: ColorScheme) => {
    setColorScheme(newScheme);
    // Save to storage in future implementation
  };

  // Set color scheme to system
  const setSystemColorScheme = () => {
    changeColorScheme('system');
  };

  // Get current theme colors
  const colors = isDark ? darkColors : lightColors;

  // Theme context value
  const themeContextValue: ThemeContextType = {
    isDark,
    colorScheme,
    setColorScheme: changeColorScheme,
    colors,
    setSystemColorScheme,
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

export default ThemeContext;