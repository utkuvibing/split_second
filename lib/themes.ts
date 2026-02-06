import { ThemeDef, ThemeColors } from '../types/premium';

export const DEFAULT_COLORS: ThemeColors = {
  background: '#0F0E17',
  surface: '#1A1926',
  optionA: '#FF6B6B',
  optionB: '#4ECDC4',
  text: '#FFFFFE',
  textMuted: '#A7A9BE',
  accent: '#E53170',
  success: '#4ADE80',
  warning: '#FBBF24',
};

export const THEMES: ThemeDef[] = [
  {
    id: 'default',
    nameKey: 'themeMidnight',
    colors: DEFAULT_COLORS,
    isPremium: false,
  },
  {
    id: 'ocean',
    nameKey: 'themeOcean',
    colors: {
      background: '#0A1628',
      surface: '#122240',
      optionA: '#FF7B54',
      optionB: '#00D4AA',
      text: '#F0F4FF',
      textMuted: '#7B8FB2',
      accent: '#00B4D8',
      success: '#4ADE80',
      warning: '#FBBF24',
    },
    isPremium: true,
  },
  {
    id: 'sunset',
    nameKey: 'themeSunset',
    colors: {
      background: '#1A0E0E',
      surface: '#2A1515',
      optionA: '#FF6B35',
      optionB: '#F7C948',
      text: '#FFF5EB',
      textMuted: '#B89A82',
      accent: '#FF8C42',
      success: '#4ADE80',
      warning: '#FBBF24',
    },
    isPremium: true,
  },
  {
    id: 'forest',
    nameKey: 'themeForest',
    colors: {
      background: '#0A1A0E',
      surface: '#152A1A',
      optionA: '#E8594F',
      optionB: '#50C878',
      text: '#EAF5EC',
      textMuted: '#7DA88A',
      accent: '#34D399',
      success: '#4ADE80',
      warning: '#FBBF24',
    },
    isPremium: true,
  },
  {
    id: 'rose',
    nameKey: 'themeRose',
    colors: {
      background: '#1A0E17',
      surface: '#2A1525',
      optionA: '#FF6B8A',
      optionB: '#C084FC',
      text: '#FFF0F5',
      textMuted: '#B88EA5',
      accent: '#F472B6',
      success: '#4ADE80',
      warning: '#FBBF24',
    },
    isPremium: true,
  },
  {
    id: 'monochrome',
    nameKey: 'themeNoir',
    colors: {
      background: '#000000',
      surface: '#141414',
      optionA: '#FFFFFF',
      optionB: '#888888',
      text: '#FFFFFF',
      textMuted: '#666666',
      accent: '#CCCCCC',
      success: '#4ADE80',
      warning: '#FBBF24',
    },
    isPremium: true,
  },
];

export function getThemeById(id: string): ThemeDef {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
