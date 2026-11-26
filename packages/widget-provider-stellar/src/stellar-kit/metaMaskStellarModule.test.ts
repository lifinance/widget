import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type Listener = (data?: unknown) => void
type IsAllowedResult = { isAllowed: boolean; error?: unknown }

// Mirrors the parts of SWK's MetaMaskModule (and its adapter) that the
// wrapper touches. The fake adapter emits `disconnect` from `disconnect()`,
// as the real one does while it still has an address.
const createFakeReal = () => {
  const listeners = new Map<string, Set<Listener>>()
  const emit = (event: string, data?: unknown) => {
    for (const listener of listeners.get(event) ?? []) {
      listener(data)
    }
  }
  const changeCallbacks: Array<(event: unknown) => void> = []
  const adapter = {
    on: vi.fn((event: string, listener: Listener) => {
      const set = listeners.get(event) ?? new Set<Listener>()
      set.add(listener)
      listeners.set(event, set)
    }),
    emit,
    disconnect: vi.fn(
      async (_options?: {
        revokeSession?: boolean
      }): Promise<{ error?: unknown }> => {
        emit('disconnect')
        return {}
      }
    ),
    isAllowed: vi.fn(async (): Promise<IsAllowedResult> => ({
      isAllowed: true,
    })),
  }
  return {
    adapter,
    changeCallbacks,
    getAddress: vi.fn(async () => ({ address: 'GADDRESS' })),
    getNetwork: vi.fn(async () => ({
      network: 'PUBLIC',
      networkPassphrase: 'Public Global Stellar Network ; September 2015',
    })),
    signTransaction: vi.fn(async () => ({ signedTxXdr: 'signed-xdr' })),
    signAuthEntry: vi.fn(async () => ({ signedAuthEntry: 'signed-entry' })),
    signMessage: vi.fn(async () => ({ signedMessage: 'signed-message' })),
    onChange: vi.fn((callback: (event: unknown) => void) => {
      changeCallbacks.push(callback)
    }),
    disconnect: vi.fn(async (): Promise<void> => {
      emit('disconnect')
    }),
  }
}

let fakeReal: ReturnType<typeof createFakeReal>

vi.mock('@creit.tech/stellar-wallets-kit', () => ({
  ModuleType: { HOT_WALLET: 'HOT_WALLET' },
}))

vi.mock('@creit.tech/stellar-wallets-kit/modules/metamask', () => ({
  METAMASK_ID: 'metamask',
  MetaMaskModule: vi.fn(function MetaMaskModule() {
    return fakeReal
  }),
}))

const { MetaMaskModule } =
  await import('@creit.tech/stellar-wallets-kit/modules/metamask')
const { MetaMaskStellarModule } = await import('./metaMaskStellarModule.js')

// Each wallet answers `eip6963:requestProvider` with one announcement.
const announceOnRequest = (...rdnsList: string[]) => {
  window.addEventListener('eip6963:requestProvider', () => {
    for (const rdns of rdnsList) {
      window.dispatchEvent(
        new CustomEvent('eip6963:announceProvider', {
          detail: { info: { rdns } },
        })
      )
    }
  })
}

const changeEvent = {
  address: 'GNEW',
  network: 'PUBLIC',
  networkPassphrase: 'Public Global Stellar Network ; September 2015',
}

describe('MetaMaskStellarModule', () => {
  beforeEach(() => {
    globalThis.window = new EventTarget() as Window & typeof globalThis
    fakeReal = createFakeReal()
    vi.mocked(MetaMaskModule).mockClear()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('has the MetaMask identity of the LI.FI wallet menu', () => {
    const module = new MetaMaskStellarModule()

    expect(module.productId).toBe('metamask')
    expect(module.productName).toBe('MetaMask')
    expect(module.productUrl).toBe('https://metamask.io')
    expect(module.productIcon).toBe(
      'https://lifinance.github.io/types/src/assets/icons/wallets/metamask.svg'
    )
    expect(module.moduleType).toBe('HOT_WALLET')
  })

  it('does not create the MetaMask module until a wallet call', async () => {
    const module = new MetaMaskStellarModule()
    announceOnRequest('io.metamask')

    module.onChange(vi.fn())
    module.onSessionEnd(vi.fn())
    await module.isAvailable()
    expect(MetaMaskModule).not.toHaveBeenCalled()

    await module.getAddress()
    await module.getNetwork()
    expect(MetaMaskModule).toHaveBeenCalledTimes(1)
  })

  it('delegates the wallet calls to the MetaMask module', async () => {
    const module = new MetaMaskStellarModule()
    const opts = {
      address: 'GADDRESS',
      networkPassphrase: 'Public Global Stellar Network ; September 2015',
    }

    await expect(
      module.getAddress({ skipRequestAccess: true })
    ).resolves.toEqual({ address: 'GADDRESS' })
    await expect(module.signTransaction('xdr', opts)).resolves.toEqual({
      signedTxXdr: 'signed-xdr',
    })
    await expect(module.signAuthEntry('entry', opts)).resolves.toEqual({
      signedAuthEntry: 'signed-entry',
    })
    await expect(module.signMessage('message', opts)).resolves.toEqual({
      signedMessage: 'signed-message',
    })

    expect(fakeReal.getAddress).toHaveBeenCalledWith({
      skipRequestAccess: true,
    })
    expect(fakeReal.signTransaction).toHaveBeenCalledWith('xdr', opts)
    expect(fakeReal.signAuthEntry).toHaveBeenCalledWith('entry', opts)
    expect(fakeReal.signMessage).toHaveBeenCalledWith('message', opts)
  })

  describe('isAvailable', () => {
    it('returns true for an io.metamask announcement', async () => {
      const module = new MetaMaskStellarModule()
      announceOnRequest('io.metamask')

      await expect(module.isAvailable()).resolves.toBe(true)
    })

    it('returns true when another wallet announces first', async () => {
      const module = new MetaMaskStellarModule()
      announceOnRequest('io.rabby', 'io.metamask')

      await expect(module.isAvailable()).resolves.toBe(true)
    })

    it.each([
      ['no announcement', []],
      ['only io.rabby', ['io.rabby']],
    ])('returns false after 1000 ms with %s', async (_label, rdnsList) => {
      vi.useFakeTimers()
      const module = new MetaMaskStellarModule()
      announceOnRequest(...rdnsList)

      let result: boolean | undefined
      void module.isAvailable().then((available) => {
        result = available
      })

      await vi.advanceTimersByTimeAsync(999)
      expect(result).toBeUndefined()
      await vi.advanceTimersByTimeAsync(1)
      expect(result).toBe(false)
    })

    it('leaves no listener or timer behind when MetaMask answers', async () => {
      vi.useFakeTimers()
      const module = new MetaMaskStellarModule()
      announceOnRequest('io.metamask')
      const removeEventListener = vi.spyOn(window, 'removeEventListener')

      await module.isAvailable()

      expect(removeEventListener).toHaveBeenCalledWith(
        'eip6963:announceProvider',
        expect.any(Function)
      )
      expect(vi.getTimerCount()).toBe(0)
    })

    it('leaves no listener or timer behind after the timeout', async () => {
      vi.useFakeTimers()
      const module = new MetaMaskStellarModule()
      const removeEventListener = vi.spyOn(window, 'removeEventListener')

      const available = module.isAvailable()
      await vi.advanceTimersByTimeAsync(1000)
      await available

      expect(removeEventListener).toHaveBeenCalledWith(
        'eip6963:announceProvider',
        expect.any(Function)
      )
      expect(vi.getTimerCount()).toBe(0)
    })

    it('returns false without a window', async () => {
      const module = new MetaMaskStellarModule()
      // @ts-expect-error - emulating a server render
      delete globalThis.window

      await expect(module.isAvailable()).resolves.toBe(false)
    })
  })

  describe('disconnect', () => {
    it('does not call the session-end listener for its own revoke', async () => {
      const module = new MetaMaskStellarModule()
      const sessionEnd = vi.fn()
      module.onSessionEnd(sessionEnd)
      module.start()

      await module.disconnect()

      expect(fakeReal.disconnect).toHaveBeenCalledTimes(1)
      expect(sessionEnd).not.toHaveBeenCalled()
    })

    it('does not call the session-end listener for its own disconnect without a revoke', async () => {
      const module = new MetaMaskStellarModule()
      const sessionEnd = vi.fn()
      module.onSessionEnd(sessionEnd)
      module.start()
      fakeReal.adapter.emit('disconnect')
      expect(sessionEnd).toHaveBeenCalledTimes(1)

      await module.disconnect()

      expect(fakeReal.adapter.disconnect).toHaveBeenCalledWith({
        revokeSession: false,
      })
      expect(sessionEnd).toHaveBeenCalledTimes(1)
    })

    it('sends no revoke after MetaMask ended the session', async () => {
      const module = new MetaMaskStellarModule()
      const sessionEnd = vi.fn()
      module.onSessionEnd(sessionEnd)
      module.start()

      fakeReal.adapter.emit('disconnect')
      await module.disconnect()

      expect(sessionEnd).toHaveBeenCalledTimes(1)
      expect(fakeReal.disconnect).not.toHaveBeenCalled()
      expect(fakeReal.adapter.disconnect).toHaveBeenCalledWith({
        revokeSession: false,
      })
    })

    it('revokes again after a connect that follows a session end', async () => {
      const module = new MetaMaskStellarModule()
      module.start()

      fakeReal.adapter.emit('disconnect')
      fakeReal.adapter.emit('connect', 'GADDRESS')
      await module.disconnect()

      expect(fakeReal.disconnect).toHaveBeenCalledTimes(1)
      expect(fakeReal.adapter.disconnect).not.toHaveBeenCalled()
    })

    it('does nothing before start', async () => {
      const module = new MetaMaskStellarModule()

      await module.disconnect()

      expect(MetaMaskModule).not.toHaveBeenCalled()
    })

    it('does not let a rejection escape', async () => {
      const module = new MetaMaskStellarModule()
      module.start()
      fakeReal.disconnect.mockRejectedValueOnce(new Error('revoke failed'))

      await expect(module.disconnect()).resolves.toBeUndefined()
      expect(console.warn).toHaveBeenCalledTimes(1)
    })

    it('logs an error that the adapter returns without a revoke', async () => {
      const module = new MetaMaskStellarModule()
      module.start()
      fakeReal.adapter.emit('disconnect')
      fakeReal.adapter.disconnect.mockResolvedValueOnce({
        error: { code: -1, message: 'failed' },
      })

      await expect(module.disconnect()).resolves.toBeUndefined()
      expect(console.warn).toHaveBeenCalledTimes(1)
    })
  })

  describe('onChange', () => {
    it('delivers events after start to a callback registered before start', () => {
      const module = new MetaMaskStellarModule()
      const callback = vi.fn()
      module.onChange(callback)

      module.start()
      for (const forward of fakeReal.changeCallbacks) {
        forward(changeEvent)
      }

      expect(callback).toHaveBeenCalledWith(changeEvent)
    })

    it('replaces the first callback with a second one', () => {
      const module = new MetaMaskStellarModule()
      const first = vi.fn()
      const second = vi.fn()
      module.onChange(first)
      module.start()
      module.onChange(second)

      for (const forward of fakeReal.changeCallbacks) {
        forward(changeEvent)
      }

      expect(fakeReal.onChange).toHaveBeenCalledTimes(1)
      expect(first).not.toHaveBeenCalled()
      expect(second).toHaveBeenCalledTimes(1)
    })
  })

  describe('checkSessionEnded', () => {
    it('returns true when MetaMask answers with no Stellar scope, and the next disconnect sends no revoke', async () => {
      const module = new MetaMaskStellarModule()
      announceOnRequest('io.metamask')
      fakeReal.adapter.isAllowed.mockResolvedValueOnce({ isAllowed: false })

      await expect(module.checkSessionEnded()).resolves.toBe(true)

      await module.disconnect()
      expect(fakeReal.disconnect).not.toHaveBeenCalled()
      expect(fakeReal.adapter.disconnect).toHaveBeenCalledWith({
        revokeSession: false,
      })
    })

    it('returns false when MetaMask does not answer', async () => {
      const module = new MetaMaskStellarModule()
      announceOnRequest('io.metamask')
      fakeReal.adapter.isAllowed.mockResolvedValueOnce({
        isAllowed: false,
        error: { code: -1, message: 'Transport request timed out' },
      })

      await expect(module.checkSessionEnded()).resolves.toBe(false)
    })

    it('returns false while the Stellar scope exists, even before the restore sets an address', async () => {
      const module = new MetaMaskStellarModule()
      announceOnRequest('io.metamask')
      fakeReal.adapter.isAllowed.mockResolvedValueOnce({ isAllowed: true })

      await expect(module.checkSessionEnded()).resolves.toBe(false)
    })

    it('returns false when isAllowed throws', async () => {
      const module = new MetaMaskStellarModule()
      announceOnRequest('io.metamask')
      fakeReal.adapter.isAllowed.mockRejectedValueOnce(new Error('boom'))

      await expect(module.checkSessionEnded()).resolves.toBe(false)
    })

    it('returns false without MetaMask and does not create the module', async () => {
      vi.useFakeTimers()
      const module = new MetaMaskStellarModule()

      const ended = module.checkSessionEnded()
      await vi.advanceTimersByTimeAsync(1000)

      await expect(ended).resolves.toBe(false)
      expect(MetaMaskModule).not.toHaveBeenCalled()
    })
  })
})
