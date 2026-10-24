// ---------------------------------------------------------------------------
// theme.js — light / dark / system mode.
//
//   'system' → follow the computer's setting (macOS Appearance)
//   'light'  → always light
//   'dark'   → always dark
//
// The choice is saved in the browser (localStorage), so it's remembered next time.
// It works by setting <html data-theme="light|dark">; index.css swaps the colors.
// ---------------------------------------------------------------------------
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'erp-theme';
export const THEMES = ['system', 'light', 'dark'];

export function getSavedTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(saved) ? saved : 'system';
  } catch {
    return 'system'; // storage blocked (e.g. private window) → just follow the system
  }
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', theme);
  }
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // ignore: the theme still works, it just won't be remembered
  }
}

// const [theme, setTheme] = useTheme();
export function useTheme() {
  const [theme, setTheme] = useState(getSavedTheme);
  useEffect(() => applyTheme(theme), [theme]);
  return [theme, setTheme];
}
