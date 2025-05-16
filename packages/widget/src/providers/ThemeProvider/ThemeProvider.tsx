import {
  ThemeProvider as MuiThemeProvider,
  useColorScheme,
} from '@mui/material'
import { useEffect, useMemo } from 'react'
import { createTheme } from '../../themes/createTheme.js'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { appearance: colorSchemeMode, theme: themeConfig } = useWidgetConfig()
  const { setMode } = useColorScheme()

  // biome-ignore lint/correctness/useExhaustiveDependencies: setMode is stable
  useEffect(() => {
    if (colorSchemeMode) {
      setMode(colorSchemeMode)
    }
  }, [colorSchemeMode])

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
