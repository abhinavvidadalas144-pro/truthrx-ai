import { useState, useEffect } from 'react';
import { ThemeMode, getSavedTheme, applyTheme, isDarkModeActive } from '../utils/theme';

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => getSavedTheme());
  const [isDark, setIsDark] = useState<boolean>(() => isDarkModeActive(getSavedTheme()));

  useEffect(() => {
    // Initial sync
    const currentTheme = getSavedTheme();
    setThemeState(currentTheme);
    setIsDark(isDarkModeActive(currentTheme));

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: ThemeMode; isDark: boolean }>;
      if (customEvent.detail) {
        setThemeState(customEvent.detail.theme);
        setIsDark(customEvent.detail.isDark);
      } else {
        const t = getSavedTheme();
        setThemeState(t);
        setIsDark(isDarkModeActive(t));
      }
    };

    window.addEventListener('truthrx_theme_changed', handleThemeChange);
    window.addEventListener('storage', handleThemeChange);

    return () => {
      window.removeEventListener('truthrx_theme_changed', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
  }, []);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    const darkActive = applyTheme(newTheme);
    setIsDark(darkActive);
  };

  const toggleTheme = () => {
    const nextTheme: ThemeMode = isDark ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme
  };
}
