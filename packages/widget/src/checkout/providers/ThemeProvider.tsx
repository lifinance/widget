import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material'
import type { PropsWithChildren } from 'react'
import { useMemo } from 'react'
import { createTheme } from '../../themes/createTheme.js'
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
