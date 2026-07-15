import type { WidgetTheme } from '@lifi/widget/shared'
import { createTheme, useWidgetConfig } from '@lifi/widget/shared'
import { ThemeProvider as MuiThemeProvider } from '@mui/material'
import type { PropsWithChildren } from 'react'
import { useMemo } from 'react'

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { theme, appearance } = useWidgetConfig()

  const memoedTheme = useMemo(() => {
    const checkoutTheme: WidgetTheme = {
      ...theme,
      colorSchemes: {
        ...(theme?.colorSchemes ?? {}),
        light: {
          ...(theme?.colorSchemes?.light ?? {}),
          palette: {
            ...(theme?.colorSchemes?.light?.palette ?? {}),
            background: {
              default: '#f7f8fa',
              ...(theme?.colorSchemes?.light?.palette?.background ?? {}),
            },
          },
        },
      },
    }
    return createTheme(checkoutTheme)
  }, [theme])

  return (
    <MuiThemeProvider theme={memoedTheme} defaultMode={appearance ?? 'system'}>
      {children}
    </MuiThemeProvider>
  )
}
