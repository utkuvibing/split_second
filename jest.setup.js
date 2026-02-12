// Pre-install globals with non-configurable properties to prevent Expo's Winter
// runtime from overwriting them with lazy getters that trigger require() outside Jest's scope.
// This must run BEFORE jest-expo's setup.js which loads expo/src/winter.

const globalsToProtect = [
  '__ExpoImportMetaRegistry',
  'structuredClone',
  'TextDecoder',
  'TextDecoderStream',
  'TextEncoderStream',
  'URL',
  'URLSearchParams',
];

for (const name of globalsToProtect) {
  const currentValue = globalThis[name];
  if (currentValue !== undefined) {
    // Re-define as non-configurable to prevent lazy getter override
    Object.defineProperty(globalThis, name, {
      value: currentValue,
      configurable: false,
      writable: true,
      enumerable: true,
    });
  } else {
    // Define with a stub value
    Object.defineProperty(globalThis, name, {
      value: name === '__ExpoImportMetaRegistry' ? {} : function() {},
      configurable: false,
      writable: true,
      enumerable: true,
    });
  }
}

// Set up environment variables for tests
process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://mock-supabase.com';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key';

// Mock @expo/vector-icons to avoid expo-asset/expo-font resolution issues in Jest
jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  const React = require('react');
  const createMockIcon = (name) => {
    const Icon = (props) => React.createElement(Text, { testID: `icon-${name}` }, props.name);
    Icon.glyphMap = new Proxy({}, { get: () => 0 });
    Icon.displayName = name;
    return Icon;
  };
  return {
    Ionicons: createMockIcon('Ionicons'),
    MaterialCommunityIcons: createMockIcon('MaterialCommunityIcons'),
    FontAwesome: createMockIcon('FontAwesome'),
    MaterialIcons: createMockIcon('MaterialIcons'),
  };
});

// Mock react-native-reanimated with proper Animated components
jest.mock('react-native-reanimated', () => {
  const { View, Text, Image, ScrollView } = require('react-native');
  const noop = () => {};

  const Animated = {
    View,
    Text,
    Image,
    ScrollView,
    createAnimatedComponent: (comp) => comp,
  };

  // Use __esModule so `import Animated from` resolves to the `default` key
  return {
    __esModule: true,
    default: Animated,
    useSharedValue: (init) => ({ value: init }),
    useAnimatedStyle: (fn) => fn(),
    useDerivedValue: (fn) => ({ value: fn() }),
    useAnimatedScrollHandler: () => noop,
    withTiming: (val) => val,
    withSpring: (val) => val,
    withRepeat: (val) => val,
    withSequence: (...vals) => vals[vals.length - 1],
    withDelay: (_, val) => val,
    Easing: { linear: noop, ease: noop, bezier: () => noop },
    FadeIn: { duration: () => ({ delay: () => ({ duration: () => ({}) }) }), delay: () => ({ duration: () => ({}) }) },
    FadeOut: { duration: () => ({}) },
    SlideInRight: { duration: () => ({}) },
    SlideOutLeft: { duration: () => ({}) },
    Layout: { duration: () => ({}) },
    runOnJS: (fn) => fn,
    runOnUI: (fn) => fn,
    cancelAnimation: noop,
    interpolate: noop,
    Extrapolation: { CLAMP: 'clamp' },
  };
});

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  const React = require('react');
  return {
    LinearGradient: (props) => React.createElement(View, { ...props, testID: 'linear-gradient' }),
  };
});

// Mock expo-blur
jest.mock('expo-blur', () => {
  const { View } = require('react-native');
  const React = require('react');
  return {
    BlurView: (props) => React.createElement(View, { ...props, testID: 'blur-view' }),
  };
});

// Silence non-critical warnings in tests
const originalWarn = console.warn;
console.warn = (...args) => {
  const msg = typeof args[0] === 'string' ? args[0] : '';
  if (msg.includes('Reanimated') || msg.includes('NativeModule')) return;
  originalWarn.apply(console, args);
};
