import {
  type Chain,
  type ChainId,
  ChainType,
  findProvider,
  type SDKProvider,
} from '@lifi/sdk'

/** A provider is asked for its address checks only. */
export type AddressChecks = Pick<
  SDKProvider,
  'type' | 'chainIds' | 'isAddress' | 'isTokenAddress'
>

// The first match wins, so this order decides a value two ecosystems accept.
const detectionOrder = [
  ChainType.EVM,
  ChainType.SVM,
  ChainType.UTXO,
  ChainType.MVM,
  ChainType.TVM,
  ChainType.STL,
]

const detectProvider = (
  providers: readonly AddressChecks[],
  accepts: (provider: AddressChecks) => boolean
): AddressChecks | undefined => {
  for (const chainType of detectionOrder) {
    const provider = providers.find(
      (provider) => provider.type === chainType && accepts(provider)
    )
    if (provider) {
      return provider
    }
  }
  return undefined
}

/** The ecosystem of an address, and its chain when only one chain takes that format. */
export type AddressChain = {
  chainType: ChainType
  chainId?: ChainId
}

/** Where `address` is a wallet address, from the provider that accepts it. */
export const chainFromAddress = (
  providers: readonly AddressChecks[],
  address: string
): AddressChain | undefined => {
  const provider = detectProvider(providers, (provider) =>
    provider.isAddress(address)
  )
  if (!provider) {
    return undefined
  }
  const chainId =
    provider.chainIds?.length === 1 ? provider.chainIds[0] : undefined
  return { chainType: provider.type, ...(chainId !== undefined && { chainId }) }
}

/** The chain type of the provider that accepts `address` as a wallet address. */
export const chainTypeFromAddress = (
  providers: readonly AddressChecks[],
  address: string
): ChainType | undefined => chainFromAddress(providers, address)?.chainType

/**
 * The chain type of the provider that accepts `address` as a token identifier.
 * A provider that implements no `isTokenAddress` has no token address format,
 * so it never matches: `BitcoinProvider` omits the method because the token
 * list names its native coin `bitcoin`. `isAddress` is never a fallback, since
 * it accepts wallet addresses that name no token.
 */
export const chainTypeFromTokenAddress = (
  providers: readonly AddressChecks[],
  address: string
): ChainType | undefined =>
  detectProvider(
    providers,
    (provider) => provider.isTokenAddress?.(address) ?? false
  )?.type

export type ChainRef = Pick<Chain, 'id' | 'chainType'>

export type IsAddressForChain = (address: string, chain: ChainRef) => boolean

/** Whether `address` can receive on `chain`, asked of the provider that serves it. */
export const isAddressForChain = (
  providers: readonly AddressChecks[],
  address: string,
  chain: ChainRef
): boolean =>
  findProvider(providers, chain.chainType, chain.id)?.isAddress(
    address,
    chain.id
  ) ?? false
