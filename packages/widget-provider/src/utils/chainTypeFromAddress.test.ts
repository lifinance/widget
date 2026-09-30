import { ChainId, ChainType } from '@lifi/sdk'
import { describe, expect, it } from 'vitest'
import {
  type AddressChecks,
  chainFromAddress,
  chainTypeFromAddress,
  chainTypeFromTokenAddress,
  isAddressForChain,
} from './chainTypeFromAddress.js'

const evmAddress = '0xB095274743941e953c746F9C228DA9c18Bb6ec29'
const stellarContract =
  'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75'
const stellarAccount =
  'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN'
const bitcoinAddress = 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
const zcashAddress = 't1VmmGiyjVNeCjxDZzg7vZmd99WyzVby9yC'

/** Answers for the values it is given, as a provider does for its ecosystem. */
const provider = (
  type: ChainType,
  addresses: string[],
  tokenAddresses?: string[]
): AddressChecks => ({
  type,
  isAddress: (address) => addresses.includes(address),
  ...(tokenAddresses && {
    isTokenAddress: (address) => tokenAddresses.includes(address),
  }),
})

// Like BitcoinProvider, it refuses every UTXO chain but BTC.
const bitcoinProvider: AddressChecks = {
  type: ChainType.UTXO,
  isAddress: (address, chainId) =>
    (chainId === undefined || chainId === ChainId.BTC) &&
    address === bitcoinAddress,
}
const zcashProvider: AddressChecks = {
  type: ChainType.UTXO,
  chainIds: [ChainId.ZEC],
  isAddress: (address) => address === zcashAddress,
}

describe('chainTypeFromAddress', () => {
  it('returns the chain type of the provider that accepts the address', () => {
    const providers = [
      provider(ChainType.EVM, [evmAddress]),
      provider(ChainType.STL, [stellarAccount]),
    ]

    expect(chainTypeFromAddress(providers, stellarAccount)).toBe(ChainType.STL)
  })

  it('returns nothing when no configured provider accepts the address', () => {
    const providers = [provider(ChainType.EVM, [evmAddress])]

    expect(chainTypeFromAddress(providers, stellarAccount)).toBeUndefined()
  })
})

describe('chainFromAddress', () => {
  const providers = [bitcoinProvider, zcashProvider]

  it('adds the chain of a provider that serves one chain only', () => {
    expect(chainFromAddress(providers, zcashAddress)).toEqual({
      chainType: ChainType.UTXO,
      chainId: ChainId.ZEC,
    })
  })

  it('adds no chain for a provider of a whole chain type', () => {
    expect(chainFromAddress(providers, bitcoinAddress)).toEqual({
      chainType: ChainType.UTXO,
    })
  })

  it('returns nothing for an address no provider accepts', () => {
    expect(chainFromAddress(providers, evmAddress)).toBeUndefined()
  })
})

describe('chainTypeFromTokenAddress', () => {
  it('asks the token check, not the wallet check', () => {
    // A Stellar account holds a balance, and it names no token.
    const providers = [
      provider(ChainType.STL, [stellarAccount], [stellarContract]),
    ]

    expect(chainTypeFromTokenAddress(providers, stellarContract)).toBe(
      ChainType.STL
    )
    expect(chainTypeFromTokenAddress(providers, stellarAccount)).toBeUndefined()
  })

  it('never matches a provider that implements no token check', () => {
    // BitcoinProvider omits it: the token list names the native coin
    // `bitcoin`, so UTXO has no token address format.
    const providers = [
      provider(ChainType.UTXO, ['1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa']),
    ]

    expect(chainTypeFromTokenAddress(providers, 'bitcoin')).toBeUndefined()
    expect(
      chainTypeFromTokenAddress(providers, '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')
    ).toBeUndefined()
  })

  it('returns the first chain type in detection order, whatever the list order', () => {
    const providers = [
      provider(ChainType.TVM, [], [evmAddress]),
      provider(ChainType.EVM, [], [evmAddress]),
    ]

    expect(chainTypeFromTokenAddress(providers, evmAddress)).toBe(ChainType.EVM)
  })

  it('finds nothing in an empty list', () => {
    expect(chainTypeFromTokenAddress([], stellarContract)).toBeUndefined()
  })
})

describe('isAddressForChain', () => {
  const bitcoin = { id: ChainId.BTC, chainType: ChainType.UTXO }
  const zcash = { id: ChainId.ZEC, chainType: ChainType.UTXO }
  const ethereum = { id: ChainId.ETH, chainType: ChainType.EVM }
  const providers = [
    provider(ChainType.EVM, [evmAddress]),
    bitcoinProvider,
    zcashProvider,
  ]

  it('asks the provider that serves the destination chain', () => {
    expect(isAddressForChain(providers, zcashAddress, zcash)).toBe(true)
    expect(isAddressForChain(providers, bitcoinAddress, zcash)).toBe(false)
    expect(isAddressForChain(providers, bitcoinAddress, bitcoin)).toBe(true)
    expect(isAddressForChain(providers, zcashAddress, bitcoin)).toBe(false)
  })

  it('never asks the provider of another ecosystem', () => {
    expect(isAddressForChain(providers, evmAddress, zcash)).toBe(false)
    expect(isAddressForChain(providers, evmAddress, ethereum)).toBe(true)
  })

  it('falls back to the provider of the chain type when no provider lists the chain', () => {
    expect(isAddressForChain([bitcoinProvider], zcashAddress, zcash)).toBe(
      false
    )
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
