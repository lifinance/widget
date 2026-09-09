import type {
  ExtendedChain,
  Token,
  TokenAmount,
  TokenExtended,
} from '@lifi/sdk'
import { describe, expect, it } from 'vitest'
import type { TokensByChain, TokenWithFlags } from '../types/token.js'
import {
  filterAllowedTokens,
  getNativeTokenAddresses,
  getTokenVerificationProvider,
  getVerifiedTokensSets,
  mergeFallbackToken,
  updateTokenInCache,
} from './token.js'

const makeToken = (
  chainId: number,
  address: string,
  verified?: boolean
): TokenWithFlags => ({
  chainId,
  address,
  symbol: 'TKN',
  decimals: 18,
  name: 'Token',
  priceUSD: '1',
  verified,
})

describe('getVerifiedTokensSets', () => {
  it('should return undefined without a verified allowlist', () => {
    expect(getVerifiedTokensSets(undefined)).toBeUndefined()
    expect(getVerifiedTokensSets({})).toBeUndefined()
    expect(getVerifiedTokensSets({ verified: [] })).toBeUndefined()
  })

  it('should group lowercase addresses by chain', () => {
    const sets = getVerifiedTokensSets({
      verified: [
        { chainId: 1, address: '0xAbC1' },
        { chainId: 1, address: '0xDeF2' },
        { chainId: 137, address: '0xAbC1' },
      ],
    })
    expect(sets?.get(1)).toEqual(new Set(['0xabc1', '0xdef2']))
    expect(sets?.get(137)).toEqual(new Set(['0xabc1']))
    expect(sets?.get(10)).toBeUndefined()
  })
})

describe('filterAllowedTokens', () => {
  it('should mark allowlisted tokens as verified', () => {
    const dataTokens: TokensByChain = {
      1: [makeToken(1, '0xAAA', false), makeToken(1, '0xBBB', false)],
    }
    const result = filterAllowedTokens(dataTokens, {
      verified: [{ chainId: 1, address: '0xaaa' }],
    })
    expect(result?.[1].find((t) => t.address === '0xAAA')?.verified).toBe(true)
    expect(result?.[1].find((t) => t.address === '0xBBB')?.verified).toBe(false)
  })

  it('should match allowlisted addresses case-insensitively', () => {
    const dataTokens: TokensByChain = {
      1: [makeToken(1, '0xAbCd', false)],
    }
    const result = filterAllowedTokens(dataTokens, {
      verified: [{ chainId: 1, address: '0xABCD' }],
    })
    expect(result?.[1][0].verified).toBe(true)
  })

  it('should not mark tokens verified on a different chain', () => {
    const dataTokens: TokensByChain = {
      1: [makeToken(1, '0xAAA', false)],
    }
    const result = filterAllowedTokens(dataTokens, {
      verified: [{ chainId: 137, address: '0xAAA' }],
    })
    expect(result?.[1][0].verified).toBe(false)
  })

  it('should keep verified tokens verified', () => {
    const dataTokens: TokensByChain = {
      1: [makeToken(1, '0xAAA', true)],
    }
    const result = filterAllowedTokens(dataTokens, {
      verified: [{ chainId: 1, address: '0xaaa' }],
    })
    expect(result?.[1][0].verified).toBe(true)
  })

  it('should mark include tokens as verified', () => {
    const includedToken: Token = {
      chainId: 1,
      address: '0xCCC',
      symbol: 'INC',
      decimals: 18,
      name: 'Included',
      priceUSD: '1',
    }
    const dataTokens: TokensByChain = {
      1: [makeToken(1, '0xAAA', false)],
    }
    const result = filterAllowedTokens(dataTokens, {
      include: [includedToken],
    })
    expect(result?.[1].find((t) => t.address === '0xCCC')?.verified).toBe(true)
    expect(result?.[1].find((t) => t.address === '0xAAA')?.verified).toBe(false)
  })

  it('should not duplicate include tokens that exist in the data and mark the data token as verified', () => {
    const includedToken: Token = {
      chainId: 1,
      address: '0xaaa',
      symbol: 'INC',
      decimals: 18,
      name: 'Included',
      priceUSD: '1',
    }
    const dataTokens: TokensByChain = {
      1: [makeToken(1, '0xAAA', false)],
    }
    const result = filterAllowedTokens(dataTokens, {
      include: [includedToken],
    })
    expect(result?.[1]).toHaveLength(1)
    // The data token wins to keep its extended data
    expect(result?.[1][0].address).toBe('0xAAA')
    expect(result?.[1][0].verified).toBe(true)
  })

  it('should handle include tokens on chains without data tokens', () => {
    const includedToken: Token = {
      chainId: 137,
      address: '0xCCC',
      symbol: 'INC',
      decimals: 18,
      name: 'Included',
      priceUSD: '1',
    }
    const result = filterAllowedTokens(
      { 1: [makeToken(1, '0xAAA', true)] },
      { include: [includedToken] }
    )
    expect(result?.[137]).toHaveLength(1)
    expect(result?.[137][0].verified).toBe(true)
  })

  it('should return undefined without data tokens', () => {
    expect(filterAllowedTokens(undefined, {})).toBeUndefined()
  })
})

describe('getTokenVerificationProvider', () => {
  it('should return the capitalized provider that verified the token', () => {
    expect(
      getTokenVerificationProvider({
        verificationStatusBreakdown: [
          { provider: 'hypernative', result: 'verified' },
        ],
      })
    ).toBe('Hypernative')
  })

  it('should return the first provider that verified the token', () => {
    expect(
      getTokenVerificationProvider({
        verificationStatusBreakdown: [
          { provider: 'other', result: 'unverified' },
          { provider: 'hypernative', result: 'verified' },
        ],
      })
    ).toBe('Hypernative')
  })

  it('should return undefined when no provider verified the token', () => {
    expect(
      getTokenVerificationProvider({
        verificationStatusBreakdown: [
          { provider: 'hypernative', result: 'flagged' },
        ],
      })
    ).toBeUndefined()
  })

  it('should return undefined without a breakdown', () => {
    expect(getTokenVerificationProvider({})).toBeUndefined()
    expect(
      getTokenVerificationProvider({ verificationStatusBreakdown: [] })
    ).toBeUndefined()
  })
})

describe('filterAllowedTokens native flag', () => {
  const nativeAddress = '0x0000000000000000000000000000000000000000'
  const nativeTokenAddresses = new Map([[1, nativeAddress]])

  it('should mark the native token of the chain', () => {
    const result = filterAllowedTokens(
      { 1: [makeToken(1, nativeAddress), makeToken(1, '0xAAA')] },
      undefined,
      undefined,
      undefined,
      nativeTokenAddresses
    )
    expect(result?.[1][0].native).toBe(true)
  })

  it('should not add the flag to other tokens', () => {
    const result = filterAllowedTokens(
      { 1: [makeToken(1, '0xAAA')] },
      undefined,
      undefined,
      undefined,
      nativeTokenAddresses
    )
    expect('native' in result![1][0]).toBe(false)
  })

  it('should match the native address regardless of case', () => {
    const result = filterAllowedTokens(
      { 1: [makeToken(1, '0xABCDEF')] },
      undefined,
      undefined,
      undefined,
      new Map([[1, '0xabcdef']])
    )
    expect(result?.[1][0].native).toBe(true)
  })

  it('should not mark the native token of another chain', () => {
    const result = filterAllowedTokens(
      { 137: [makeToken(137, nativeAddress)] },
      undefined,
      undefined,
      undefined,
      nativeTokenAddresses
    )
    expect(result?.[137][0].native).toBeUndefined()
  })

  it('should not mark anything without native addresses', () => {
    const result = filterAllowedTokens({ 1: [makeToken(1, nativeAddress)] })
    expect(result?.[1][0].native).toBeUndefined()
  })
})

describe('getNativeTokenAddresses', () => {
  const makeChain = (id: number, address: string) =>
    ({ id, nativeToken: { address } }) as ExtendedChain

  it('should map each chain to its native token address', () => {
    const result = getNativeTokenAddresses([
      makeChain(1, '0x0000000000000000000000000000000000000000'),
      makeChain(42220, '0x471EcE3750Da237f93B8E339c536989b8978a438'),
    ])
    expect(result.get(1)).toBe('0x0000000000000000000000000000000000000000')
    expect(result.get(42220)).toBe('0x471EcE3750Da237f93B8E339c536989b8978a438')
  })

  it('should omit venues that declare a bridged stablecoin as native', () => {
    const result = getNativeTokenAddresses([
      makeChain(1337, '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'),
      makeChain(3586256, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'),
      makeChain(1, '0x0000000000000000000000000000000000000000'),
    ])
    expect(result.has(1337)).toBe(false)
    expect(result.has(3586256)).toBe(false)
    expect(result.has(1)).toBe(true)
  })

  it('should return an empty map without chains', () => {
    expect(getNativeTokenAddresses(undefined).size).toBe(0)
  })
})

describe('mergeFallbackToken', () => {
  const routeToken: TokenAmount = {
    chainId: 4663,
    address: '0xe8ffd7e24187f72afb08d75b1bb13088a989a791',
    symbol: 'DELTA',
    decimals: 18,
    name: 'Delta',
    priceUSD: '0.01308276789',
    amount: 759159353996000000000000n,
  }

  const cachedToken: TokenExtended = {
    chainId: 4663,
    address: '0xe8ffd7e24187f72afb08d75b1bb13088a989a791',
    symbol: 'DELTA',
    decimals: 18,
    name: 'Delta',
    priceUSD: '0.01298884081',
    logoURI: 'https://example.test/delta.png',
  }

  it('should keep the route price when the cache holds a different one', () => {
    expect(mergeFallbackToken(routeToken, cachedToken).priceUSD).toBe(
      '0.01308276789'
    )
  })

  it('should take the logo from the cache when the route has none', () => {
    expect(mergeFallbackToken(routeToken, cachedToken).logoURI).toBe(
      'https://example.test/delta.png'
    )
  })

  it('should keep the route logo when the route has one', () => {
    const withLogo = {
      ...routeToken,
      logoURI: 'https://example.test/route.png',
    }
    expect(mergeFallbackToken(withLogo, cachedToken).logoURI).toBe(
      'https://example.test/route.png'
    )
  })

  it('should take the cache price when the route price is empty', () => {
    expect(
      mergeFallbackToken({ ...routeToken, priceUSD: '' }, cachedToken).priceUSD
    ).toBe('0.01298884081')
  })

  it('should take the cache price when the route price is zero', () => {
    expect(
      mergeFallbackToken({ ...routeToken, priceUSD: '0' }, cachedToken).priceUSD
    ).toBe('0.01298884081')
  })

  it('should take the cache logo when the route logo is empty', () => {
    expect(
      mergeFallbackToken({ ...routeToken, logoURI: '' }, cachedToken).logoURI
    ).toBe('https://example.test/delta.png')
  })

  it('should keep the route amount when the cache holds a balance', () => {
    const withBalance = { ...cachedToken, amount: 42n } as TokenExtended
    expect(mergeFallbackToken(routeToken, withBalance).amount).toBe(
      759159353996000000000000n
    )
  })

  it('should keep the route decimals when the cache disagrees', () => {
    expect(
      mergeFallbackToken(routeToken, { ...cachedToken, decimals: 6 }).decimals
    ).toBe(18)
  })

  it('should return the route token without a cached token', () => {
    expect(mergeFallbackToken(routeToken, undefined)).toEqual(routeToken)
  })
})

describe('updateTokenInCache', () => {
  const cache: TokensByChain = {
    4663: [makeToken(4663, '0xE8FFd7E24187F72AFB08D75B1bb13088A989A791')],
  }

  it('should update a token whose cached address differs only in case', () => {
    const updated = updateTokenInCache(cache, {
      ...makeToken(4663, '0xe8ffd7e24187f72afb08d75b1bb13088a989a791'),
      priceUSD: '0.01308276789',
    })
    expect(updated?.[4663][0].priceUSD).toBe('0.01308276789')
  })

  it('should keep the cached address casing while updating the price', () => {
    const updated = updateTokenInCache(cache, {
      ...makeToken(4663, '0xe8ffd7e24187f72afb08d75b1bb13088a989a791'),
      priceUSD: '0.01308276789',
    })
    expect(updated?.[4663][0]).toEqual({
      ...makeToken(4663, '0xE8FFd7E24187F72AFB08D75B1bb13088A989A791'),
      priceUSD: '0.01308276789',
    })
  })

  it('should return the cache unchanged for a token that is not in it', () => {
    expect(updateTokenInCache(cache, makeToken(4663, '0xabc'))).toBe(cache)
  })

  it('should return the cache unchanged for a chain that is not in it', () => {
    expect(updateTokenInCache(cache, makeToken(1, '0xe8ffd7e2'))).toBe(cache)
  })

  it('should return undefined without a cache', () => {
    expect(
      updateTokenInCache(undefined, makeToken(4663, '0xabc'))
    ).toBeUndefined()
  })
})
