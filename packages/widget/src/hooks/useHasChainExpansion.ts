import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { ExpansionType, HiddenUI } from '../types/widget.js'
import { useExpansionRoutes } from './useExpansionRoutes.js'
import { useSwapOnly } from './useSwapOnly.js'

export const useHasChainExpansion = () => {
  const { hiddenUI, subvariantOptions } = useWidgetConfig()
  const swapOnly = useSwapOnly()
  const expansionType = useExpansionRoutes()

  const withChainExpansion =
    (expansionType === ExpansionType.FromChain ||
      expansionType === ExpansionType.ToChain) &&
    !(swapOnly && expansionType === ExpansionType.ToChain) &&
    !hiddenUI?.includes(HiddenUI.ChainSelect) &&
    !!subvariantOptions?.wide?.enableChainSidebar

  return [withChainExpansion, expansionType] as const
}
