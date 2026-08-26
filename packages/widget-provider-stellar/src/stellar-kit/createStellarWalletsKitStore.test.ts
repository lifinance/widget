import { beforeEach, describe, expect, it, vi } from 'vitest'

const listeners: Record<string, (event: unknown) => void> = {}
const disposers: Array<ReturnType<typeof vi.fn>> = []

let moduleAvailable = true
let moduleSelected = true
let walletNetwork: string | null = null
let walletNetworkMissing = false
let moduleProductId = 'freighter'

vi.mock('@creit.tech/stellar-wallets-kit', () => ({
  Networks: {
    PUBLIC: 'Public Global Stellar Network ; September 2015',
    TESTNET: 'Test SDF Network ; September 2015',
  },
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
      // Klever and Bitget pass the extension's reply through untyped.
      if (walletNetworkMissing) {
        return {} as { networkPassphrase: string }
      }
      if (walletNetwork === null) {
        throw new Error('does not support the getNetwork function')
      }
      return { networkPassphrase: walletNetwork }
    }),
    get selectedModule() {
      if (!moduleSelected) {
        throw new Error('Please set the wallet first')
      }
      return {
        productId: moduleProductId,
        productName: 'Freighter',
        productIcon: 'icon',
        isAvailable: async () => moduleAvailable,
      }
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
    // The default vitest environment is node, which has no `window`. The store
    // takes its server path without one, so the client-path tests install a stub.
    globalThis.window = {} as Window & typeof globalThis
    moduleAvailable = true
    moduleSelected = true
    for (const key of Object.keys(listeners)) {
      delete listeners[key]
    }
    disposers.length = 0
    walletNetwork = null
    walletNetworkMissing = false
    moduleProductId = 'freighter'
  })

  it('reports a restored address as connected', () => {
    const store = createStellarWalletsKitStore()

    listeners.STATE_UPDATE?.({ payload: { address: 'GRESTORED' } })

    expect(store.getState().address).toBe('GRESTORED')
    expect(store.getState().connected).toBe(true)
  })

  it('reports connected after an explicit connect', async () => {
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

  it('reports the wallet as reachable when the module is available', async () => {
    const store = createStellarWalletsKitStore()

    await expect(store.getState().isWalletReachable()).resolves.toBe(true)
  })

  it('reports the wallet as unreachable when the module is unavailable', async () => {
    const store = createStellarWalletsKitStore()

    moduleAvailable = false

    await expect(store.getState().isWalletReachable()).resolves.toBe(false)
  })

  it('reports the wallet as unreachable when no module is selected', async () => {
    const store = createStellarWalletsKitStore()

    moduleSelected = false

    await expect(store.getState().isWalletReachable()).resolves.toBe(false)
  })
  it('reports the network the wallet is actually on', async () => {
    const store = createStellarWalletsKitStore()

    walletNetwork = 'Test SDF Network ; September 2015'

    await expect(store.getState().getWalletNetwork()).resolves.toBe(
      'Test SDF Network ; September 2015'
    )
  })

  it('falls back to mainnet when the module cannot report its network', async () => {
    const store = createStellarWalletsKitStore()

    walletNetwork = null

    await expect(store.getState().getWalletNetwork()).resolves.toBe(
      'Public Global Stellar Network ; September 2015'
    )
  })
  it('falls back to mainnet when the module reports no network passphrase', async () => {
    const store = createStellarWalletsKitStore()

    walletNetworkMissing = true

    await expect(store.getState().getWalletNetwork()).resolves.toBe(
      'Public Global Stellar Network ; September 2015'
    )
  })

  it('treats xBull as unreachable when the extension global is absent', async () => {
    const store = createStellarWalletsKitStore()

    moduleProductId = 'xbull'
    moduleAvailable = true

    await expect(store.getState().isWalletReachable()).resolves.toBe(false)
  })
  it('does not report a restored address as connected without a known module', () => {
    const store = createStellarWalletsKitStore()

    moduleSelected = false
    listeners.STATE_UPDATE?.({ payload: { address: 'GRESTORED' } })

    expect(store.getState().address).toBe('GRESTORED')
    expect(store.getState().connected).toBe(false)
  })

  // A Next.js prerender crashed with "window is not defined" inside the kit's
  // module constructors, so the server must never touch SWK at all.
  describe('without a window (server render)', () => {
    beforeEach(() => {
      // Runs after the outer hook, so this removes the stub it installed.
      // @ts-expect-error - emulating a server render
      delete globalThis.window
    })

    it('builds an inert store and registers no kit listeners', () => {
      const store = createStellarWalletsKitStore()

      expect(Object.keys(listeners)).toHaveLength(0)
      expect(store.getState().wallets).toEqual([])
      expect(store.getState().address).toBeNull()
      expect(store.getState().connected).toBe(false)
      expect(store.getState().networkPassphrase).toBe(
        'Public Global Stellar Network ; September 2015'
      )
    })

    it('leaves every action safe to call', async () => {
      const store = createStellarWalletsKitStore()

      await expect(store.getState().connect('freighter')).resolves.toBeNull()
      await expect(store.getState().refreshWallets()).resolves.toBeUndefined()
      await expect(store.getState().disconnect()).resolves.toBeUndefined()
      await expect(store.getState().isWalletReachable()).resolves.toBe(false)
      await expect(store.getState().getWalletNetwork()).resolves.toBe(
        'Public Global Stellar Network ; September 2015'
      )
    })
  })
})
