import React, { PropsWithChildren } from 'react';
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { theme } from '@/app/providers/PlaygroundThemeProvider/theme';
import { useConfigAppearance } from '../../store';
import {
  lightPalette,
  darkPalette,
  darkComponents,
  lightComponents,
} from './themeOverrides';

const appearancePaletteOverrides = {
  auto: {},
  light: lightPalette,
  dark: darkPalette,
};

export const PlaygroundThemeProvider = ({ children }: PropsWithChildren) => {
  const { appearance } = useConfigAppearance();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const adjustedAppearance =
    appearance === 'auto' ? (prefersDarkMode ? 'dark' : 'light') : appearance;

  const appTheme = {
    ...theme,
    palette: {
      ...theme.palette,
      ...appearancePaletteOverrides[adjustedAppearance],
    },
    components: {
      ...theme.components,
      ...(adjustedAppearance === 'dark' ? darkComponents : lightComponents),
    },
  };

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
};
