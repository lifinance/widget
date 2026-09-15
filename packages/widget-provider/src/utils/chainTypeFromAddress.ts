import { ChainType, type SDKProvider } from '@lifi/sdk'

/** A provider is asked for its address checks only. */
export type AddressChecks = Pick<SDKProvider, 'isAddress' | 'isTokenAddress'>

export type ProvidersByChainType = Partial<Record<ChainType, AddressChecks>>

// The first match wins, so this order decides a value two ecosystems accept.
const detectionOrder = [
  ChainType.EVM,
  ChainType.SVM,
  ChainType.UTXO,
  ChainType.MVM,
  ChainType.TVM,
  ChainType.STL,
]

/** The chain type of the provider that accepts `address` as a wallet address. */
export const chainTypeFromAddress = (
  providers: ProvidersByChainType,
  address: string
): ChainType | undefined =>
  detectionOrder.find((chainType) => providers[chainType]?.isAddress(address))

/**
 * The chain type of the provider that accepts `address` as a token identifier.
 * A provider that implements no `isTokenAddress` has no token address format,
 * so it never matches: `BitcoinProvider` omits the method because the token
 * list names its native coin `bitcoin`. `isAddress` is never a fallback, since
 * it accepts wallet addresses that name no token.
 */
export const chainTypeFromTokenAddress = (
  providers: ProvidersByChainType,
  address: string
): ChainType | undefined =>
  detectionOrder.find((chainType) =>
    providers[chainType]?.isTokenAddress?.(address)
  )
