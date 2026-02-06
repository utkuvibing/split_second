const { View } = require('react-native');

module.exports = {
  useSharedValue: jest.fn((init) => ({ value: init })),
  useAnimatedStyle: jest.fn(() => ({})),
  withTiming: jest.fn((val) => val),
  withSpring: jest.fn((val) => val),
  withDelay: jest.fn((_, val) => val),
  withSequence: jest.fn((...vals) => vals[vals.length - 1]),
  withRepeat: jest.fn((val) => val),
  FadeIn: { duration: jest.fn().mockReturnThis() },
  FadeInDown: { duration: jest.fn().mockReturnThis(), delay: jest.fn().mockReturnThis() },
  FadeInUp: { duration: jest.fn().mockReturnThis(), delay: jest.fn().mockReturnThis() },
  FadeOut: { duration: jest.fn().mockReturnThis() },
  SlideInRight: { duration: jest.fn().mockReturnThis(), delay: jest.fn().mockReturnThis() },
  SlideOutLeft: { duration: jest.fn().mockReturnThis() },
  ZoomIn: { duration: jest.fn().mockReturnThis(), delay: jest.fn().mockReturnThis() },
  Easing: { bezier: jest.fn() },
  default: { call: jest.fn() },
  createAnimatedComponent: jest.fn((comp) => comp),
};

// Also mock Animated components
module.exports.default = {
  ...module.exports,
  View,
  Text: View,
  ScrollView: View,
  createAnimatedComponent: jest.fn((comp) => comp),
};
