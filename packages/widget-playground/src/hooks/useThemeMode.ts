import type { Appearance } from '@lifi/widget'
import { type PaletteMode, useColorScheme, useMediaQuery } from '@mui/material'

export const useThemeMode = (): {
  themeMode: PaletteMode
  colorSchemeMode: Appearance
  prefersDarkMode: boolean
  setMode: (mode: Appearance) => void
} => {
  const { mode, setMode } = useColorScheme()
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  return {
    themeMode:
      mode === 'system'
        ? prefersDarkMode
          ? 'dark'
          : 'light'
        : (mode ?? 'light'),
    colorSchemeMode: mode ?? 'system',
    prefersDarkMode,
    setMode,
  }
}
