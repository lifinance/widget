import type { ExtendedChain, Token } from '@lifi/sdk'
import { describe, expect, it } from 'vitest'
import type { TokensByChain, TokenWithFlags } from '../types/token.js'
import {
  filterAllowedTokens,
  getTokenVerificationProvider,
  getVerifiedTokensSets,
  isNativeToken,
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

describe('isNativeToken', () => {
  const chain = {
    nativeToken: { address: '0x0000000000000000000000000000000000000000' },
  } as ExtendedChain

  it('should return true for the native token address of the chain', () => {
    expect(
      isNativeToken('0x0000000000000000000000000000000000000000', chain)
    ).toBe(true)
  })

  it('should return false for another token address', () => {
    expect(isNativeToken('0xAAA', chain)).toBe(false)
  })

  it('should return false without a chain', () => {
    expect(
      isNativeToken('0x0000000000000000000000000000000000000000', undefined)
    ).toBe(false)
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
