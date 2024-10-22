import { useMediaQuery } from '@mui/material'
import { useConfigAppearance } from '../store/widgetConfig/useConfigAppearance'

export type ThemeMode = 'dark' | 'light'

export const useThemeMode = (): ThemeMode => {
  const { appearance } = useConfigAppearance()
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  return appearance === 'auto'
    ? prefersDarkMode
      ? 'dark'
      : 'light'
    : appearance
}
