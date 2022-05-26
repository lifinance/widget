import { PaletteMode, useMediaQuery } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createColorSchemeTheme } from '../../config/theme';
import type { ThemeContextProps } from './types';

const stub = (): never => {
  throw new Error('You forgot to wrap your component in <ThemeProvider>.');
};

const initialContext: ThemeContextProps = {
  toggleColorScheme: stub,
};

const ThemeContext = createContext<ThemeContextProps>(initialContext);

export const useColorScheme = (): ThemeContextProps => useContext(ThemeContext);

export const ThemeProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<PaletteMode>(
    prefersDarkMode ? 'dark' : 'light',
  );
  const context = useMemo(
    () => ({
      toggleColorScheme: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === 'light' ? 'dark' : 'light',
        );
      },
    }),
    [],
  );

  useEffect(() => {
    setMode(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode]);

  const theme = useMemo(() => createColorSchemeTheme(mode), [mode]);
  return (
    <ThemeContext.Provider value={context}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
