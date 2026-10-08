import { ChainId, ChainType, type SDKProvider } from '@lifi/sdk'
import type { WidgetChains, WidgetConfig } from '../types/widget.js'
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

// The form keeps a preset chain that the chain list does not offer.
export const isUnservedDestinationChain = (
  chainId: number | undefined,
  chains: WidgetChains | undefined
): boolean => isDestinationOnlyChain(chainId) && !isItemAllowed(chainId, chains)

// Omitted, not undefined: an own undefined key resets the form field.
export const withoutUnservedToChain = <
  T extends Pick<WidgetConfig, 'chains' | 'toChain' | 'toToken'>,
>(
  config: T
): T => {
  if (!isUnservedDestinationChain(config.toChain, config.chains)) {
    return config
  }
  const { toChain: _toChain, toToken: _toToken, ...rest } = config
  return rest as T
}

export const isDestinationAllowedAsSource = (
  toChainId: number | undefined,
  chains: WidgetChains | undefined
): boolean => !toChainId || isItemAllowed(toChainId, chains?.from)
