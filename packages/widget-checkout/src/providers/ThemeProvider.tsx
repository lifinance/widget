import { createTheme } from '@lifi/widget'
import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material'
import type { PropsWithChildren } from 'react'
import { useMemo } from 'react'
import { checkoutThemeToWidgetTheme } from '../utils/checkoutThemeToWidgetTheme.js'
import { useCheckoutConfig } from './CheckoutProvider.js'

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const config = useCheckoutConfig()

  const theme = useMemo(
    () => createTheme(checkoutThemeToWidgetTheme(config.theme)),
    [config.theme]
  )

  return (
    <MuiThemeProvider theme={theme} defaultMode={config.appearance ?? 'system'}>
      <CssBaseline enableColorScheme />
      {children}
    </MuiThemeProvider>
  )
}
