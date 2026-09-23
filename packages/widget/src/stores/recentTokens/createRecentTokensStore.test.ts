import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { TokenAmount } from '../../types/token.js'
import { createRecentTokensStore } from './createRecentTokensStore.js'
import type { RecentToken } from './types.js'
import { toRecentToken } from './utils.js'

const createLocalStorageMock = (): Storage => {
  let store: Record<string, string> = {}
  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => {
      store[key] = value
    },
    removeItem: (key) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    key: (index) => Object.keys(store)[index] ?? null,
    get length() {
      return Object.keys(store).length
    },
  }
}

const makeRecent = (
  address: string,
  chainId = 1,
  overrides: Partial<RecentToken> = {}
): RecentToken => ({
  chainId,
  address,
  symbol: 'TKN',
  name: 'Token',
  decimals: 18,
  ...overrides,
})

describe('toRecentToken', () => {
  it("should keep only the persisted fields, in the token's own casing", () => {
    const token = {
      chainId: 8453,
      address: '0xABCDEF',
      symbol: 'DEGEN',
      name: 'Degen',
      decimals: 18,
      logoURI: 'https://example.test/degen.png',
      native: true,
      priceUSD: '1.23',
      amount: 5n,
      verificationStatus: 'verified',
      listed: true,
    } as unknown as TokenAmount

    expect(toRecentToken(token)).toEqual({
      chainId: 8453,
      // Casing is preserved; it is written back into the form.
      address: '0xABCDEF',
      symbol: 'DEGEN',
      name: 'Degen',
      decimals: 18,
      logoURI: 'https://example.test/degen.png',
    })
  })
})

describe('toRecentToken verdicts', () => {
  it('should keep a flagged verdict and drop every other one', () => {
    const base = {
      chainId: 1,
      address: '0xA',
      symbol: 'A',
      name: 'A',
      decimals: 18,
    }
    const flagged = toRecentToken({
      ...base,
      verificationStatus: 'flagged',
    } as unknown as TokenAmount)
    const verified = toRecentToken({
      ...base,
      verificationStatus: 'verified',
    } as unknown as TokenAmount)

    expect(flagged.flagged).toBe(true)
    expect(verified.flagged).toBeUndefined()
  })
})

describe('createRecentTokensStore', () => {
  let originalWindow: typeof globalThis.window | undefined
  let storageMock: Storage
  let store: ReturnType<typeof createRecentTokensStore>

  beforeEach(() => {
    // persist reads window.localStorage; node has none and would silently no-op.
    originalWindow = globalThis.window
    storageMock = createLocalStorageMock()
    globalThis.window = {
      localStorage: storageMock,
    } as typeof globalThis.window
    store = createRecentTokensStore({ namePrefix: 'test' })
  })

  afterEach(() => {
    globalThis.window = originalWindow as typeof globalThis.window
  })

  it('should prepend a new token', () => {
    store.getState().addRecentToken(makeRecent('0xA'))
    store.getState().addRecentToken(makeRecent('0xB'))
    expect(store.getState().recentTokens.map((t) => t.address)).toEqual([
      '0xB',
      '0xA',
    ])
  })

  it('should dedupe by chain and address, moving the entry to the front', () => {
    store.getState().addRecentToken(makeRecent('0xA'))
    store.getState().addRecentToken(makeRecent('0xB'))
    store.getState().addRecentToken(makeRecent('0xA'))
    expect(store.getState().recentTokens.map((t) => t.address)).toEqual([
      '0xA',
      '0xB',
    ])
  })

  it('should treat the same address on another chain as a separate entry', () => {
    store.getState().addRecentToken(makeRecent('0xA', 1))
    store.getState().addRecentToken(makeRecent('0xA', 8453))
    expect(store.getState().recentTokens).toHaveLength(2)
  })

  it('should keep at most 10 entries and evict the oldest', () => {
    for (let i = 0; i < 12; i++) {
      store.getState().addRecentToken(makeRecent(`0x${i}`))
    }
    const addresses = store.getState().recentTokens.map((t) => t.address)
    expect(addresses).toHaveLength(10)
    expect(addresses[0]).toBe('0x11')
    expect(addresses).not.toContain('0x0')
    expect(addresses).not.toContain('0x1')
  })

  it('should match a checksummed address case-insensitively', () => {
    store.getState().addRecentToken(makeRecent('0xAbC'))
    expect(store.getState().isRecentToken(1, '0xABC')).toBe(true)
    expect(store.getState().isRecentToken(1, '0xabc')).toBe(true)
    store.getState().removeRecentToken(1, '0xABC')
    expect(store.getState().isRecentToken(1, '0xAbC')).toBe(false)
  })

  it('should dedupe across casings while keeping the newest casing', () => {
    store.getState().addRecentToken(makeRecent('0xabc'))
    store.getState().addRecentToken(makeRecent('0xABC'))
    const stored = store.getState().recentTokens
    expect(stored).toHaveLength(1)
    expect(stored[0].address).toBe('0xABC')
  })

  it('should clear exactly the entries it is given', () => {
    store.getState().addRecentToken(makeRecent('0xA', 1))
    store.getState().addRecentToken(makeRecent('0xB', 8453))
    store.getState().addRecentToken(makeRecent('0xC', 1))

    store.getState().clearRecentTokens([
      { chainId: 1, address: '0xA' },
      { chainId: 1, address: '0xC' },
    ])

    const stored = store.getState().recentTokens
    expect(stored).toHaveLength(1)
    expect(stored[0].chainId).toBe(8453)
  })

  it('should never clear an entry the band did not list', () => {
    store.getState().addRecentToken(makeRecent('0xA', 1))
    store.getState().addRecentToken(makeRecent('0xB', 137))

    // A band filtered by config may show chain 1 only, even in all-networks.
    store.getState().clearRecentTokens([{ chainId: 1, address: '0xa' }])

    const stored = store.getState().recentTokens
    expect(stored.map((t) => t.chainId)).toEqual([137])
  })

  it('should clear nothing when given an empty list', () => {
    store.getState().addRecentToken(makeRecent('0xA'))
    store.getState().clearRecentTokens([])
    expect(store.getState().recentTokens).toHaveLength(1)
  })

  it('should drop malformed persisted entries instead of crashing', () => {
    storageMock.setItem(
      'test-recent-tokens',
      JSON.stringify({
        state: {
          recentTokens: [
            makeRecent('0xGood'),
            { ...makeRecent('0xBadLogo'), logoURI: 42 },
            { chainId: 1 },
            { ...makeRecent('0xB'), chainId: '1' },
            null,
            'garbage',
          ],
        },
        version: 0,
      })
    )

    const hydrated = createRecentTokensStore({ namePrefix: 'test' })

    expect(hydrated.getState().recentTokens.map((t) => t.address)).toEqual([
      '0xGood',
    ])
  })

  it('should recover from a persisted value that is not a list', () => {
    storageMock.setItem(
      'test-recent-tokens',
      JSON.stringify({ state: { recentTokens: null }, version: 0 })
    )

    const hydrated = createRecentTokensStore({ namePrefix: 'test' })

    expect(hydrated.getState().recentTokens).toEqual([])
  })

  it('should persist under the prefixed key', () => {
    store.getState().addRecentToken(makeRecent('0xA'))
    const persisted = storageMock.getItem('test-recent-tokens')
    expect(persisted).toBeTruthy()
    expect(JSON.parse(persisted as string).state.recentTokens).toHaveLength(1)
  })
})
