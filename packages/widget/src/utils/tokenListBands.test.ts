import { describe, expect, it } from 'vitest'
import type { TokenAmount } from '../types/token.js'
import { createBandResolver } from './tokenListBands.js'

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

const noRecents = {
  nativeHoisted: false,
  recentStartIndex: 0,
  recentCount: 0,
  showRecentToggle: false,
}

describe('createBandResolver without recents (golden: current behaviour)', () => {
  it('should band pinned, featured, my tokens, popular and all tokens', () => {
    const tokens = [
      makeToken('0xA', { pinned: true }),
      makeToken('0xB', { pinned: true }),
      makeToken('0xC', { featured: true }),
      makeToken('0xD', { amount: 5n }),
      makeToken('0xE', { popular: true }),
      makeToken('0xF'),
    ]
    const { getRowExtraHeight, getRowBandLabel } = createBandResolver(tokens, {
      ...noRecents,
      showCategories: true,
      showPinnedTokens: true,
    })

    expect([0, 1, 2, 3, 4, 5].map(getRowExtraHeight)).toEqual([
      24, 0, 32, 32, 32, 32,
    ])
    expect([0, 1, 2, 3, 4, 5].map(getRowBandLabel)).toEqual([
      { kind: 'text', key: 'main.pinnedTokens', atListStart: true },
      undefined,
      { kind: 'text', key: 'main.featuredTokens', atListStart: false },
      { kind: 'text', key: 'main.myTokens', atListStart: false },
      { kind: 'text', key: 'main.popularTokens', atListStart: false },
      { kind: 'text', key: 'main.allTokens', atListStart: false },
    ])
  })

  it('should start the pinned band below a hoisted native token', () => {
    const tokens = [
      makeToken('0xN', { native: true }),
      makeToken('0xA', { pinned: true }),
      makeToken('0xB'),
    ]
    const { getRowExtraHeight, getRowBandLabel } = createBandResolver(tokens, {
      ...noRecents,
      nativeHoisted: true,
      showCategories: false,
      showPinnedTokens: true,
    })

    expect([0, 1, 2].map(getRowExtraHeight)).toEqual([0, 24, 32])
    expect(getRowBandLabel(0)).toBeUndefined()
    expect(getRowBandLabel(1)).toEqual({
      kind: 'text',
      key: 'main.pinnedTokens',
      atListStart: true,
    })
    expect(getRowBandLabel(2)).toEqual({
      kind: 'text',
      key: 'main.allTokens',
      atListStart: false,
    })
  })

  it('should open the featured band at the list start', () => {
    const tokens = [
      makeToken('0xC', { featured: true }),
      makeToken('0xD', { amount: 5n }),
    ]
    const { getRowExtraHeight, getRowBandLabel } = createBandResolver(tokens, {
      ...noRecents,
      showCategories: true,
      showPinnedTokens: false,
    })

    expect([0, 1].map(getRowExtraHeight)).toEqual([24, 32])
    expect(getRowBandLabel(0)).toEqual({
      kind: 'text',
      key: 'main.featuredTokens',
      atListStart: true,
    })
    expect(getRowBandLabel(1)).toEqual({
      kind: 'text',
      key: 'main.myTokens',
      atListStart: false,
    })
  })

  it('should emit no labels without categories or pinned tokens', () => {
    const tokens = [makeToken('0xA'), makeToken('0xB')]
    const { getRowExtraHeight, getRowBandLabel } = createBandResolver(tokens, {
      ...noRecents,
      showCategories: false,
      showPinnedTokens: false,
    })

    expect([0, 1].map(getRowExtraHeight)).toEqual([0, 0])
    expect([0, 1].map(getRowBandLabel)).toEqual([undefined, undefined])
  })
})

describe('createBandResolver with a recent band', () => {
  const tokens = [
    makeToken('0xN', { native: true }),
    makeToken('0xA', { pinned: true }),
    makeToken('0xR1', { recent: true }),
    makeToken('0xR2', { recent: true, amount: 7n }),
    makeToken('0xB'),
  ]

  it('should open the band below the pinned run and close it above the next band', () => {
    const { getRowExtraHeight, getRowBandLabel } = createBandResolver(tokens, {
      showCategories: false,
      showPinnedTokens: true,
      nativeHoisted: true,
      recentStartIndex: 2,
      recentCount: 2,
      showRecentToggle: false,
    })

    expect([0, 1, 2, 3, 4].map(getRowExtraHeight)).toEqual([0, 24, 32, 0, 32])
    expect(getRowBandLabel(2)).toEqual({ kind: 'recent', atListStart: false })
    expect(getRowBandLabel(3)).toBeUndefined()
    expect(getRowBandLabel(4)).toEqual({
      kind: 'text',
      key: 'main.allTokens',
      atListStart: false,
    })
  })

  it('should add the toggle row height to the last visible recent row', () => {
    const { getRowExtraHeight, isToggleRow } = createBandResolver(tokens, {
      showCategories: false,
      showPinnedTokens: true,
      nativeHoisted: true,
      recentStartIndex: 2,
      recentCount: 2,
      showRecentToggle: true,
    })

    expect(getRowExtraHeight(3)).toBe(32)
    // The reserved height and the rendered toggle must agree on the row.
    expect([0, 1, 2, 3, 4].map(isToggleRow)).toEqual([
      false,
      false,
      false,
      true,
      false,
    ])
  })

  it('should report no toggle row when the toggle is off', () => {
    const { isToggleRow } = createBandResolver(tokens, {
      showCategories: false,
      showPinnedTokens: true,
      nativeHoisted: true,
      recentStartIndex: 2,
      recentCount: 2,
      showRecentToggle: false,
    })

    expect([0, 1, 2, 3, 4].some(isToggleRow)).toBe(false)
  })

  it('should use the list-start padding when nothing precedes the band', () => {
    const bandOnly = [makeToken('0xR1', { recent: true }), makeToken('0xB')]
    const { getRowExtraHeight, getRowBandLabel } = createBandResolver(
      bandOnly,
      {
        showCategories: false,
        showPinnedTokens: false,
        nativeHoisted: false,
        recentStartIndex: 0,
        recentCount: 1,
        showRecentToggle: false,
      }
    )

    expect(getRowExtraHeight(0)).toBe(24)
    expect(getRowBandLabel(0)).toEqual({ kind: 'recent', atListStart: true })
    // The band must still be closed off from the list below, even with no
    // pinned tokens and no categories (which is every all-networks view).
    expect(getRowBandLabel(1)).toEqual({
      kind: 'text',
      key: 'main.allTokens',
      atListStart: false,
    })
    expect(getRowExtraHeight(1)).toBe(32)
  })

  it('should leave the list untouched when no recent band is present', () => {
    const plain = [makeToken('0xA'), makeToken('0xB')]
    const { getRowExtraHeight, getRowBandLabel } = createBandResolver(plain, {
      showCategories: false,
      showPinnedTokens: false,
      nativeHoisted: false,
      recentStartIndex: 0,
      recentCount: 0,
      showRecentToggle: false,
    })

    expect([0, 1].map(getRowExtraHeight)).toEqual([0, 0])
    expect([0, 1].map(getRowBandLabel)).toEqual([undefined, undefined])
  })

  it('should not let a recent row open a category band below it', () => {
    const withCategories = [
      makeToken('0xR1', { recent: true, amount: 7n }),
      makeToken('0xD', { amount: 5n }),
      makeToken('0xF'),
    ]
    const { getRowBandLabel } = createBandResolver(withCategories, {
      showCategories: true,
      showPinnedTokens: false,
      nativeHoisted: false,
      recentStartIndex: 0,
      recentCount: 1,
      showRecentToggle: false,
    })

    expect(getRowBandLabel(0)).toEqual({ kind: 'recent', atListStart: true })
    expect(getRowBandLabel(1)).toEqual({
      kind: 'text',
      key: 'main.myTokens',
      atListStart: false,
    })
  })
})
