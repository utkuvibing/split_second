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

// Silence non-critical warnings in tests
const originalWarn = console.warn;
console.warn = (...args) => {
  const msg = typeof args[0] === 'string' ? args[0] : '';
  if (msg.includes('Reanimated') || msg.includes('NativeModule')) return;
  originalWarn.apply(console, args);
};
