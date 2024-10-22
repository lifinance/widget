import { shallow } from 'zustand/shallow'
import { useWidgetConfigStore } from './WidgetConfigProvider'

export const useDefaultTheme = () => {
  const defaultTheme = useWidgetConfigStore(
    (state) => state.defaultConfig?.theme,
    shallow
  )

  return {
    defaultTheme: defaultTheme || {},
  }
}
