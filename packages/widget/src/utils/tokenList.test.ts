import { describe, expect, it } from 'vitest'
import type { TokenAmount } from '../types/token.js'
import { createSearchMatcher, hoistNativeToken } from './tokenList.js'

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

describe('createSearchMatcher', () => {
  const laptopAddress = '0xB095274743941e953c746F9C228DA9c18Bb6ec29'
  const laptop = makeToken(laptopAddress, {
    chainId: 8453,
    symbol: 'LAPTOP',
    name: 'LAPTOP',
  })
  // Impersonators seen in the search index: the real address embedded in the
  // name or used as the symbol.
  const nameImpersonator = makeToken(
    '0x7DAAad2659eb9Cd4e78985117F218a58992a2eEa',
    {
      chainId: 8453,
      symbol: 'LAPTOP',
      name: `Hunter Biden's Laptop ${laptopAddress}`,
    }
  )
  const symbolImpersonator = makeToken(
    '5doEMYL3x1USgYeU54JVGyw7Ue8LSRmtj2bXVQAec29',
    {
      chainId: 1151111081099710,
      symbol: laptopAddress,
      name: 'LAPTOP',
    }
  )

  it('matches every token without a search', () => {
    expect(createSearchMatcher(undefined, false)(nameImpersonator)).toBe(true)
    expect(createSearchMatcher('', false)(nameImpersonator)).toBe(true)
  })

  describe('text search', () => {
    it('matches a name, symbol, or address fragment in any letter case', () => {
      expect(createSearchMatcher('hunter', false)(nameImpersonator)).toBe(true)
      expect(createSearchMatcher('laptop', false)(laptop)).toBe(true)
      expect(createSearchMatcher('0xb095', false)(laptop)).toBe(true)
    })

    it('rejects a token that matches nothing', () => {
      expect(createSearchMatcher('usdc', false)(laptop)).toBe(false)
    })

    it('ignores surrounding whitespace, as the address search does', () => {
      // `useTokens` trims before it asks the API, so an untrimmed filter
      // discards the results the trimmed request just returned.
      expect(createSearchMatcher('  laptop  ', false)(laptop)).toBe(true)
      expect(createSearchMatcher('laptop\n', false)(laptop)).toBe(true)
    })

    it('matches every token when the query is only whitespace', () => {
      expect(createSearchMatcher('   ', false)(laptop)).toBe(true)
    })
  })

  describe('address search', () => {
    it('matches only the token at that address', () => {
      expect(createSearchMatcher(laptopAddress, true)(laptop)).toBe(true)
      expect(createSearchMatcher(laptopAddress, true)(nameImpersonator)).toBe(
        false
      )
      expect(createSearchMatcher(laptopAddress, true)(symbolImpersonator)).toBe(
        false
      )
    })

    it('ignores the letter case of the address', () => {
      expect(
        createSearchMatcher(laptopAddress.toLowerCase(), true)(laptop)
      ).toBe(true)
      expect(
        createSearchMatcher(
          laptopAddress,
          true
        )(makeToken(laptopAddress.toLowerCase(), { chainId: 8453 }))
      ).toBe(true)
    })

    it('ignores surrounding whitespace', () => {
      expect(createSearchMatcher(`  ${laptopAddress}\n`, true)(laptop)).toBe(
        true
      )
    })

    it('does not match an address prefix', () => {
      expect(
        createSearchMatcher(laptopAddress.slice(0, -1), true)(laptop)
      ).toBe(false)
    })
  })
})
