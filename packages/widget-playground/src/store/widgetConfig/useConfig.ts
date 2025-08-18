import { useWidgetConfigStore } from './WidgetConfigProvider.js'

export const useConfig = () => {
  const config = useWidgetConfigStore((state) => state.config)

  return {
    config,
  }
}
