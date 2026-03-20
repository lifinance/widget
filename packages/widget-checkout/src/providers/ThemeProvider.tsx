import {
  CssBaseline,
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material'
import type { PropsWithChildren } from 'react'
import { useMemo } from 'react'
import { useCheckoutConfig } from './CheckoutProvider.js'

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const config = useCheckoutConfig()

  const theme = useMemo(() => {
    const baseTheme = createTheme({
      cssVariables: {
        colorSchemeSelector: 'class',
      },
      colorSchemes: {
        light: {
          palette: {
            mode: 'light',
            primary: {
              main: '#1976d2',
            },
            background: {
              default: '#ffffff',
              paper: '#f5f5f5',
            },
            ...config.theme?.colorSchemes?.light?.palette,
          },
        },
        dark: {
          palette: {
            mode: 'dark',
            primary: {
              main: '#90caf9',
            },
            background: {
              default: '#121212',
              paper: '#1e1e1e',
            },
            ...config.theme?.colorSchemes?.dark?.palette,
          },
        },
      },
      shape: {
        borderRadius: 12,
        ...config.theme?.shape,
      },
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        ...config.theme?.typography,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              borderRadius: 12,
            },
          },
          ...config.theme?.components?.MuiButton,
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 16,
            },
          },
          ...config.theme?.components?.MuiCard,
        },
        ...config.theme?.components,
      },
    })

    return baseTheme
  }, [config.theme])

  return (
    <MuiThemeProvider theme={theme} defaultMode={config.appearance ?? 'system'}>
      <CssBaseline enableColorScheme />
      {children}
    </MuiThemeProvider>
  )
}
