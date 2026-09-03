import { describe, expect, it } from 'vitest'
import type { TokenAmount } from '../types/token.js'
import { hoistNativeToken } from './tokenList.js'

const makeToken = (
  address: string,
  flags: Partial<TokenAmount> = {}
): TokenAmount =>
  ({
    chainId: 1,
    address,
    symbol: 'TKN',
    decimals: 18,
    name: 'Token',
    priceUSD: '1',
    ...flags,
  }) as TokenAmount

describe('hoistNativeToken', () => {
  it('should move the native token to the front', () => {
    const tokens = [
      makeToken('0xAAA'),
      makeToken('0xBBB', { native: true }),
      makeToken('0xCCC'),
    ]
    const result = hoistNativeToken(tokens, 1)
    expect(result.map((t) => t.address)).toEqual(['0xBBB', '0xAAA', '0xCCC'])
  })

  it('should keep the list unchanged when the native token is already first', () => {
    const tokens = [makeToken('0xBBB', { native: true }), makeToken('0xAAA')]
    expect(hoistNativeToken(tokens, 1)).toBe(tokens)
  })

  it('should keep the list unchanged without a selected chain', () => {
    const tokens = [makeToken('0xAAA'), makeToken('0xBBB', { native: true })]
    expect(hoistNativeToken(tokens, undefined)).toBe(tokens)
  })

  it('should keep the list unchanged without a native token', () => {
    const tokens = [makeToken('0xAAA'), makeToken('0xBBB')]
    expect(hoistNativeToken(tokens, 1)).toBe(tokens)
  })

  it('should ignore a native token of another chain', () => {
    const tokens = [
      makeToken('0xAAA'),
      makeToken('0xBBB', { native: true, chainId: 137 }),
    ]
    expect(hoistNativeToken(tokens, 1)).toBe(tokens)
  })

  it.each(['featured', 'popular', 'pinned', 'verified'] as const)(
    'should leave a native token that an external list already places (%s)',
    (flag) => {
      const tokens = [
        makeToken('0xAAA'),
        makeToken('0xBBB', { native: true, [flag]: true }),
      ]
      expect(hoistNativeToken(tokens, 1)).toBe(tokens)
    }
  )

  it('should not duplicate the native token', () => {
    const tokens = [makeToken('0xAAA'), makeToken('0xBBB', { native: true })]
    const result = hoistNativeToken(tokens, 1)
    expect(result).toHaveLength(2)
    expect(result.filter((t) => t.address === '0xBBB')).toHaveLength(1)
  })
})
