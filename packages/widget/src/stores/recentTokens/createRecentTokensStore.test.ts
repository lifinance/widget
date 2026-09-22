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
  address: address.toLowerCase(),
  symbol: 'TKN',
  name: 'Token',
  decimals: 18,
  ...overrides,
})

describe('toRecentToken', () => {
  it('should keep only the persisted fields and lowercase the address', () => {
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
      address: '0xabcdef',
      symbol: 'DEGEN',
      name: 'Degen',
      decimals: 18,
      logoURI: 'https://example.test/degen.png',
      native: true,
    })
  })
})

describe('createRecentTokensStore', () => {
  let originalWindow: typeof globalThis.window | undefined
  let storageMock: Storage
  let store: ReturnType<typeof createRecentTokensStore>

  beforeEach(() => {
    // zustand's persist resolves `window.localStorage`, which the node test
    // environment does not provide; without the shim it silently no-ops.
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
      '0xb',
      '0xa',
    ])
  })

  it('should dedupe by chain and address, moving the entry to the front', () => {
    store.getState().addRecentToken(makeRecent('0xA'))
    store.getState().addRecentToken(makeRecent('0xB'))
    store.getState().addRecentToken(makeRecent('0xA'))
    expect(store.getState().recentTokens.map((t) => t.address)).toEqual([
      '0xa',
      '0xb',
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

  it('should lowercase a checksummed address on every action', () => {
    store.getState().addRecentToken(makeRecent('0xA'))
    expect(store.getState().isRecentToken(1, '0xA')).toBe(true)
    store.getState().removeRecentToken(1, '0xA')
    expect(store.getState().isRecentToken(1, '0xa')).toBe(false)
  })

  it('should empty the list on clear', () => {
    store.getState().addRecentToken(makeRecent('0xA'))
    store.getState().clearRecentTokens()
    expect(store.getState().recentTokens).toEqual([])
  })

  it('should persist under the prefixed key', () => {
    store.getState().addRecentToken(makeRecent('0xA'))
    const persisted = storageMock.getItem('test-recent-tokens')
    expect(persisted).toBeTruthy()
    expect(JSON.parse(persisted as string).state.recentTokens).toHaveLength(1)
  })
})
