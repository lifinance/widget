import { useLocation } from '@tanstack/react-router'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { ExpansionType, HiddenUI } from '../types/widget.js'
import { navigationRoutes } from '../utils/navigationRoutes.js'
import { useSwapOnly } from './useSwapOnly.js'

export const useHasChainExpansion = () => {
  const { hiddenUI, subvariantOptions } = useWidgetConfig()
  const swapOnly = useSwapOnly()
  const location = useLocation()
  const pathname = location.pathname

  const expansionType =
    pathname === navigationRoutes.home
      ? ExpansionType.Routes
      : pathname === navigationRoutes.fromToken
        ? ExpansionType.FromChain
        : pathname === navigationRoutes.toToken
          ? ExpansionType.ToChain
          : null

  const withChainExpansion =
    (expansionType === ExpansionType.FromChain ||
      expansionType === ExpansionType.ToChain) &&
    !(swapOnly && expansionType === ExpansionType.ToChain) &&
    !hiddenUI?.includes(HiddenUI.ChainSelect) &&
    !!subvariantOptions?.wide?.enableChainSidebar

  return [withChainExpansion, expansionType] as const
}
