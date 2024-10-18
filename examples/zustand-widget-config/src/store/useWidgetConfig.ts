import { useWidgetConfigStore } from './createWidgetConfigStore.ts'

export const useWidgetConfig = () => {
  const { config } = useWidgetConfigStore((state) => ({
    config: state.config,
  }))

  return {
    config,
  }
}
