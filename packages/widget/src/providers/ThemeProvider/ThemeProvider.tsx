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
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  // const [appearance, setAppearance] = useAppearance()
  const { setMode } = useColorScheme()
  // const [paletteMode, setPaletteMode] = useState<PaletteMode>(
  //   (colorSchemeMode ?? appearance === 'auto')
  //     ? prefersDarkMode
  //       ? 'dark'
  //       : 'light'
  //     : appearance
  // )

  // useEffect(() => {
  //   if (appearance === 'auto') {
  //     setPaletteMode(prefersDarkMode ? 'dark' : 'light')
  //     setMode('system')
  //   } else {
  //     setPaletteMode(appearance)
  //     setMode(appearance)
  //   }
  // }, [appearance, prefersDarkMode, setMode])

  // biome-ignore lint/correctness/useExhaustiveDependencies: setAppearance is stable
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
