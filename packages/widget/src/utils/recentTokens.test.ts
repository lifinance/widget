import { describe, expect, it } from 'vitest'
import type { RecentToken } from '../stores/recentTokens/types.js'
import type { TokenAmount } from '../types/token.js'
import type { WidgetTokens } from '../types/widget.js'
import type { ResolveRecentTokensParams } from './recentTokens.js'
import { collapsedRecentCount, resolveRecentTokens } from './recentTokens.js'

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

const makeRecent = (
  address: string,
  chainId = 1,
  overrides: Partial<RecentToken> = {}
): RecentToken => ({
  chainId,
  address: address.toLowerCase(),
  symbol: 'TKN',
  name: 'Token',
  decimals: 18,
  ...overrides,
})

const resolve = (
  tokens: TokenAmount[],
  params: Partial<ResolveRecentTokensParams> = {}
) =>
  resolveRecentTokens(tokens, {
    recentTokens: [makeRecent('0xr1')],
    availableChainIds: new Set([1, 8453]),
    configTokens: undefined,
    formType: 'from',
    selectedChainId: 1,
    isAllNetworks: false,
    search: '',
    expanded: false,
    disabled: false,
    ...params,
  })

describe('resolveRecentTokens inactive paths', () => {
  it('should return the same array reference when disabled', () => {
    const tokens = [makeToken('0xA')]
    expect(resolve(tokens, { disabled: true }).tokens).toBe(tokens)
  })

  it('should return the same array reference when the store is empty', () => {
    const tokens = [makeToken('0xA')]
    expect(resolve(tokens, { recentTokens: [] }).tokens).toBe(tokens)
  })

  it('should return the same array reference when the chain filter empties the band', () => {
    const tokens = [makeToken('0xA')]
    expect(
      resolve(tokens, { recentTokens: [makeRecent('0xr1', 8453)] }).tokens
    ).toBe(tokens)
  })

  it('should return the same array reference when the chain is unavailable', () => {
    const tokens = [makeToken('0xA')]
    expect(
      resolve(tokens, {
        recentTokens: [makeRecent('0xr1', 999)],
        isAllNetworks: true,
      }).tokens
    ).toBe(tokens)
  })

  it('should return the same array reference when every entry is filtered out', () => {
    const tokens = [makeToken('0xn', { native: true })]
    expect(resolve(tokens, { recentTokens: [makeRecent('0xn')] }).tokens).toBe(
      tokens
    )
  })
})

describe('resolveRecentTokens active band', () => {
  it('should splice the band after the hoisted native and the pinned run', () => {
    const tokens = [
      makeToken('0xN', { native: true }),
      makeToken('0xP', { pinned: true }),
      makeToken('0xr1'),
    ]
    const result = resolve(tokens)

    expect(result.nativeHoisted).toBe(true)
    expect(result.recentStartIndex).toBe(2)
    expect(result.recentCount).toBe(1)
    expect(result.tokens.map((t) => t.address)).toEqual([
      '0xN',
      '0xP',
      '0xr1',
      '0xr1',
    ])
    expect(result.tokens[2].recent).toBe(true)
    expect(result.tokens[3].recent).toBeUndefined()
  })

  it('should not treat tokens[0] as hoisted in all-networks mode', () => {
    const tokens = [makeToken('0xN', { native: true }), makeToken('0xr1')]
    const result = resolve(tokens, { isAllNetworks: true })

    expect(result.nativeHoisted).toBe(false)
    expect(result.recentStartIndex).toBe(0)
  })

  it('should not treat tokens[0] as hoisted during a search', () => {
    const tokens = [makeToken('0xN', { native: true }), makeToken('0xr1')]
    expect(resolve(tokens, { search: 'tkn' }).nativeHoisted).toBe(false)
  })

  it('should drop a recent token that is pinned', () => {
    const tokens = [makeToken('0xp', { pinned: true })]
    expect(
      resolve(tokens, { recentTokens: [makeRecent('0xp')] }).totalRecentCount
    ).toBe(0)
  })

  it('should prefer the live token over the stored snapshot', () => {
    const tokens = [makeToken('0xr1', { name: 'Fresh Name', amount: 9n })]
    const result = resolve(tokens, {
      recentTokens: [makeRecent('0xr1', 1, { name: 'Stale Name' })],
    })

    expect(result.tokens[0].name).toBe('Fresh Name')
    expect(result.tokens[0].amount).toBe(9n)
  })

  it('should fall back to the snapshot with no price and no amount', () => {
    const tokens = [makeToken('0xA')]
    const result = resolve(tokens, {
      recentTokens: [makeRecent('0xr1', 1, { name: 'Only Snapshot' })],
    })

    expect(result.tokens[0].name).toBe('Only Snapshot')
    expect(result.tokens[0].amount).toBeUndefined()
    expect(result.tokens[0].priceUSD).toBe('')
  })

  it('should keep the native flag on a snapshot row so it earns the native badge', () => {
    const tokens = [makeToken('0xA')]
    const result = resolve(tokens, {
      recentTokens: [makeRecent('0xr1', 1, { native: true })],
    })

    // Without this the badge chain falls through to the amber "unverified"
    // warning, on a native token.
    expect(result.tokens[0].native).toBe(true)
  })

  it('should honour an integrator deny list per form type', () => {
    const tokens = [makeToken('0xr1')]
    const configTokens: WidgetTokens = {
      deny: [{ chainId: 1, address: '0xr1' }],
    }
    expect(resolve(tokens, { configTokens }).totalRecentCount).toBe(0)
  })

  it('should keep a token denied only on the opposite form type', () => {
    const tokens = [makeToken('0xr1')]
    const configTokens: WidgetTokens = {
      to: { deny: [{ chainId: 1, address: '0xr1' }] },
    }
    expect(resolve(tokens, { configTokens }).totalRecentCount).toBe(1)
  })

  it('should show 4 collapsed and 10 expanded, reporting the true total', () => {
    const tokens = [makeToken('0xA')]
    const recentTokens = Array.from({ length: 10 }, (_, i) =>
      makeRecent(`0xr${i}`)
    )

    expect(resolve(tokens, { recentTokens }).recentCount).toBe(
      collapsedRecentCount
    )
    expect(resolve(tokens, { recentTokens }).totalRecentCount).toBe(10)
    expect(resolve(tokens, { recentTokens, expanded: true }).recentCount).toBe(
      10
    )
  })
})
