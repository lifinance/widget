import { describe, expect, it } from 'vitest'
import type { RecentToken } from '../stores/recentTokens/types.js'
import type { TokenAmount } from '../types/token.js'
import type { WidgetTokens } from '../types/widget.js'
import type { ResolveRecentRowsParams } from './recentTokens.js'
import {
  collapsedRecentCount,
  resolveRecentRows,
  spliceRecentRows,
} from './recentTokens.js'

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

const baseParams: ResolveRecentRowsParams = {
  recentTokens: [makeRecent('0xr1')],
  availableChainIds: new Set([1, 8453]),
  configTokens: undefined,
  formType: 'from',
  selectedChainId: 1,
  isAllNetworks: false,
  nativeHoisted: false,
  disabled: false,
}

const resolve = (
  tokens: TokenAmount[],
  {
    expanded = false,
    ...params
  }: Partial<ResolveRecentRowsParams> & { expanded?: boolean } = {}
) => {
  const resolved = resolveRecentRows(tokens, { ...baseParams, ...params })
  return { ...resolved, ...spliceRecentRows(tokens, resolved, expanded) }
}

describe('recent band inactive paths', () => {
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

  it('should return the same array reference when the live list is empty', () => {
    const tokens: TokenAmount[] = []
    expect(resolve(tokens).tokens).toBe(tokens)
  })

  it('should drop a recent whose chain is not in the resolved chain list', () => {
    // An empty set means no chain is available, never "allow everything".
    const tokens = [makeToken('0xr1')]
    expect(
      resolve(tokens, { availableChainIds: new Set<number>() }).totalRecentCount
    ).toBe(0)
  })

  it('should return the same array reference when every entry is filtered out', () => {
    const tokens = [makeToken('0xn', { native: true })]
    expect(
      resolve(tokens, {
        recentTokens: [makeRecent('0xn')],
        nativeHoisted: true,
      }).tokens
    ).toBe(tokens)
  })
})

describe('recent band active', () => {
  it('should splice the band after the hoisted native and the pinned run', () => {
    const tokens = [
      makeToken('0xN', { native: true }),
      makeToken('0xP', { pinned: true }),
      makeToken('0xr1'),
    ]
    const result = resolve(tokens, { nativeHoisted: true })

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

  it('should start the band at 0 when the caller hoisted nothing', () => {
    const tokens = [makeToken('0xN', { native: true }), makeToken('0xr1')]
    expect(resolve(tokens).recentStartIndex).toBe(0)
  })

  it('should drop a recent token that is pinned', () => {
    const tokens = [makeToken('0xp', { pinned: true })]
    expect(
      resolve(tokens, { recentTokens: [makeRecent('0xp')] }).totalRecentCount
    ).toBe(0)
  })

  it('should let Clear own recents that a pin or the hoist displaced', () => {
    // 0xr1 keeps Clear reachable; the displaced entries must go with it.
    const tokens = [
      makeToken('0xn', { native: true }),
      makeToken('0xp', { pinned: true }),
      makeToken('0xr1'),
    ]
    const result = resolve(tokens, {
      recentTokens: [makeRecent('0xn'), makeRecent('0xp'), makeRecent('0xr1')],
      nativeHoisted: true,
    })

    expect(result.totalRecentCount).toBe(1)
    expect(result.bandEntries.map((e) => e.address)).toEqual([
      '0xn',
      '0xp',
      '0xr1',
    ])
  })

  it('should honour a deny entry whose chainId is a string', () => {
    // Plain-JS integrators may pass a string; utils/token.ts coerces it too.
    const tokens = [makeToken('0xr1')]
    const configTokens = {
      deny: [{ chainId: '1', address: '0xr1' }],
    } as unknown as WidgetTokens

    expect(resolve(tokens, { configTokens }).totalRecentCount).toBe(0)
  })

  it('should keep a config-denied recent out of the Clear payload', () => {
    const tokens = [makeToken('0xr1'), makeToken('0xdenied')]
    const configTokens: WidgetTokens = {
      deny: [{ chainId: 1, address: '0xdenied' }],
    }
    const result = resolve(tokens, {
      recentTokens: [makeRecent('0xr1'), makeRecent('0xdenied')],
      configTokens,
    })

    // Denied on this side only; the opposite side may still show it.
    expect(result.bandEntries.map((e) => e.address)).toEqual(['0xr1'])
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

  it('should not let a stored native flag reach a snapshot row', () => {
    // Forged storage must not earn a scam token the blue native badge.
    const forged = { ...makeRecent('0xr1'), native: true } as RecentToken
    const result = resolve([makeToken('0xA')], { recentTokens: [forged] })

    expect(result.tokens[0].native).toBeUndefined()
  })

  it('should keep a flagged verdict on a snapshot row', () => {
    const tokens = [makeToken('0xA')]
    const result = resolve(tokens, {
      recentTokens: [makeRecent('0xr1', 1, { flagged: true })],
    })

    // Red, not the weaker amber "unverified" a missing verdict would give.
    expect(result.tokens[0].verificationStatus).toBe('flagged')
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

  it('should stop scanning once every recent has a live match', () => {
    // A sentinel past the last match must never be visited.
    const tokens = [makeToken('0xr1', { name: 'Fresh' })]
    let visitedAfterMatch = false
    const probe = new Proxy(makeToken('0xzz'), {
      get(target, prop, receiver) {
        if (prop === 'address') {
          visitedAfterMatch = true
        }
        return Reflect.get(target, prop, receiver)
      },
    })

    const result = resolve([...tokens, probe as TokenAmount])

    expect(result.totalRecentCount).toBe(1)
    expect(visitedAfterMatch).toBe(false)
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

  it('should re-slice without re-resolving when the band expands', () => {
    const tokens = [makeToken('0xA')]
    const resolved = resolveRecentRows(tokens, {
      ...baseParams,
      recentTokens: Array.from({ length: 6 }, (_, i) => makeRecent(`0xr${i}`)),
    })

    expect(spliceRecentRows(tokens, resolved, false).recentCount).toBe(4)
    expect(spliceRecentRows(tokens, resolved, true).recentCount).toBe(6)
  })
})
