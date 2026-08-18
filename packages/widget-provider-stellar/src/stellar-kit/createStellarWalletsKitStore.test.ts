import { beforeEach, describe, expect, it, vi } from 'vitest'

const listeners: Record<string, (event: unknown) => void> = {}
const disposers: Array<ReturnType<typeof vi.fn>> = []

vi.mock('@creit.tech/stellar-wallets-kit', () => ({
  KitEventType: {
    STATE_UPDATED: 'STATE_UPDATE',
    WALLET_SELECTED: 'WALLET_SELECTED',
    DISCONNECT: 'DISCONNECT',
  },
  StellarWalletsKit: {
    on: vi.fn((type: string, callback: (event: unknown) => void) => {
      listeners[type] = callback
      const dispose = vi.fn()
      disposers.push(dispose)
      return dispose
    }),
    refreshSupportedWallets: vi.fn(async () => []),
    setWallet: vi.fn(),
    fetchAddress: vi.fn(async () => ({ address: 'GCONNECTED' })),
    disconnect: vi.fn(async () => {}),
    getNetwork: vi.fn(async () => {
      throw new Error('does not support the getNetwork function')
    }),
    get selectedModule(): never {
      throw new Error('Please set the wallet first')
    },
  },
}))

vi.mock('@creit.tech/stellar-wallets-kit/modules/xbull', () => ({
  XBULL_ID: 'xbull',
}))

vi.mock('./createStellarWalletsKit.js', () => ({
  ENABLED_WALLET_IDS: ['freighter', 'xbull'],
  initStellarWalletsKit: () => ({
    networkPassphrase: 'Test SDF Network ; September 2015',
  }),
}))

const { createStellarWalletsKitStore } = await import(
  './createStellarWalletsKitStore.js'
)

describe('createStellarWalletsKitStore', () => {
  beforeEach(() => {
    for (const key of Object.keys(listeners)) {
      delete listeners[key]
    }
    disposers.length = 0
  })

  it('does not report a restored address as connected', () => {
    const store = createStellarWalletsKitStore()

    listeners.STATE_UPDATE?.({ payload: { address: 'GRESTORED' } })

    expect(store.getState().address).toBe('GRESTORED')
    expect(store.getState().connected).toBe(false)
  })

  it('reports connected only after an explicit connect handshake', async () => {
    const store = createStellarWalletsKitStore()

    await store.getState().connect('freighter')

    expect(store.getState().address).toBe('GCONNECTED')
    expect(store.getState().connected).toBe(true)
  })

  it('clears connected state on disconnect', async () => {
    const store = createStellarWalletsKitStore()
    await store.getState().connect('freighter')

    await store.getState().disconnect()

    expect(store.getState().address).toBeNull()
    expect(store.getState().connected).toBe(false)
  })

  it('disposes every kit listener on destroy', () => {
    const store = createStellarWalletsKitStore()
    expect(disposers.length).toBeGreaterThan(0)

    store.getState().destroy()

    for (const dispose of disposers) {
      expect(dispose).toHaveBeenCalled()
    }
  })
})
