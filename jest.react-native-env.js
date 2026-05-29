const { TestEnvironment: NodeEnvironment } = require('jest-environment-node');

module.exports = class ReactNativeEnvironment extends NodeEnvironment {
  customExportConditions = ['require', 'react-native'];
};
