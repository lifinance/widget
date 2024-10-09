import type { WidgetTheme } from '@lifi/widget'
import type { WidgetConfigState } from '../types'
import { replayLocalStorageChangesOnTheme } from './replayLocalStorageChangesOnTheme'

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
    state.config?.appearance === 'auto' || !state.config?.appearance
      ? prefersDarkMode
        ? 'dark'
        : 'light'
      : state.config.appearance

  const themeAppearances = state.widgetThemeItems.find(
    (themeItem) => themeItem.id === themeId
  )?.theme

  let theme: WidgetTheme | undefined

  if (themeAppearances?.[appearance]) {
    theme = themeAppearances[appearance]
  } else {
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
