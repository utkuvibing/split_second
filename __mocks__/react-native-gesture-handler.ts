const { View } = require('react-native');

module.exports = {
  GestureHandlerRootView: View,
  GestureDetector: View,
  Gesture: {
    Pan: jest.fn().mockReturnThis(),
    onUpdate: jest.fn().mockReturnThis(),
    onEnd: jest.fn().mockReturnThis(),
    activeOffsetX: jest.fn().mockReturnThis(),
  },
  Directions: {},
};
