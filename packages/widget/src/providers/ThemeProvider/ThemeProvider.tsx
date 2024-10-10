import type { PaletteMode } from '@mui/material'
import { ThemeProvider as MuiThemeProvider, useMediaQuery } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useAppearance } from '../../stores/settings/useAppearance.js'
import { createTheme } from '../../themes/createTheme.js'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { appearance: colorSchemeMode, theme: themeConfig } = useWidgetConfig()
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [appearance, setAppearance] = useAppearance()
  const [mode, setMode] = useState<PaletteMode>(
    (colorSchemeMode ?? appearance === 'auto')
      ? prefersDarkMode
        ? 'dark'
        : 'light'
      : appearance
  )

  useEffect(() => {
    if (appearance === 'auto') {
      setMode(prefersDarkMode ? 'dark' : 'light')
    } else {
      setMode(appearance)
    }
  }, [appearance, prefersDarkMode])

  // biome-ignore lint/correctness/useExhaustiveDependencies: setAppearance is stable
  useEffect(() => {
    if (colorSchemeMode) {
      setAppearance(colorSchemeMode)
    }
  }, [colorSchemeMode])

  const theme = useMemo(
    () => createTheme(mode, themeConfig),
    [mode, themeConfig]
  )
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
}
