import { ChainId, ChainType } from '@lifi/sdk'
import type { ChainRef, IsAddressForChain } from '@lifi/widget-provider'

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
