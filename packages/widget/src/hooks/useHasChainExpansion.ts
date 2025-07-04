import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider'
import { ExpansionType, HiddenUI } from '../types/widget'
import { useExpansionRoutes } from './useExpansionRoutes'
import { useSwapOnly } from './useSwapOnly'

export const useHasChainExpansion = () => {
  const { hiddenUI } = useWidgetConfig()
  const swapOnly = useSwapOnly()
  const expansionType = useExpansionRoutes()

  const withChainExpansion =
    (expansionType === ExpansionType.FromChain ||
      expansionType === ExpansionType.ToChain) &&
    !(swapOnly && expansionType === ExpansionType.ToChain) &&
    !hiddenUI?.includes(HiddenUI.ChainSelect)

  return [withChainExpansion, expansionType] as const
}
