import { useWidgetConfigStore } from './WidgetConfigProvider'

export const useDefaultTheme = () => {
  const defaultTheme = useWidgetConfigStore(
    (state) => state.defaultConfig?.theme
  )

  return {
    defaultTheme: defaultTheme || {},
  }
}
