const basePreset = require('jest-expo/jest-preset');

module.exports = {
  ...basePreset,
  // Put our setup FIRST so globals are defined before jest-expo's setup loads expo/src/winter
  setupFiles: [
    './jest.setup.js',
    ...(basePreset.setupFiles || []),
  ],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@supabase/.*|react-native-reanimated|react-native-gesture-handler|react-native-screens|react-native-safe-area-context|react-native-view-shot|react-native-pager-view|react-native-url-polyfill)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverageFrom: [
    'lib/**/*.ts',
    'hooks/**/*.ts',
    'constants/**/*.ts',
    '!**/__tests__/**',
    '!**/node_modules/**',
  ],
};
