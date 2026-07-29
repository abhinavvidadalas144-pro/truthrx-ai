export type ThemeMode = 'light' | 'dark' | 'system';

export function getSavedTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem('truthrx_theme') as ThemeMode | null;
  if (saved === 'dark' || saved === 'light' || saved === 'system') {
    return saved;
  }
  return 'light'; // default theme
}

export function isDarkModeActive(theme: ThemeMode = getSavedTheme()): boolean {
  if (typeof window === 'undefined') return false;
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function applyTheme(theme: ThemeMode): boolean {
  if (typeof window === 'undefined') return false;

  localStorage.setItem('truthrx_theme', theme);
  const isDark = isDarkModeActive(theme);

  const root = document.documentElement;
  if (isDark) {
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }

  window.dispatchEvent(new CustomEvent('truthrx_theme_changed', {
    detail: { theme, isDark }
  }));

  return isDark;
}

export function initTheme(): () => void {
  if (typeof window === 'undefined') return () => {};

  const initialTheme = getSavedTheme();
  applyTheme(initialTheme);

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemChange = () => {
    if (getSavedTheme() === 'system') {
      applyTheme('system');
    }
  };

  try {
    mediaQuery.addEventListener('change', handleSystemChange);
  } catch {
    mediaQuery.addListener(handleSystemChange);
  }

  return () => {
    try {
      mediaQuery.removeEventListener('change', handleSystemChange);
    } catch {
      mediaQuery.removeListener(handleSystemChange);
    }
  };
}
