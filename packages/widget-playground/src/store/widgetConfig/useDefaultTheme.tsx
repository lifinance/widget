import { useWidgetConfigStore } from './WidgetConfigProvider.js'

export const useDefaultTheme = () => {
  const defaultTheme = useWidgetConfigStore(
    (state) => state.defaultConfig?.theme
  )

  return {
    defaultTheme: defaultTheme || {},
  }
}
