import type { WidgetConfig } from '../types/widget.js'
import { useAvailableChains } from './useAvailableChains.js'

export const useWidgetChains = (widgetConfig?: Partial<WidgetConfig>) => {
  return useAvailableChains(undefined, widgetConfig as WidgetConfig)
}
