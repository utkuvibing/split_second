module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  rules: {
    // TypeScript handles these
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',

    // Quality rules
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-empty': ['error', { 'allowEmptyCatch': true }],
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',

    // Disable overly strict React 19 rules that don't work with Reanimated
    'react-hooks/immutability': 'off',
    'react-hooks/purity': 'off',
    'react-hooks/set-state-in-effect': 'off',

    // Allow require() in mock/config files
    '@typescript-eslint/no-require-imports': 'off',
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    '.expo/',
    'coverage/',
    '__mocks__/',
    'jest.config.js',
    'jest.setup.js',
    'babel.config.js',
  ],
};
