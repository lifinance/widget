import { ChainId, ChainType } from '@lifi/sdk'

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
