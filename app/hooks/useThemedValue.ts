'use client';

import { useTheme } from '../context/ThemeContext';

/**
 * A custom hook that returns a value based on the current theme
 * @param darkValue The value to return when the theme is dark
 * @param lightValue The value to return when the theme is light
 * @returns The value based on the current theme
 */
export function useThemedValue<T>(darkValue: T, lightValue: T): T {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'dark' ? darkValue : lightValue;
}
