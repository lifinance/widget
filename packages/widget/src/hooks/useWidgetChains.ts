import type { WidgetConfig } from '../types/widget.js'
import { useAvailableChains } from './useAvailableChains.js'

export const useWidgetChains = (widgetConfig: WidgetConfig) => {
  return useAvailableChains(undefined, widgetConfig)
}
