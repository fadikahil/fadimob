import { Platform } from 'react-native';

// Tlobni brand colors based on the design guidelines
export const COLORS = {
  // Primary colors
  PRIMARY: '#0D233F',       // Deep blue
  SECONDARY: '#E7CCA8',     // Soft beige
  
  // UI colors
  BACKGROUND: '#FAFAFA',    // Off-white background
  CARD: '#FFFFFF',          // Card background (pure white)
  TEXT_PRIMARY: '#1A1A1A',  // Almost black text
  TEXT_SECONDARY: '#4A4A4A', // Dark gray text
  TEXT_MUTED: '#767676',    // Medium gray text
  BORDER: '#DDDDDD',        // Light gray border
  
  // Status colors
  SUCCESS: '#2E7D32',       // Green
  ERROR: '#D32F2F',         // Red
  WARNING: '#F9A825',       // Yellow
  INFO: '#0288D1',          // Blue
};

// Font size naming by usage
export const FONT_SIZE = {
  XSMALL: 10,
  SMALL: 12,
  MEDIUM: 14,
  LARGE: 16,
  XLARGE: 18,
  XXLARGE: 20,
  XXXLARGE: 24,
};

// Spacing scales
export const SPACING = {
  TINY: 4,
  XSMALL: 8,
  SMALL: 12,
  MEDIUM: 16,
  LARGE: 24,
  XLARGE: 32,
  XXLARGE: 48,
  XXXLARGE: 64,
};

// Border radius
export const BORDER_RADIUS = {
  SMALL: 4,
  MEDIUM: 8,
  LARGE: 12,
  XLARGE: 16,
  PILL: 9999,
};

// Font families - using Inter and Montserrat
export const FONT_FAMILY = {
  REGULAR: 'Inter_400Regular',
  MEDIUM: 'Inter_500Medium',
  SEMIBOLD: 'Inter_600SemiBold',
  BOLD: 'Inter_700Bold',
  MONTSERRAT_REGULAR: 'Montserrat_400Regular',
  MONTSERRAT_MEDIUM: 'Montserrat_500Medium',
  MONTSERRAT_SEMIBOLD: 'Montserrat_600SemiBold',
  MONTSERRAT_BOLD: 'Montserrat_700Bold',
};

// Platform specific shadows
export const SHADOW = {
  SMALL: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
    },
    android: {
      elevation: 2,
    },
    default: {},
  }),
  MEDIUM: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
    },
    android: {
      elevation: 4,
    },
    default: {},
  }),
  LARGE: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
    },
    android: {
      elevation: 8,
    },
    default: {},
  }),
};

// Layout scales
export const LAYOUT = {
  SCREEN_PADDING_HORIZONTAL: SPACING.MEDIUM,
  SCREEN_PADDING_VERTICAL: SPACING.MEDIUM,
  CONTENT_WIDTH_MAX: 1200,
};

// Common component styling
export const COMPONENT_STYLES = {
  CONTAINER: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  SCREEN_CONTAINER: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: LAYOUT.SCREEN_PADDING_HORIZONTAL,
    paddingVertical: LAYOUT.SCREEN_PADDING_VERTICAL,
  },
  HEADER: {
    textAlign: 'center',
    fontSize: FONT_SIZE.XXXLARGE,
    fontFamily: FONT_FAMILY.BOLD,
    color: COLORS.PRIMARY,
    marginBottom: SPACING.LARGE,
  },
  SUBHEADER: {
    fontSize: FONT_SIZE.XLARGE,
    fontFamily: FONT_FAMILY.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MEDIUM,
  }
};

export default {
  COLORS,
  FONT_SIZE,
  SPACING,
  BORDER_RADIUS,
  FONT_FAMILY,
  SHADOW,
  LAYOUT,
  COMPONENT_STYLES
};