import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider'
import { ExpansionType, HiddenUI } from '../types/widget'
import { useExpansionRoutes } from './useExpansionRoutes'
import { useSwapOnly } from './useSwapOnly'

export const useHasChainExpansion = () => {
  const { hiddenUI } = useWidgetConfig()
  const swapOnly = useSwapOnly()
  const expansionType = useExpansionRoutes()

  return (
    (expansionType === ExpansionType.FromChain ||
      expansionType === ExpansionType.ToChain) &&
    !(swapOnly && expansionType === ExpansionType.ToChain) &&
    !hiddenUI?.includes(HiddenUI.ChainSelect)
  )
}
