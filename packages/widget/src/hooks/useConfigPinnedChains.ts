import type { ExtendedChain } from '@lifi/sdk'
import { useMemo } from 'react'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../stores/form/types.js'
import type { PinnedChain } from '../types/widget.js'
import { getConfigPinnedChains } from '../utils/pinnedChains.js'

export const useConfigPinnedChains = (
  chains: ExtendedChain[] | undefined,
  side: FormType | undefined
): Map<number, PinnedChain> => {
  const { chains: chainsConfig } = useWidgetConfig()
  const pinned = chainsConfig?.pinned
  return useMemo(
    () =>
      side && chains
        ? getConfigPinnedChains(pinned, chains, side)
        : new Map<number, PinnedChain>(),
    [pinned, chains, side]
  )
}
