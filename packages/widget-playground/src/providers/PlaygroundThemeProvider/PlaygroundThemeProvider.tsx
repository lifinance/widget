import { CssBaseline, ThemeProvider } from '@mui/material'
import type { PropsWithChildren } from 'react'
import { useThemeMode } from '../../hooks/useThemeMode'
import { usePlaygroundSettingValues } from '../../store/editTools/usePlaygroundSettingValues'
import { theme } from './theme'
import { darkComponents, darkPalette } from './themeOverrides/dark'
import { lightComponents, lightPalette } from './themeOverrides/light'

const appearancePaletteOverrides = {
  light: lightPalette,
  dark: darkPalette,
}

export const PlaygroundThemeProvider = ({ children }: PropsWithChildren) => {
  const themeMode = useThemeMode()
  const { viewportColor } = usePlaygroundSettingValues()

  const appTheme = {
    ...theme,
    ...(viewportColor
      ? {
          playground: {
            background: viewportColor,
          },
        }
      : {}),
    palette: {
      ...theme.palette,
      ...appearancePaletteOverrides[themeMode],
    },
    components: {
      ...theme.components,
      ...(themeMode === 'dark' ? darkComponents : lightComponents),
    },
  }

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  )
}
