import { CssBaseline, ThemeProvider } from '@mui/material'
import { type PropsWithChildren, useMemo } from 'react'
import { usePlaygroundSettingValues } from '../../store/editTools/usePlaygroundSettingValues'
import { theme } from './theme'

export const PlaygroundThemeProvider = ({ children }: PropsWithChildren) => {
  const { viewportColor } = usePlaygroundSettingValues()
  const appTheme = useMemo(
    () => ({
      ...theme,
      ...(viewportColor
        ? {
            playground: {
              background: viewportColor,
            },
          }
        : {}),
    }),
    [viewportColor]
  )

  return (
    <ThemeProvider
      theme={appTheme}
      modeStorageKey="li.fi-widget-playground-mode"
      colorSchemeStorageKey="li.fi-widget-playground-color-scheme"
      disableTransitionOnChange
    >
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  )
}
