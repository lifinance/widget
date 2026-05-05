import type { WidgetConfig } from '@lifi/widget'
import { useWidgetConfigStore } from './WidgetConfigProvider.js'

export const useDefaultConfig = (): {
  defaultConfig: Partial<WidgetConfig> | undefined
} => {
  const defaultConfig = useWidgetConfigStore((state) => state.defaultConfig)

  return {
    defaultConfig,
  }
}
