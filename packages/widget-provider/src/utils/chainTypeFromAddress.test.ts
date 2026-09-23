import { ChainId, ChainType } from '@lifi/sdk'
import { describe, expect, it } from 'vitest'
import {
  type AddressChecks,
  chainTypeFromAddress,
  chainTypeFromTokenAddress,
  isAddressForChain,
  type ProvidersByChainType,
} from './chainTypeFromAddress.js'

const evmAddress = '0xB095274743941e953c746F9C228DA9c18Bb6ec29'
const stellarContract =
  'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75'
const stellarAccount =
  'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN'

/** Answers for the values it is given, as a provider does for its ecosystem. */
const provider = (
  addresses: string[],
  tokenAddresses?: string[]
): AddressChecks => ({
  isAddress: (address) => addresses.includes(address),
  ...(tokenAddresses && {
    isTokenAddress: (address) => tokenAddresses.includes(address),
  }),
})

describe('chainTypeFromAddress', () => {
  it('returns the chain type of the provider that accepts the address', () => {
    const providers: ProvidersByChainType = {
      [ChainType.EVM]: provider([evmAddress]),
      [ChainType.STL]: provider([stellarAccount]),
    }

    expect(chainTypeFromAddress(providers, stellarAccount)).toBe(ChainType.STL)
  })

  it('returns nothing when no configured provider accepts the address', () => {
    const providers: ProvidersByChainType = {
      [ChainType.EVM]: provider([evmAddress]),
      [ChainType.STL]: undefined,
    }

    expect(chainTypeFromAddress(providers, stellarAccount)).toBeUndefined()
  })
})

describe('chainTypeFromTokenAddress', () => {
  it('asks the token check, not the wallet check', () => {
    // A Stellar account holds a balance, and it names no token.
    const providers: ProvidersByChainType = {
      [ChainType.STL]: provider([stellarAccount], [stellarContract]),
    }

    expect(chainTypeFromTokenAddress(providers, stellarContract)).toBe(
      ChainType.STL
    )
    expect(chainTypeFromTokenAddress(providers, stellarAccount)).toBeUndefined()
  })

  it('never matches a provider that implements no token check', () => {
    // BitcoinProvider omits it: the token list names the native coin
    // `bitcoin`, so UTXO has no token address format.
    const providers: ProvidersByChainType = {
      [ChainType.UTXO]: provider(['1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa']),
    }

    expect(chainTypeFromTokenAddress(providers, 'bitcoin')).toBeUndefined()
    expect(
      chainTypeFromTokenAddress(providers, '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')
    ).toBeUndefined()
  })

  it('returns the first chain type in detection order', () => {
    const providers: ProvidersByChainType = {
      [ChainType.EVM]: provider([], [evmAddress]),
      [ChainType.TVM]: provider([], [evmAddress]),
    }

    expect(chainTypeFromTokenAddress(providers, evmAddress)).toBe(ChainType.EVM)
  })

  it('skips a provider that is not configured', () => {
    expect(
      chainTypeFromTokenAddress({ [ChainType.STL]: undefined }, stellarContract)
    ).toBeUndefined()
  })
})

describe('isAddressForChain', () => {
  const bitcoinAddress = 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
  const zcashAddress = 't1VmmGiyjVNeCjxDZzg7vZmd99WyzVby9yC'
  const bitcoin = { id: ChainId.BTC, chainType: ChainType.UTXO }
  const zcash = { id: ChainId.ZEC, chainType: ChainType.UTXO }
  const ethereum = { id: ChainId.ETH, chainType: ChainType.EVM }

  // The UTXO provider answers per chain, as BitcoinProvider does.
  const providers: ProvidersByChainType = {
    [ChainType.EVM]: provider([evmAddress]),
    [ChainType.UTXO]: {
      isAddress: (address, chainId) =>
        chainId === ChainId.ZEC
          ? address === zcashAddress
          : address === bitcoinAddress,
    },
  }

  it('asks the destination provider with the destination chain', () => {
    expect(isAddressForChain(providers, zcashAddress, zcash)).toBe(true)
    expect(isAddressForChain(providers, bitcoinAddress, zcash)).toBe(false)
    expect(isAddressForChain(providers, bitcoinAddress, bitcoin)).toBe(true)
    expect(isAddressForChain(providers, zcashAddress, bitcoin)).toBe(false)
  })

  it('never asks the provider of another ecosystem', () => {
    expect(isAddressForChain(providers, evmAddress, zcash)).toBe(false)
    expect(isAddressForChain(providers, evmAddress, ethereum)).toBe(true)
  })

  it('refuses when no provider serves the ecosystem', () => {
    expect(
      isAddressForChain(providers, stellarAccount, {
        id: ChainId.XLM,
        chainType: ChainType.STL,
      })
    ).toBe(false)
  })
})
