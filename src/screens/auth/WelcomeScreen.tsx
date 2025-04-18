import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Platform,
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../../components/ui/Button';

// Get dimensions
const { width, height } = Dimensions.get('window');

// Define features
const features = [
  {
    icon: 'people-outline',
    title: 'Find Experts',
    description: 'Connect with verified experts for your lifestyle needs',
  },
  {
    icon: 'checkmark-circle-outline',
    title: 'Quality Service',
    description: 'Premium quality service from trusted professionals',
  },
  {
    icon: 'cash-outline',
    title: 'Transparent Pricing',
    description: 'Clear upfront pricing with no hidden fees',
  },
  {
    icon: 'chatbubbles-outline',
    title: 'Instant Chat',
    description: 'Real-time messaging with your service providers',
  },
];

const WelcomeScreen = () => {
  // Navigation hook
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  // Theme hook
  const { colors } = useTheme();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../utils/assets').ASSETS.LOGO}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.appName, { color: colors.primary }]}>
            Tlobni
          </Text>
          <Text style={[styles.tagline, { color: colors.gray[600] }]}>
            Premium Lifestyle Services
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View 
              key={index} 
              style={[
                styles.featureItem,
                { backgroundColor: colors.card }
              ]}
            >
              <View 
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${colors.primary}15` }
                ]}
              >
                <Ionicons 
                  name={feature.icon as any} 
                  size={24} 
                  color={colors.primary} 
                />
              </View>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                {feature.title}
              </Text>
              <Text 
                style={[styles.featureDescription, { color: colors.gray[600] }]}
                numberOfLines={2}
              >
                {feature.description}
              </Text>
            </View>
          ))}
        </View>

        {/* Auth Buttons */}
        <View style={styles.authButtonsContainer}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={() => navigation.navigate('Login')}
            style={styles.loginButton}
          >
            Login
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            fullWidth
            onPress={() => navigation.navigate('Register')}
            style={styles.registerButton}
          >
            Create Account
          </Button>

          <View style={styles.continueAsGuestContainer}>
            <TouchableOpacity
              onPress={() => {
                // This will bypass authentication and go directly to the home screen
                // In a production app, we would set up a guest mode with limited functionality
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Home' }],
                })
              }}
            >
              <Text style={[styles.continueAsGuestText, { color: colors.gray[600] }]}>
                Skip for later
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.05,
    marginBottom: height * 0.05,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: height * 0.05,
  },
  featureItem: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  authButtonsContainer: {
    width: '100%',
    marginTop: 'auto',
    paddingBottom: 16,
  },
  loginButton: {
    marginBottom: 12,
  },
  registerButton: {
    marginBottom: 24,
  },
  continueAsGuestContainer: {
    alignItems: 'center',
  },
  continueAsGuestText: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;