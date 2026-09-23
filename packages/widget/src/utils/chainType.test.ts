import { ChainId, ChainType } from '@lifi/sdk'
import type { IsAddressForChain } from '@lifi/widget-provider'
import { describe, expect, it } from 'vitest'
import {
  bookmarkChainId,
  isDestinationOnlyChain,
  withDestinationOnlyChains,
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
