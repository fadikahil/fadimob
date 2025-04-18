const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add proper asset extensions for bundling
config.resolver.assetExts.push(
  // Images
  'png', 'jpg', 'jpeg', 'gif', 'webp',
  // Fonts
  'ttf', 'otf', 'woff', 'woff2',
  // Other
  'svg', 'pdf'
);

module.exports = config;