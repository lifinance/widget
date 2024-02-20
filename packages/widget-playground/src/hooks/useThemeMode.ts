import { useConfigAppearance } from '../store';
import { useMediaQuery } from '@mui/material';

type ThemeMode = 'dark' | 'light';
export const useThemeMode = (): ThemeMode => {
  const { appearance } = useConfigAppearance();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  return appearance === 'auto'
    ? prefersDarkMode
      ? 'dark'
      : 'light'
    : appearance;
};
