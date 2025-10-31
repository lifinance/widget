import { ThemeProvider as MuiThemeProvider } from '@mui/material'
import { useMemo } from 'react'
import { createTheme } from '../../themes/createTheme.js'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { appearance: colorSchemeMode, theme: themeConfig } = useWidgetConfig()

  const theme = useMemo(() => createTheme(themeConfig), [themeConfig])

  return (
    <MuiThemeProvider
      theme={theme}
      defaultMode={colorSchemeMode ?? 'system'}
      modeStorageKey="li.fi-widget-mode"
      colorSchemeStorageKey="li.fi-widget-color-scheme"
      disableTransitionOnChange
    >
      {children}
    </MuiThemeProvider>
  )
}
