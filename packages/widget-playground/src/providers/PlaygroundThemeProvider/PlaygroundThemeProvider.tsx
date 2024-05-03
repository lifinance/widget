import type { PropsWithChildren } from 'react';
import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { usePlaygroundSettingValues } from '../../store';
import { useThemeMode } from '../../hooks';
import { theme } from './theme';
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
  const { viewportColor } = usePlaygroundSettingValues();

  const appTheme = {
    ...theme,
    ...(viewportColor
      ? {
          playground: {
            background: viewportColor,
          },
        }
      : {}),
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
