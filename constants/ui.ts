import { Platform } from 'react-native';

export const RADIUS = {
  sm: 10,
  md: 16,
  lg: 20,
  xl: 24,
};

const baseShadow = (
  offsetY: number,
  radius: number,
  elevation: number,
  opacity: number
) =>
  Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    android: { elevation },
    default: {},
  }) as Record<string, any>;

export const SHADOW = {
  sm: baseShadow(2, 4, 3, 0.15),
  md: baseShadow(4, 8, 6, 0.2),
  lg: baseShadow(8, 16, 12, 0.25),
  glow: (color: string) =>
    Platform.select({
      ios: {
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
      default: {},
    }) as Record<string, any>,
};

export const GLASS = {
  intensity: 25,
  borderColor: 'rgba(255,255,255,0.08)',
  backgroundColor: (surfaceColor: string) => surfaceColor + 'B3', // 70% opacity
};

export const GRADIENT = {
  primary: ['#E53170', '#4ECDC4'] as [string, string],
};

export const SPRING = {
  button: { damping: 15, stiffness: 150 },
  progress: { damping: 18, stiffness: 90 },
  bounce: { damping: 8, stiffness: 200 },
};
