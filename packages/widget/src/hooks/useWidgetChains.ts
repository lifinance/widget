import type { ExtendedChain } from '@lifi/sdk'
import type { WidgetConfig } from '../types/widget.js'
import { useAvailableChains } from './useAvailableChains.js'

export const useWidgetChains = (
  widgetConfig: WidgetConfig
): {
  chains: ExtendedChain[] | undefined
  getChainById: (
    chainId?: number,
    chains?: ExtendedChain[]
  ) => ExtendedChain | undefined
  isLoading: boolean
} => {
  return useAvailableChains(undefined, widgetConfig)
}
