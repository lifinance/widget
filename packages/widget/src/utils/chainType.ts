import { ChainId, ChainType, type SDKProvider } from '@lifi/sdk'
import type { ChainRef, IsAddressForChain } from '@lifi/widget-provider'
import type { WidgetChains } from '../types/widget.js'
import { isItemAllowed } from './item.js'

export const defaultChainIdsByType: Record<ChainType, ChainId> = {
  [ChainType.EVM]: ChainId.ETH,
  [ChainType.SVM]: ChainId.SOL,
  [ChainType.UTXO]: ChainId.BTC,
  [ChainType.MVM]: ChainId.SUI,
  [ChainType.TVM]: ChainId.TRN,
  [ChainType.STL]: ChainId.XLM,
}

// No wallet can sign on these chains yet, so a route may only deliver to them.
const destinationOnlyChainIds: ReadonlySet<number> = new Set<number>([
  ChainId.ZEC,
])

export const isDestinationOnlyChain = (chainId?: number): boolean =>
  chainId !== undefined && destinationOnlyChainIds.has(chainId)

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

// A destination-only chain takes a receiver only through a provider that lists it.
export const withServedDestinationChains = (
  chains: WidgetChains | undefined,
  providers: readonly Pick<SDKProvider, 'chainIds'>[]
): WidgetChains | undefined => {
  const unserved = [...destinationOnlyChainIds].filter(
    (chainId) =>
      !providers.some((provider) =>
        provider.chainIds?.some((id) => id === chainId)
      )
  )
  if (!unserved.length) {
    return chains
  }
  const allow = chains?.allow?.filter((chainId) => !unserved.includes(chainId))
  return {
    ...chains,
    ...(allow && { allow }),
    deny: [...(chains?.deny ?? []), ...unserved],
  }
}

export const isDestinationAllowedAsSource = (
  toChainId: number | undefined,
  chains: WidgetChains | undefined
): boolean => !toChainId || isItemAllowed(toChainId, chains?.from)

// A Zcash address is valid on ZEC but not on BTC, the UTXO default chain.
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
