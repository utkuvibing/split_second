import { DEFAULT_COLORS } from '../lib/themes';

// Re-export as Colors for backwards compatibility (static references, class components).
// Functional components should use useTheme() from lib/themeContext for dynamic theming.
export const Colors = DEFAULT_COLORS;
