import { ChainId, ChainType } from '@lifi/sdk'
import type { ChainRef, IsAddressForChain } from '@lifi/widget-provider'
import type { WidgetChains } from '../types/widget.js'

export const defaultChainIdsByType: Record<ChainType, ChainId> = {
  [ChainType.EVM]: ChainId.ETH,
  [ChainType.SVM]: ChainId.SOL,
  [ChainType.UTXO]: ChainId.BTC,
  [ChainType.MVM]: ChainId.SUI,
  [ChainType.TVM]: ChainId.TRN,
  [ChainType.STL]: ChainId.XLM,
}

/**
 * Chains a route may deliver to but never start from, because no wallet can
 * sign on them yet.
 */
export const destinationOnlyChainIds: ReadonlySet<number> = new Set<number>([
  ChainId.ZEC,
])

export const isDestinationOnlyChain = (chainId?: number): boolean =>
  chainId !== undefined && destinationOnlyChainIds.has(chainId)

/**
 * The integrator's chain config with every destination-only chain denied as a
 * source, so the widget's allow/deny filters keep it out of every source chain
 * and token list.
 */
export const withDestinationOnlyChains = (
  chains: WidgetChains | undefined
): WidgetChains => {
  const allow = chains?.from?.allow?.filter(
    (chainId) => !isDestinationOnlyChain(chainId)
  )
  return {
    ...chains,
    from: {
      ...chains?.from,
      ...(allow && { allow }),
      deny: [...(chains?.from?.deny ?? []), ...destinationOnlyChainIds],
    },
  }
}

/**
 * The chain a saved receiver must show when its ecosystem's default chain would
 * be wrong: a Zcash address is valid on ZEC but not on BTC. `address` must be
 * valid on `chain`.
 */
export const bookmarkChainId = (
  address: string,
  chain: ChainRef,
  isAddressForChain: IsAddressForChain
): ChainId | undefined => {
  const defaultChainId = defaultChainIdsByType[chain.chainType]
  if (chain.id === defaultChainId) {
    return undefined
  }
  return isAddressForChain(address, {
    id: defaultChainId,
    chainType: chain.chainType,
  })
    ? undefined
    : chain.id
}
