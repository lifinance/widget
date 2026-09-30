import { ChainId, ChainType } from '@lifi/sdk'
import { describe, expect, it } from 'vitest'
import {
  isDestinationAllowedAsSource,
  isDestinationOnlyChain,
  isUnservedDestinationChain,
  withDestinationOnlyChains,
  withoutUnservedToChain,
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

describe('withoutUnservedToChain', () => {
  it('omits a destination-only toChain and its token that no provider serves', () => {
    const config = {
      chains: { deny: [ChainId.ZEC] },
      toChain: ChainId.ZEC,
      toToken: 'ZEC',
    }
    const result = withoutUnservedToChain(config)
    expect(result).toEqual({ chains: { deny: [ChainId.ZEC] } })
    expect(Object.hasOwn(result, 'toChain')).toBe(false)
    expect(Object.hasOwn(result, 'toToken')).toBe(false)
  })

  it('keeps the config when the destination is served', () => {
    const config = { toChain: ChainId.ZEC, toToken: 'ZEC' }
    expect(withoutUnservedToChain(config)).toBe(config)
  })

  it('keeps any other denied destination', () => {
    const config = {
      chains: { deny: [ChainId.ETH] },
      toChain: ChainId.ETH,
      toToken: '0x0000000000000000000000000000000000000000',
    }
    expect(withoutUnservedToChain(config)).toBe(config)
  })
})
