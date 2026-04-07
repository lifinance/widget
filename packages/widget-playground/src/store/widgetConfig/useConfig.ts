import type { WidgetConfig } from '@lifi/widget'
import { useWidgetConfigStore } from './WidgetConfigProvider.js'

export const useConfig = (): { config: Partial<WidgetConfig> | undefined } => {
  const config = useWidgetConfigStore((state) => state.config)

  return {
    config: config,
  }
}
