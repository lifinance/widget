import { ThemeProvider as MuiThemeProvider } from '@mui/material'
import type { PropsWithChildren } from 'react'
import { useMemo } from 'react'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { createTheme } from '../../themes/createTheme.js'

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { theme, appearance } = useWidgetConfig()

  const memoedTheme = useMemo(() => createTheme(theme ?? {}), [theme])

  return (
    <MuiThemeProvider theme={memoedTheme} defaultMode={appearance ?? 'system'}>
      {children}
    </MuiThemeProvider>
  )
}
