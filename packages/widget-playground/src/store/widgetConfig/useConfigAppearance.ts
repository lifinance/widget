import { useWidgetConfigStore } from './WidgetConfigProvider.js'

export const useConfigAppearance = () => {
  const appearance = useWidgetConfigStore((store) => store.config?.appearance)

  return {
    appearance: !appearance ? 'system' : appearance,
  }
}
