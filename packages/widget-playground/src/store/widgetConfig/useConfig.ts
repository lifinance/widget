import { useWidgetConfigStore } from './WidgetConfigProvider'

export const useConfig = () => {
  const config = useWidgetConfigStore((state) => state.config)

  return {
    config,
  }
}
