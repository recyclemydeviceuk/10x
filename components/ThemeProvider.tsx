'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Three looks, not two.
 *
 *   light — white paper
 *   dark  — charcoal (#111318), the default night look
 *   black — true black, for OLED screens and the brand's ink surfaces
 *
 * `black` deliberately carries the `dark` class as well as its own. Every
 * `dark:` utility in the app then keeps working untouched, and the `.black`
 * token block — which comes later in the stylesheet — overrides the handful of
 * surface colours that differ. Adding a third set of utility variants instead
 * would have meant auditing every component.
 */

export const THEMES = ['light', 'dark', 'black'] as const;
export type Theme = (typeof THEMES)[number];

/** Shared with the no-flash script in app/layout.tsx — keep the key in step. */
export const THEME_STORAGE_KEY = '10x-theme';

const ThemeContext = createContext<{
  theme: Theme;
  /** True until the stored choice has been read — guards a wrong-theme flash. */
  ready: boolean;
  setTheme: (theme: Theme) => void;
  /** light → dark → black → light. */
  toggle: () => void;
}>({ theme: 'light', ready: false, setTheme: () => {}, toggle: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

const isTheme = (value: unknown): value is Theme => THEMES.includes(value as Theme);

function apply(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark' || theme === 'black');
  root.classList.toggle('black', theme === 'black');
  root.dataset.theme = theme;
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [ready, setReady] = useState(false);

  // Read the saved choice. A first-time visitor always starts with the white
  // theme; their device colour scheme must not silently make the shop dark.
  useEffect(() => {
    let initial: Theme = 'light';
    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (isTheme(stored)) initial = stored;
    } catch {
      // Private browsing can refuse reads — the default look still works.
    }
    setThemeState(initial);
    apply(initial);
    setReady(true);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    apply(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // See above — the choice holds for this session regardless.
    }
  }, []);

  const toggle = useCallback(() => {
    setThemeState((current) => {
      const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
      apply(next);
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // See above.
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ theme, ready, setTheme, toggle }), [theme, ready, setTheme, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
