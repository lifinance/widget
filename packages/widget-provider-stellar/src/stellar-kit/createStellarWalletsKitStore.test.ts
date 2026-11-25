import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const listeners: Record<string, (event: unknown) => void> = {}
const disposers: Array<ReturnType<typeof vi.fn>> = []

let moduleAvailable = true
let moduleSelected = true
let walletNetwork: string | null = null
let walletNetworkMissing = false
let moduleProductId = 'varial'
let fetchAddressError: unknown
let modulePending = false

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
    // Like the real kit, these update SWK state, which fires STATE_UPDATED synchronously.
    fetchAddress: vi.fn(async () => {
      if (fetchAddressError !== undefined) {
        throw fetchAddressError
      }
      listeners.STATE_UPDATE?.({ payload: { address: 'GCONNECTED' } })
      return { address: 'GCONNECTED' }
    }),
    disconnect: vi.fn(async () => {
      listeners.STATE_UPDATE?.({ payload: { address: undefined } })
    }),
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
        productName: 'Varial',
        productIcon: 'icon',
        isAvailable: () =>
          modulePending
            ? new Promise<boolean>(() => {})
            : Promise.resolve(moduleAvailable),
      }
    },
  },
}))

vi.mock('@creit.tech/stellar-wallets-kit/modules/xbull', () => ({
  XBULL_ID: 'xbull',
}))

vi.mock('./createStellarWalletsKit.js', () => ({
  ENABLED_WALLET_IDS: ['varial', 'xbull'],
  initStellarWalletsKit: () => ({
    networkPassphrase: 'Test SDF Network ; September 2015',
  }),
}))

const { createStellarWalletsKitStore } =
  await import('./createStellarWalletsKitStore.js')
const { StellarWalletsKit } = await import('@creit.tech/stellar-wallets-kit')

const varialWallet = (isAvailable: boolean) => ({
  id: 'varial',
  name: 'Varial',
  type: 'HOT_WALLET',
  isAvailable,
  isPlatformWrapper: false,
  icon: 'icon',
  url: 'https://varialwallet.com',
})

describe('createStellarWalletsKitStore', () => {
  beforeEach(() => {
    globalThis.window = {} as Window & typeof globalThis
    moduleAvailable = true
    moduleSelected = true
    for (const key of Object.keys(listeners)) {
      delete listeners[key]
    }
    disposers.length = 0
    walletNetwork = null
    walletNetworkMissing = false
    moduleProductId = 'varial'
    fetchAddressError = undefined
    modulePending = false
    vi.mocked(StellarWalletsKit.refreshSupportedWallets)
      .mockReset()
      .mockImplementation(async () => [])
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('runs one follow-up probe for calls made during a probe', async () => {
    let release!: () => void
    vi.mocked(StellarWalletsKit.refreshSupportedWallets).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          release = () => resolve([])
        })
    )
    const store = createStellarWalletsKitStore()

    const first = store.getState().refreshWallets()
    const second = store.getState().refreshWallets()
    expect(StellarWalletsKit.refreshSupportedWallets).toHaveBeenCalledTimes(1)

    release()
    await Promise.all([first, second])

    expect(StellarWalletsKit.refreshSupportedWallets).toHaveBeenCalledTimes(2)
  })

  it('keeps a wallet available after a later probe misses it', async () => {
    vi.mocked(StellarWalletsKit.refreshSupportedWallets)
      .mockResolvedValueOnce([varialWallet(true)])
      .mockResolvedValue([varialWallet(false)])
    const store = createStellarWalletsKitStore()

    await store.getState().refreshWallets()
    await store.getState().refreshWallets()

    expect(store.getState().wallets).toEqual([
      { id: 'varial', name: 'Varial', icon: 'icon', isAvailable: true },
    ])
  })

  it('probes again after a probe fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(StellarWalletsKit.refreshSupportedWallets).mockRejectedValueOnce(
      new Error('probe failed')
    )
    const store = createStellarWalletsKitStore()

    await store
      .getState()
      .refreshWallets()
      .catch(() => {})
    await store.getState().refreshWallets()

    expect(
      vi.mocked(StellarWalletsKit.refreshSupportedWallets).mock.calls.length
    ).toBeGreaterThanOrEqual(2)
  })

  it('waits up to 3 seconds for the wallet before signing', async () => {
    vi.useFakeTimers()
    const store = createStellarWalletsKitStore()
    modulePending = true
    let result: boolean | undefined
    void store
      .getState()
      .isWalletReachable()
      .then((reachable) => {
        result = reachable
      })

    await vi.advanceTimersByTimeAsync(2999)
    expect(result).toBeUndefined()
    await vi.advanceTimersByTimeAsync(1)
    expect(result).toBe(false)
  })

  it('reports a restored address as connected', () => {
    const store = createStellarWalletsKitStore()

    listeners.STATE_UPDATE?.({ payload: { address: 'GRESTORED' } })

    expect(store.getState().address).toBe('GRESTORED')
    expect(store.getState().connected).toBe(true)
  })

  it('reports connected after an explicit connect', async () => {
    const store = createStellarWalletsKitStore()

    await store.getState().connect('varial')

    expect(store.getState().address).toBe('GCONNECTED')
    expect(store.getState().connected).toBe(true)
  })

  it('never reports connected when the wallet is on another network', async () => {
    const store = createStellarWalletsKitStore()
    walletNetwork = 'Public Global Stellar Network ; September 2015'
    const seen: boolean[] = []
    store.subscribe((state) => seen.push(state.connected))

    await expect(store.getState().connect('varial')).rejects.toThrow(
      'Switch the network in your wallet and connect again.'
    )

    expect(seen).not.toContain(true)
    expect(store.getState()).toMatchObject({
      address: null,
      connected: false,
      connecting: false,
    })
  })

  it('rethrows a declined request unchanged and ends disconnected', async () => {
    const store = createStellarWalletsKitStore()
    const declined = { code: -4, message: 'The user rejected this request.' }
    fetchAddressError = declined

    await expect(store.getState().connect('varial')).rejects.toBe(declined)

    expect(store.getState()).toMatchObject({
      address: null,
      connected: false,
      connecting: false,
    })
  })

  it('clears connected state on disconnect', async () => {
    const store = createStellarWalletsKitStore()
    await store.getState().connect('varial')

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

    expect(store.getState().address).toBeNull()
    expect(store.getState().connected).toBe(false)
  })

  describe('without a window (server render)', () => {
    beforeEach(() => {
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

      await expect(store.getState().connect('varial')).resolves.toBeNull()
      await expect(store.getState().refreshWallets()).resolves.toBeUndefined()
      await expect(store.getState().disconnect()).resolves.toBeUndefined()
      await expect(store.getState().isWalletReachable()).resolves.toBe(false)
      await expect(store.getState().getWalletNetwork()).resolves.toBe(
        'Public Global Stellar Network ; September 2015'
      )
    })
  })
})
