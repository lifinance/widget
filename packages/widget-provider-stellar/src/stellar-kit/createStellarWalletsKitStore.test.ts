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
const activeAddress: { value: string | undefined } = { value: undefined }

// Like the real kit: the address signal changes and STATE_UPDATED fires synchronously.
const writeKitAddress = (address: string | undefined) => {
  activeAddress.value = address
  listeners.STATE_UPDATE?.({ payload: { address } })
}

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
  activeAddress,
  StellarWalletsKit: {
    on: vi.fn((type: string, callback: (event: unknown) => void) => {
      listeners[type] = callback
      const dispose = vi.fn()
      disposers.push(dispose)
      return dispose
    }),
    refreshSupportedWallets: vi.fn(async () => []),
    setWallet: vi.fn(),
    fetchAddress: vi.fn(async () => {
      if (fetchAddressError !== undefined) {
        throw fetchAddressError
      }
      writeKitAddress('GCONNECTED')
      return { address: 'GCONNECTED' }
    }),
    disconnect: vi.fn(async () => {
      writeKitAddress(undefined)
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

// The next fetchAddress call waits until the test approves or declines it.
const holdFetchAddress = (address: string) => {
  const request = { approve: () => {}, decline: () => {} }
  vi.mocked(StellarWalletsKit.fetchAddress).mockImplementationOnce(
    () =>
      new Promise((resolve, reject) => {
        request.approve = () => {
          writeKitAddress(address)
          resolve({ address })
        }
        request.decline = () =>
          reject({ code: -4, message: 'The user rejected this request.' })
      })
  )
  return request
}

// The next network check waits until the test releases it.
const holdNetworkCheck = () => {
  const check: { release?: () => void } = {}
  vi.mocked(StellarWalletsKit.getNetwork).mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        check.release = () =>
          resolve({
            network: 'TESTNET',
            networkPassphrase: 'Test SDF Network ; September 2015',
          })
      })
  )
  return check
}

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
    activeAddress.value = undefined
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

  it('keeps a newer connection when an abandoned connect fails late', async () => {
    const store = createStellarWalletsKitStore()
    let rejectAbandoned!: (reason: unknown) => void
    vi.mocked(StellarWalletsKit.fetchAddress).mockImplementationOnce(
      () =>
        new Promise((_resolve, reject) => {
          rejectAbandoned = reject
        })
    )

    const abandoned = store.getState().connect('varial')
    await store.getState().connect('xbull')
    rejectAbandoned({ code: -4, message: 'The user rejected this request.' })
    await expect(abandoned).rejects.toMatchObject({ code: -4 })

    expect(store.getState()).toMatchObject({
      address: 'GCONNECTED',
      connected: true,
      connecting: false,
    })
  })

  it('joins a running connect to the same wallet', async () => {
    const store = createStellarWalletsKitStore()
    vi.mocked(StellarWalletsKit.fetchAddress).mockClear()

    const first = store.getState().connect('varial')
    const second = store.getState().connect('varial')

    await expect(Promise.all([first, second])).resolves.toEqual([
      'GCONNECTED',
      'GCONNECTED',
    ])
    expect(StellarWalletsKit.fetchAddress).toHaveBeenCalledTimes(1)
    expect(store.getState()).toMatchObject({
      address: 'GCONNECTED',
      connected: true,
      connecting: false,
    })
  })

  it('starts a new request after the previous connect settled', async () => {
    const store = createStellarWalletsKitStore()
    vi.mocked(StellarWalletsKit.fetchAddress).mockClear()

    await store.getState().connect('varial')
    await store.getState().connect('varial')

    expect(StellarWalletsKit.fetchAddress).toHaveBeenCalledTimes(2)
  })

  it('resets the kit when the newest connect fails', async () => {
    const store = createStellarWalletsKitStore()
    vi.mocked(StellarWalletsKit.disconnect).mockClear()
    fetchAddressError = { code: -4, message: 'The user rejected this request.' }

    await expect(store.getState().connect('varial')).rejects.toMatchObject({
      code: -4,
    })

    expect(StellarWalletsKit.disconnect).toHaveBeenCalledTimes(1)
  })

  describe('when the user approves a wallet they left', () => {
    let approveLeft: () => void
    let declineLeft: () => void

    const startLeftConnect = (
      store: ReturnType<typeof createStellarWalletsKitStore>
    ) => {
      const left = holdFetchAddress('GLEFT')
      approveLeft = () => left.approve()
      declineLeft = () => left.decline()
      return store.getState().connect('varial')
    }

    const failNewerConnect = async (
      store: ReturnType<typeof createStellarWalletsKitStore>
    ) => {
      fetchAddressError = {
        code: -4,
        message: 'The user rejected this request.',
      }
      await expect(store.getState().connect('xbull')).rejects.toMatchObject({
        code: -4,
      })
      fetchAddressError = undefined
    }

    it('connects it after the newer connect failed', async () => {
      const store = createStellarWalletsKitStore()
      const left = startLeftConnect(store)
      await failNewerConnect(store)
      vi.mocked(StellarWalletsKit.setWallet).mockClear()

      approveLeft()

      await expect(left).resolves.toBe('GLEFT')
      expect(StellarWalletsKit.setWallet).toHaveBeenLastCalledWith('varial')
      expect(store.getState()).toMatchObject({
        address: 'GLEFT',
        connected: true,
        connecting: false,
      })
    })

    it('checks its network before it reports a connection', async () => {
      const store = createStellarWalletsKitStore()
      const left = startLeftConnect(store)
      await failNewerConnect(store)
      walletNetwork = 'Public Global Stellar Network ; September 2015'
      vi.mocked(StellarWalletsKit.disconnect).mockClear()
      const seen: boolean[] = []
      store.subscribe((state) => seen.push(state.connected))

      approveLeft()

      await expect(left).rejects.toThrow('Switch the network')
      expect(seen).not.toContain(true)
      expect(StellarWalletsKit.disconnect).toHaveBeenCalledTimes(1)
      expect(store.getState()).toMatchObject({
        address: null,
        connected: false,
      })
    })

    it('keeps the connection of the wallet the user chose next', async () => {
      const store = createStellarWalletsKitStore()
      const left = startLeftConnect(store)
      await store.getState().connect('xbull')

      approveLeft()

      await expect(left).rejects.toThrow(
        'A newer wallet connection replaced this one.'
      )
      expect(activeAddress.value).toBe('GCONNECTED')
      expect(store.getState()).toMatchObject({
        address: 'GCONNECTED',
        connected: true,
      })
    })

    it('keeps its address out of the kit while a newer connect runs', async () => {
      const store = createStellarWalletsKitStore()
      const left = startLeftConnect(store)
      let approveNewer!: () => void
      vi.mocked(StellarWalletsKit.fetchAddress).mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            approveNewer = () => {
              writeKitAddress('GNEWER')
              resolve({ address: 'GNEWER' })
            }
          })
      )
      const newer = store.getState().connect('xbull')

      approveLeft()

      await expect(left).rejects.toThrow(
        'A newer wallet connection replaced this one.'
      )
      expect(activeAddress.value).toBeUndefined()
      approveNewer()
      await expect(newer).resolves.toBe('GNEWER')
      expect(activeAddress.value).toBe('GNEWER')
    })

    it('leaves the newer address in the kit when it approves during the newer network check', async () => {
      const store = createStellarWalletsKitStore()
      const left = startLeftConnect(store)
      let releaseNetwork: (() => void) | undefined
      vi.mocked(StellarWalletsKit.getNetwork).mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            releaseNetwork = () =>
              resolve({
                network: 'TESTNET',
                networkPassphrase: 'Test SDF Network ; September 2015',
              })
          })
      )
      const newer = store.getState().connect('xbull')
      await vi.waitFor(() => expect(releaseNetwork).toBeDefined())

      approveLeft()
      await expect(left).rejects.toThrow(
        'A newer wallet connection replaced this one.'
      )
      releaseNetwork?.()

      await expect(newer).resolves.toBe('GCONNECTED')
      expect(activeAddress.value).toBe('GCONNECTED')
      expect(store.getState()).toMatchObject({
        address: 'GCONNECTED',
        connected: true,
      })
    })

    it('connects it when the user picked it again and approves the first request', async () => {
      const store = createStellarWalletsKitStore()
      const left = startLeftConnect(store)
      await failNewerConnect(store)
      const second = holdFetchAddress('GSECOND')
      const again = store.getState().connect('varial')

      approveLeft()

      await expect(left).resolves.toBe('GLEFT')
      expect(activeAddress.value).toBe('GLEFT')
      expect(store.getState()).toMatchObject({
        address: 'GLEFT',
        connected: true,
        connecting: false,
      })
      second.approve()
      await expect(again).rejects.toThrow(
        'A newer wallet connection replaced this one.'
      )
      expect(activeAddress.value).toBe('GLEFT')
      expect(store.getState()).toMatchObject({
        address: 'GLEFT',
        connected: true,
      })
    })

    it('keeps the first approval when the second request of that wallet is declined late', async () => {
      const store = createStellarWalletsKitStore()
      const left = startLeftConnect(store)
      await failNewerConnect(store)
      const second = holdFetchAddress('GSECOND')
      const again = store.getState().connect('varial')
      approveLeft()
      await expect(left).resolves.toBe('GLEFT')
      vi.mocked(StellarWalletsKit.disconnect).mockClear()

      second.decline()

      await expect(again).rejects.toMatchObject({ code: -4 })
      expect(StellarWalletsKit.disconnect).not.toHaveBeenCalled()
      expect(activeAddress.value).toBe('GLEFT')
      expect(store.getState()).toMatchObject({
        address: 'GLEFT',
        connected: true,
      })
    })

    it('connects it when the user picked it again after another wallet connected', async () => {
      const store = createStellarWalletsKitStore()
      const left = startLeftConnect(store)
      await store.getState().connect('xbull')
      await store.getState().disconnect()
      holdFetchAddress('GSECOND')
      void store.getState().connect('varial')

      approveLeft()

      await expect(left).resolves.toBe('GLEFT')
      expect(store.getState()).toMatchObject({
        address: 'GLEFT',
        connected: true,
      })
    })

    it('joins the request that took over when the user picks the wallet again', async () => {
      const store = createStellarWalletsKitStore()
      const left = startLeftConnect(store)
      await failNewerConnect(store)
      holdFetchAddress('GSECOND')
      void store.getState().connect('varial')
      const check = holdNetworkCheck()
      approveLeft()
      await vi.waitFor(() => expect(check.release).toBeDefined())
      vi.mocked(StellarWalletsKit.fetchAddress).mockClear()

      const third = store.getState().connect('varial')
      check.release?.()

      await expect(Promise.all([left, third])).resolves.toEqual([
        'GLEFT',
        'GLEFT',
      ])
      expect(StellarWalletsKit.fetchAddress).not.toHaveBeenCalled()
    })

    it('hands the result of the request that took over to the request it replaced', async () => {
      const store = createStellarWalletsKitStore()
      const left = startLeftConnect(store)
      await failNewerConnect(store)
      const secondCheck = holdNetworkCheck()
      const again = store.getState().connect('varial')
      await vi.waitFor(() => expect(secondCheck.release).toBeDefined())
      const leftCheck = holdNetworkCheck()
      approveLeft()
      await vi.waitFor(() => expect(leftCheck.release).toBeDefined())

      secondCheck.release?.()
      leftCheck.release?.()

      await expect(Promise.all([left, again])).resolves.toEqual([
        'GLEFT',
        'GLEFT',
      ])
      expect(activeAddress.value).toBe('GLEFT')
    })

    it('keeps the turn of the request that took over when the second request answers during its network check', async () => {
      const store = createStellarWalletsKitStore()
      const left = startLeftConnect(store)
      await failNewerConnect(store)
      const second = holdFetchAddress('GSECOND')
      const again = store.getState().connect('varial')
      const leftCheck = holdNetworkCheck()
      approveLeft()
      await vi.waitFor(() => expect(leftCheck.release).toBeDefined())

      second.approve()
      await new Promise((resolve) => setTimeout(resolve, 0))
      leftCheck.release?.()

      await expect(Promise.all([left, again])).resolves.toEqual([
        'GLEFT',
        'GLEFT',
      ])
      expect(activeAddress.value).toBe('GLEFT')
      expect(store.getState()).toMatchObject({
        address: 'GLEFT',
        connected: true,
      })
    })

    it('waits for the second request of that wallet when the first is declined', async () => {
      const store = createStellarWalletsKitStore()
      const left = startLeftConnect(store)
      await failNewerConnect(store)
      const second = holdFetchAddress('GSECOND')
      const again = store.getState().connect('varial')

      declineLeft()
      await Promise.resolve()
      second.approve()

      await expect(Promise.all([left, again])).resolves.toEqual([
        'GSECOND',
        'GSECOND',
      ])
      expect(store.getState()).toMatchObject({
        address: 'GSECOND',
        connected: true,
      })
    })

    it('does not connect a later left wallet after an older one took over and the user disconnected', async () => {
      const store = createStellarWalletsKitStore()
      const left = startLeftConnect(store)
      const middle = holdFetchAddress('GMIDDLE')
      const middleConnect = store.getState().connect('xbull')
      fetchAddressError = {
        code: -4,
        message: 'The user rejected this request.',
      }
      await expect(store.getState().connect('varial')).rejects.toMatchObject({
        code: -4,
      })
      fetchAddressError = undefined
      approveLeft()
      await expect(left).resolves.toBe('GLEFT')
      await store.getState().disconnect()

      middle.approve()

      await expect(middleConnect).rejects.toThrow(
        'A newer wallet connection replaced this one.'
      )
      expect(activeAddress.value).toBeUndefined()
      expect(store.getState()).toMatchObject({
        address: null,
        connected: false,
      })
    })

    it('does not connect it after a newer connect succeeded and the user disconnected', async () => {
      const store = createStellarWalletsKitStore()
      const left = startLeftConnect(store)
      await store.getState().connect('xbull')
      await store.getState().disconnect()

      approveLeft()

      await expect(left).rejects.toThrow(
        'A newer wallet connection replaced this one.'
      )
      expect(activeAddress.value).toBeUndefined()
      expect(store.getState()).toMatchObject({
        address: null,
        connected: false,
      })
    })
  })

  it('clears a left address from the kit when another wallet starts connecting', async () => {
    const store = createStellarWalletsKitStore()
    const check = holdNetworkCheck()
    void store.getState().connect('varial')
    await vi.waitFor(() => expect(check.release).toBeDefined())
    expect(activeAddress.value).toBe('GCONNECTED')
    holdFetchAddress('GNEWER')

    void store.getState().connect('xbull')

    expect(activeAddress.value).toBeUndefined()
  })

  it('does not put the connected address next to a newer wallet when a left connect ends', async () => {
    const store = createStellarWalletsKitStore()
    const left = holdFetchAddress('GLEFT')
    const leftConnect = store.getState().connect('varial')
    await store.getState().connect('xbull')
    holdFetchAddress('GNEWER')
    void store.getState().connect('xbull')

    left.approve()

    await expect(leftConnect).rejects.toThrow(
      'A newer wallet connection replaced this one.'
    )
    expect(activeAddress.value).toBeUndefined()
  })

  it('clears its address from the kit when a newer connect starts during its network check', async () => {
    const store = createStellarWalletsKitStore()
    let releaseNetwork: (() => void) | undefined
    vi.mocked(StellarWalletsKit.getNetwork).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          releaseNetwork = () =>
            resolve({
              network: 'TESTNET',
              networkPassphrase: 'Test SDF Network ; September 2015',
            })
        })
    )
    const older = store.getState().connect('varial')
    await vi.waitFor(() => expect(releaseNetwork).toBeDefined())
    vi.mocked(StellarWalletsKit.fetchAddress).mockImplementationOnce(
      () => new Promise(() => {})
    )
    void store.getState().connect('xbull')

    releaseNetwork?.()

    await expect(older).rejects.toThrow(
      'A newer wallet connection replaced this one.'
    )
    expect(activeAddress.value).toBeUndefined()
  })

  it('rejects a connect that a newer connect replaced', async () => {
    const store = createStellarWalletsKitStore()
    let resolveAbandoned!: () => void
    vi.mocked(StellarWalletsKit.fetchAddress).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveAbandoned = () => {
            writeKitAddress('GSTALE')
            resolve({ address: 'GSTALE' })
          }
        })
    )
    let resolveNewer!: () => void
    vi.mocked(StellarWalletsKit.fetchAddress).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveNewer = () => {
            writeKitAddress('GNEWER')
            resolve({ address: 'GNEWER' })
          }
        })
    )

    const abandoned = store.getState().connect('varial')
    const newer = store.getState().connect('xbull')
    resolveAbandoned()
    await expect(abandoned).rejects.toThrow(
      'A newer wallet connection replaced this one.'
    )
    resolveNewer()
    await expect(newer).resolves.toBe('GNEWER')

    expect(store.getState()).toMatchObject({
      address: 'GNEWER',
      connected: true,
      connecting: false,
    })
  })

  it('does not disconnect a newer connection when an older network check fails', async () => {
    const store = createStellarWalletsKitStore()
    vi.mocked(StellarWalletsKit.disconnect).mockClear()
    let resolveNetwork:
      | ((value: { network: string; networkPassphrase: string }) => void)
      | undefined
    vi.mocked(StellarWalletsKit.getNetwork).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveNetwork = resolve
        })
    )

    const abandoned = store.getState().connect('varial')
    await vi.waitFor(() => expect(resolveNetwork).toBeDefined())
    await store.getState().connect('xbull')
    resolveNetwork?.({
      network: 'PUBLIC',
      networkPassphrase: 'Public Global Stellar Network ; September 2015',
    })
    await expect(abandoned).rejects.toThrow('Switch the network')

    expect(StellarWalletsKit.disconnect).not.toHaveBeenCalled()
    expect(store.getState()).toMatchObject({
      address: 'GCONNECTED',
      connected: true,
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
