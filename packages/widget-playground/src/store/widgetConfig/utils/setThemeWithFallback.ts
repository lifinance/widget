import type { WidgetConfigState } from '../types.js'
import { replayLocalStorageChangesOnTheme } from './replayLocalStorageChangesOnTheme.js'

export const setThemeAppearanceWithFallback = (
  state: WidgetConfigState,
  prefersDarkMode: boolean
) => {
  const themeId =
    state.themeId &&
    !!state.widgetThemeItems.find((themeItem) => themeItem.id === state.themeId)
      ? state.themeId
      : 'default'

  let appearance =
    state.config?.appearance === 'system' || !state.config?.appearance
      ? prefersDarkMode
        ? 'dark'
        : 'light'
      : state.config.appearance

  let theme = state.widgetThemeItems.find(
    (themeItem) => themeItem.id === themeId
  )?.theme

  if (!theme?.colorSchemes?.[appearance]) {
    appearance = appearance === 'light' ? 'dark' : 'light'
    state.setAppearance(appearance)
  }

  if (theme && state.config?.theme && state.themeId === themeId) {
    theme = replayLocalStorageChangesOnTheme(theme, state.config)
  }
  if (theme) {
    state.setConfigTheme(theme, themeId)
  }
}
