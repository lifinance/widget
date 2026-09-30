import { ChainId, ChainType } from '@lifi/sdk'
import type { IsAddressForChain } from '@lifi/widget-provider'
import { describe, expect, it } from 'vitest'
import {
  bookmarkChainId,
  isDestinationAllowedAsSource,
  isDestinationOnlyChain,
  isUnservedDestinationChain,
  withDestinationOnlyChains,
  withServedDestinationChains,
} from './chainType.js'

describe('isDestinationOnlyChain', () => {
  it('is true for ZEC only', () => {
    expect(isDestinationOnlyChain(ChainId.ZEC)).toBe(true)
    expect(isDestinationOnlyChain(ChainId.BTC)).toBe(false)
    expect(isDestinationOnlyChain(ChainId.ETH)).toBe(false)
  })

  it('is false without a chain', () => {
    expect(isDestinationOnlyChain(undefined)).toBe(false)
    expect(isDestinationOnlyChain(Number.NaN)).toBe(false)
  })
})

describe('bookmarkChainId', () => {
  const evmAddress = '0xB095274743941e953c746F9C228DA9c18Bb6ec29'
  const bitcoinAddress = 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
  const zcashAddress = 't1VmmGiyjVNeCjxDZzg7vZmd99WyzVby9yC'
  // EVM chains share one format; UTXO chains each have their own.
  const isAddressForChain: IsAddressForChain = (address, chain) => {
    if (chain.chainType === ChainType.EVM) {
      return address === evmAddress
    }
    if (chain.id === ChainId.BTC) {
      return address === bitcoinAddress
    }
    return chain.id === ChainId.ZEC && address === zcashAddress
  }

  it('is undefined when the ecosystem default chain accepts the address', () => {
    const arbitrum = { id: ChainId.ARB, chainType: ChainType.EVM }
    const bitcoin = { id: ChainId.BTC, chainType: ChainType.UTXO }
    expect(
      bookmarkChainId(evmAddress, arbitrum, isAddressForChain)
    ).toBeUndefined()
    expect(
      bookmarkChainId(bitcoinAddress, bitcoin, isAddressForChain)
    ).toBeUndefined()
  })

  it('is the chain for an address its default chain rejects', () => {
    const zcash = { id: ChainId.ZEC, chainType: ChainType.UTXO }
    expect(bookmarkChainId(zcashAddress, zcash, isAddressForChain)).toBe(
      ChainId.ZEC
    )
  })
})

describe('withDestinationOnlyChains', () => {
  it('denies every destination-only chain as a source', () => {
    expect(withDestinationOnlyChains(undefined)).toEqual({
      from: { deny: [ChainId.ZEC] },
    })
  })

  it('keeps the integrator lists and never allows ZEC as a source', () => {
    expect(
      withDestinationOnlyChains({
        types: { deny: [ChainType.MVM] },
        deny: [ChainId.BSC],
        from: { allow: [ChainId.ETH, ChainId.ZEC], deny: [ChainId.ARB] },
        to: { deny: [ChainId.OPT] },
      })
    ).toEqual({
      types: { deny: [ChainType.MVM] },
      deny: [ChainId.BSC],
      from: { allow: [ChainId.ETH], deny: [ChainId.ARB, ChainId.ZEC] },
      to: { deny: [ChainId.OPT] },
    })
  })
})

describe('isDestinationAllowedAsSource', () => {
  const chains = withDestinationOnlyChains(undefined)

  it('is false for a destination the config denies as a source', () => {
    expect(isDestinationAllowedAsSource(ChainId.ZEC, chains)).toBe(false)
  })

  it('is true for an allowed destination or none', () => {
    expect(isDestinationAllowedAsSource(ChainId.BTC, chains)).toBe(true)
    expect(isDestinationAllowedAsSource(undefined, chains)).toBe(true)
  })
})

describe('withServedDestinationChains', () => {
  const bitcoinProvider = {}
  const zcashProvider = { chainIds: [ChainId.ZEC] }

  it('keeps the config when a provider serves every destination-only chain', () => {
    const chains = { deny: [ChainId.ETH] }

    expect(
      withServedDestinationChains(chains, [bitcoinProvider, zcashProvider])
    ).toBe(chains)
  })

  it('denies a destination-only chain that no provider serves', () => {
    expect(
      withServedDestinationChains({ deny: [ChainId.ETH] }, [bitcoinProvider])
    ).toEqual({ deny: [ChainId.ETH, ChainId.ZEC] })
    expect(withServedDestinationChains(undefined, [])).toEqual({
      deny: [ChainId.ZEC],
    })
  })

  it('removes it from an allow list, which would override the deny list', () => {
    expect(
      withServedDestinationChains({ allow: [ChainId.BTC, ChainId.ZEC] }, [
        bitcoinProvider,
      ])
    ).toEqual({ allow: [ChainId.BTC], deny: [ChainId.ZEC] })
  })
})

describe('isUnservedDestinationChain', () => {
  it('is true for ZEC when the chains config denies it', () => {
    expect(
      isUnservedDestinationChain(ChainId.ZEC, { deny: [ChainId.ZEC] })
    ).toBe(true)
  })

  it('is false for ZEC that a provider serves', () => {
    expect(isUnservedDestinationChain(ChainId.ZEC, undefined)).toBe(false)
  })

  it('is false for any other chain, even a denied one', () => {
    expect(
      isUnservedDestinationChain(ChainId.ETH, { deny: [ChainId.ETH] })
    ).toBe(false)
    expect(isUnservedDestinationChain(undefined, undefined)).toBe(false)
  })
})
