import { PaletteMode, useMediaQuery } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { useEffect, useMemo, useState } from 'react';
import { createTheme } from '../../config/theme';
import { useAppearance } from '../../hooks';

export const ThemeProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [appearance] = useAppearance();
  const [mode, setMode] = useState<PaletteMode>(
    appearance === 'system' ? (prefersDarkMode ? 'dark' : 'light') : appearance,
  );

  useEffect(() => {
    if (appearance === 'system') {
      setMode(prefersDarkMode ? 'dark' : 'light');
    } else {
      setMode(appearance);
    }
  }, [appearance, prefersDarkMode]);

  const theme = useMemo(() => createTheme(mode), [mode]);
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};
