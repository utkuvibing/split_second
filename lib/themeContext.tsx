import React, { createContext, useContext, useState, useCallback } from 'react';
import { ThemeColors } from '../types/premium';
import { DEFAULT_COLORS, getThemeById } from './themes';

const ThemeContext = createContext<ThemeColors>(DEFAULT_COLORS);
const ThemeSetterContext = createContext<(themeId: string) => void>(() => {});

interface Props {
  initialThemeId?: string;
  children: React.ReactNode;
}

export function ThemeProvider({ initialThemeId = 'default', children }: Props) {
  const [colors, setColors] = useState<ThemeColors>(
    () => getThemeById(initialThemeId).colors
  );

  const setTheme = useCallback((themeId: string) => {
    setColors(getThemeById(themeId).colors);
  }, []);

  return (
    <ThemeContext.Provider value={colors}>
      <ThemeSetterContext.Provider value={setTheme}>
        {children}
      </ThemeSetterContext.Provider>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeColors {
  return useContext(ThemeContext);
}

export function useSetTheme(): (themeId: string) => void {
  return useContext(ThemeSetterContext);
}
