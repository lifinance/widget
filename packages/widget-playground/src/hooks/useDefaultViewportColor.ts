import type { Appearance } from '@lifi/widget';
import { useMediaQuery, useTheme } from '@mui/material';

export const useDefaultViewportColor = () => {
  const theme = useTheme();

  const defaultColor =
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.common.black;

  return {
    defaultColor,
  };
};

export const useDefaultViewportColorForMode = () => {
  const theme = useTheme();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const defaultViewportColors = {
    light: theme.palette.grey[100],
    dark: theme.palette.common.black,
  };

  const getDefaultViewportForAppearance = (appearance: Appearance) => {
    const mode =
      appearance === 'auto' ? (prefersDarkMode ? 'dark' : 'light') : appearance;

    return defaultViewportColors[mode];
  };

  return {
    getDefaultViewportForAppearance,
  };
};
