/**
 * Central registry for all assets used in the app
 * This ensures consistent asset references and prevents path-related bundling errors
 */

// Import assets directly to ensure they're included in the bundle
const logo = require('../../assets/logo.png');
const splash = require('../../assets/splash.png');
const icon = require('../../assets/icon.png');

// Export assets for use throughout the app
export const ASSETS = {
  // Branding assets
  LOGO: logo,
  SPLASH: splash,
  ICON: icon,
  
  // Add more asset categories here as needed
  // UI: { ... },
  // ILLUSTRATIONS: { ... },
};

// Export a helper function to get assets with proper typing
export function getAsset(key: keyof typeof ASSETS) {
  return ASSETS[key];
}