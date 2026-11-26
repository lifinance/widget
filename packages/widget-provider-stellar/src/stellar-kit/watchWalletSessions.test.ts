import type {
  IOnChangeEvent,
  ModuleInterface,
} from '@creit.tech/stellar-wallets-kit'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { create } from 'zustand'
import type { StellarWalletsKitState, StellarWalletsKitStore } from './types.js'

vi.mock('@creit.tech/stellar-wallets-kit', () => ({
  activeAddress: { value: undefined as string | undefined },
}))

const { activeAddress } = await import('@creit.tech/stellar-wallets-kit')
const { watchWalletSessions } = await import('./watchWalletSessions.js')

const PUBLIC = 'Public Global Stellar Network ; September 2015'

const createTestStore = (
  partial: Partial<StellarWalletsKitState> = {}
): StellarWalletsKitStore =>
  create<StellarWalletsKitState>(() => ({
    networkPassphrase: PUBLIC,
    wallets: [],
    selectedWalletId: 'metamask',
    selectedWallet: null,
    address: 'GOLD',
    connected: true,
    connecting: false,
    connect: vi.fn(async () => null),
    disconnect: vi.fn(async () => {}),
    refreshWallets: vi.fn(async () => {}),
    isWalletReachable: vi.fn(async () => true),
    getWalletNetwork: vi.fn(async () => PUBLIC),
    ...partial,
  }))

const createModule = (productId: string) =>
  ({
    productId,
    onChange: vi.fn(),
  }) as unknown as ModuleInterface & {
    onChange: ReturnType<typeof vi.fn>
  }

const createMetaMask = () => ({
  productId: 'metamask',
  onSessionEnd: vi.fn(),
  checkSessionEnded: vi.fn(async () => false),
})

const emitChange = (
  module: ReturnType<typeof createModule>,
  event: Partial<IOnChangeEvent>
) => {
  const [callback] = module.onChange.mock.calls[0] as [
    (event: IOnChangeEvent) => void,
  ]
  callback({ address: '', network: '', networkPassphrase: PUBLIC, ...event })
}

const endSession = (metaMask: ReturnType<typeof createMetaMask>) => {
  const [listener] = metaMask.onSessionEnd.mock.calls[0] as [() => void]
  listener()
}

describe('watchWalletSessions', () => {
  let metaMaskModule: ReturnType<typeof createModule>
  let metaMask: ReturnType<typeof createMetaMask>

  beforeEach(() => {
    activeAddress.value = undefined
    metaMaskModule = createModule('metamask')
    metaMask = createMetaMask()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('account sync', () => {
    it('updates the address on an account change of the selected, connected wallet', () => {
      const store = createTestStore()
      watchWalletSessions(store, [metaMaskModule], metaMask)

      emitChange(metaMaskModule, { address: 'GNEW' })

      expect(activeAddress.value).toBe('GNEW')
    })

    it('ignores an account change of another wallet', () => {
      const store = createTestStore({ selectedWalletId: 'freighter' })
      watchWalletSessions(store, [metaMaskModule], metaMask)

      emitChange(metaMaskModule, { address: 'GNEW' })

      expect(activeAddress.value).toBeUndefined()
    })

    it('ignores an event with an error', () => {
      const store = createTestStore()
      watchWalletSessions(store, [metaMaskModule], metaMask)

      emitChange(metaMaskModule, {
        address: 'GNEW',
        error: { code: -1, message: 'failed' },
      })

      expect(activeAddress.value).toBeUndefined()
    })

    it('ignores an empty address', () => {
      const store = createTestStore()
      watchWalletSessions(store, [metaMaskModule], metaMask)

      emitChange(metaMaskModule, { address: '' })

      expect(activeAddress.value).toBeUndefined()
    })

    it('ignores an event while the store is not connected', () => {
      const store = createTestStore({ connected: false })
      watchWalletSessions(store, [metaMaskModule], metaMask)

      emitChange(metaMaskModule, { address: 'GNEW' })

      expect(activeAddress.value).toBeUndefined()
    })

    it('ignores the current address', () => {
      const store = createTestStore()
      watchWalletSessions(store, [metaMaskModule], metaMask)

      emitChange(metaMaskModule, { address: 'GOLD' })

      expect(activeAddress.value).toBeUndefined()
    })

    it('skips modules without onChange', () => {
      const store = createTestStore()
      const freighter = { productId: 'freighter' } as ModuleInterface

      expect(() =>
        watchWalletSessions(store, [freighter, metaMaskModule], metaMask)
      ).not.toThrow()
      expect(metaMaskModule.onChange).toHaveBeenCalledTimes(1)
    })

    it("keeps the other subscriptions when one module's onChange throws", () => {
      const store = createTestStore()
      const broken = createModule('scopuly')
      broken.onChange.mockImplementation(() => {
        throw new TypeError('provider.onChange is not a function')
      })

      expect(() =>
        watchWalletSessions(store, [broken, metaMaskModule], metaMask)
      ).not.toThrow()
      expect(metaMaskModule.onChange).toHaveBeenCalledTimes(1)
      expect(console.warn).toHaveBeenCalledTimes(1)
    })
  })

  describe('MetaMask session end', () => {
    it('disconnects when MetaMask ends the session while MetaMask is selected and connected', () => {
      const store = createTestStore()
      watchWalletSessions(store, [metaMaskModule], metaMask)

      endSession(metaMask)

      expect(store.getState().disconnect).toHaveBeenCalledTimes(1)
    })

    it('does not disconnect on a session end while another wallet is selected', () => {
      const store = createTestStore({ selectedWalletId: 'freighter' })
      watchWalletSessions(store, [metaMaskModule], metaMask)

      endSession(metaMask)

      expect(store.getState().disconnect).not.toHaveBeenCalled()
    })

    it('does not disconnect on a session end while not connected', () => {
      const store = createTestStore({ connected: false })
      watchWalletSessions(store, [metaMaskModule], metaMask)

      endSession(metaMask)

      expect(store.getState().disconnect).not.toHaveBeenCalled()
    })

    it('logs a disconnect rejection after a session end', async () => {
      const store = createTestStore({
        disconnect: vi.fn(async () => {
          throw new Error('disconnect failed')
        }),
      })
      watchWalletSessions(store, [metaMaskModule], metaMask)

      endSession(metaMask)

      await vi.waitFor(() => expect(console.warn).toHaveBeenCalledTimes(1))
    })
  })

  describe('page-load check', () => {
    it('subscribes before the page-load check', () => {
      const store = createTestStore()
      watchWalletSessions(store, [metaMaskModule], metaMask)

      const [checkOrder] = metaMask.checkSessionEnded.mock.invocationCallOrder
      expect(metaMaskModule.onChange.mock.invocationCallOrder[0]).toBeLessThan(
        checkOrder
      )
      expect(metaMask.onSessionEnd.mock.invocationCallOrder[0]).toBeLessThan(
        checkOrder
      )
    })

    it('disconnects a restored MetaMask session that MetaMask ended', async () => {
      metaMask.checkSessionEnded.mockResolvedValueOnce(true)
      const store = createTestStore()

      watchWalletSessions(store, [metaMaskModule], metaMask)

      await vi.waitFor(() =>
        expect(store.getState().disconnect).toHaveBeenCalledTimes(1)
      )
    })

    it('keeps a restored MetaMask session when the check is not sure', async () => {
      const store = createTestStore()

      watchWalletSessions(store, [metaMaskModule], metaMask)
      await Promise.resolve()
      await Promise.resolve()

      expect(metaMask.checkSessionEnded).toHaveBeenCalledTimes(1)
      expect(store.getState().disconnect).not.toHaveBeenCalled()
    })

    it.each([
      ['another wallet is selected', { selectedWalletId: 'freighter' }],
      ['the store is not connected', { connected: false }],
    ])('does not run when %s', (_label, partial) => {
      const store = createTestStore(partial)

      watchWalletSessions(store, [metaMaskModule], metaMask)

      expect(metaMask.checkSessionEnded).not.toHaveBeenCalled()
    })

    it('does not disconnect when the check rejects', async () => {
      metaMask.checkSessionEnded.mockRejectedValueOnce(new Error('boom'))
      const store = createTestStore()

      watchWalletSessions(store, [metaMaskModule], metaMask)

      await vi.waitFor(() => expect(console.warn).toHaveBeenCalledTimes(1))
      expect(store.getState().disconnect).not.toHaveBeenCalled()
    })

    it('does not disconnect a wallet the user picked while the check waited', async () => {
      let resolveCheck: (ended: boolean) => void = () => {}
      metaMask.checkSessionEnded.mockReturnValueOnce(
        new Promise<boolean>((resolve) => {
          resolveCheck = resolve
        })
      )
      const store = createTestStore()
      watchWalletSessions(store, [metaMaskModule], metaMask)

      store.setState({ selectedWalletId: 'freighter' })
      resolveCheck(true)
      await Promise.resolve()
      await Promise.resolve()

      expect(store.getState().disconnect).not.toHaveBeenCalled()
    })
  })
})
