import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

// Import Inter and Montserrat fonts
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';

// Import navigation
import AppNavigator from './src/navigation/AppNavigator';

// Import providers
import { ThemeProvider } from './src/contexts/ThemeContext';
import { ToastProvider } from './src/contexts/ToastContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

// Keep the splash screen visible while loading resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  // Load resources
  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts
        await loadFonts();
        
        // Artificially delay for 500ms to allow assets to load
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.warn('Error loading app resources:', error);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  async function loadFonts() {
    return Font.loadAsync({
      Inter_400Regular,
      Inter_500Medium,
      Inter_600SemiBold,
      Inter_700Bold,
      Montserrat_400Regular,
      Montserrat_500Medium,
      Montserrat_600SemiBold,
      Montserrat_700Bold,
    });
  }

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <AppNavigator onLayout={onLayoutRootView} />
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}