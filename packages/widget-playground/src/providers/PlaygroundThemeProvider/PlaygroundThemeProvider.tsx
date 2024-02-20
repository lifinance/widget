import type { PropsWithChildren } from 'react';
import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './theme';
import { useThemeMode } from '../../hooks';
import {
  lightPalette,
  darkPalette,
  darkComponents,
  lightComponents,
} from './themeOverrides';

const appearancePaletteOverrides = {
  light: lightPalette,
  dark: darkPalette,
};

export const PlaygroundThemeProvider = ({ children }: PropsWithChildren) => {
  const themeMode = useThemeMode();

  const appTheme = {
    ...theme,
    palette: {
      ...theme.palette,
      ...appearancePaletteOverrides[themeMode],
    },
    components: {
      ...theme.components,
      ...(themeMode === 'dark' ? darkComponents : lightComponents),
    },
  };

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
};
