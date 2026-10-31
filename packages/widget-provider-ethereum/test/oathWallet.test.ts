import { EventEmitter } from 'node:events'
import { mainnet } from 'viem/chains'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { CreateConnectorFn } from 'wagmi'

const fixtures = vi.hoisted(() => ({
  attempts: [] as any[],
  dialogs: [] as any[],
}))
vi.mock('wagmi/connectors', () => ({
  walletConnect: vi.fn((parameters) => (config) => {
    let resolve: (value: unknown) => void = () => {}
    let reject: (error: Error) => void = () => {}
    const pending = new Promise((yes, no) => {
      resolve = yes
      reject = no
    })
    const provider = Object.assign(new EventEmitter(), {
      session: undefined as { topic: string } | undefined,
      signer: {
        client: {
          disconnect: vi.fn().mockResolvedValue(undefined),
          core: {
            pairing: { disconnect: vi.fn().mockResolvedValue(undefined) },
          },
        },
      },
    })
    const base = {
      id: 'walletConnect',
      name: 'WalletConnect',
      type: 'walletConnect',
      getProvider: vi.fn().mockResolvedValue(provider),
      setRequestedChainsIds: vi.fn(),
      setup: vi.fn(),
      isAuthorized: vi.fn().mockResolvedValue(false),
      getAccounts: vi
        .fn()
        .mockResolvedValue(['0x0000000000000000000000000000000000000001']),
      getChainId: vi.fn().mockResolvedValue(1),
      switchChain: vi.fn().mockResolvedValue(mainnet),
      onAccountsChanged: vi.fn(),
      onChainChanged: vi.fn(),
      onDisconnect: vi.fn(),
      disconnect: vi.fn().mockResolvedValue(undefined),
      connect: vi.fn(() => pending),
    }
    fixtures.attempts.push({
      parameters,
      config,
      provider,
      base,
      resolve,
      reject,
    })
    return base
  }),
}))
vi.mock('../src/connectors/oathWalletDialog.js', () => ({
  openOathConnectionDialog: vi.fn(async (uri, cancel, signal) => {
    const dialog = { close: vi.fn(), cancel, uri, signal }
    fixtures.dialogs.push(dialog)
    return dialog
  }),
}))

import { createOathWalletConnector } from '../src/connectors/oathWallet.js'

const uri = 'wc:test-pairing@2?relay-protocol=irn&symKey=test-only'
const result = {
  accounts: ['0x0000000000000000000000000000000000000001'],
  chainId: 1,
}
const setup = async () => {
  const emit = vi.fn()
  const factory = createOathWalletConnector({ projectId: 'test-project' })
  const connector = factory({
    chains: [mainnet],
    emitter: { emit },
  } as unknown as Parameters<CreateConnectorFn>[0])
  await connector.setup?.()
  return { connector, factory, emit }
}
const showQR = async (attempt = 0) => {
  await vi.waitFor(() =>
    expect(fixtures.attempts[attempt].base.connect).toHaveBeenCalled()
  )
  fixtures.attempts[attempt].provider.emit('display_uri', uri)
  await vi.waitFor(() => expect(fixtures.dialogs.length).toBe(attempt + 1))
}

beforeEach(() => {
  fixtures.attempts.length = 0
  fixtures.dialogs.length = 0
  vi.clearAllMocks()
})
describe('Oath direct WalletConnect connector', () => {
  it('uses native selector metadata and an isolated provider without the generic modal', async () => {
    const { connector, factory } = await setup()
    expect(factory.id).toBe('oath-wallet')
    expect(factory.displayName).toBe('Oath Wallet')
    expect(factory.icon).toMatch(/^data:image\/svg\+xml/)
    expect(connector.id).toBe(factory.id)
    expect(fixtures.attempts[0].parameters).toMatchObject({
      showQrModal: false,
      customStoragePrefix: 'evm-oath-wallet',
    })
  })
  it('closes the QR after approval and forwards the supported chain/accounts', async () => {
    const { connector } = await setup()
    const pending = connector.connect({ chainId: 1 })
    await showQR()
    fixtures.attempts[0].resolve(result)
    await expect(pending).resolves.toEqual(result)
    expect(fixtures.dialogs[0].close).toHaveBeenCalled()
    expect(fixtures.attempts[0].provider.listenerCount('display_uri')).toBe(0)
  })
  it('cancels promptly, disconnects only its pairing, and permits a fresh retry', async () => {
    const { connector } = await setup()
    const first = connector.connect().catch((error) => error)
    await showQR()
    fixtures.dialogs[0].cancel()
    expect((await first).code).toBe(4001)
    expect(
      fixtures.attempts[0].provider.signer.client.core.pairing.disconnect
    ).toHaveBeenCalledWith({ topic: 'test-pairing' })
    const second = connector.connect()
    await showQR(1)
    fixtures.attempts[1].resolve(result)
    await expect(second).resolves.toEqual(result)
  })
  it('a late cancelled approval cannot connect, close the retry QR, or disconnect the retry session', async () => {
    const { connector, emit } = await setup()
    const first = connector.connect().catch((error) => error)
    await showQR()
    fixtures.dialogs[0].cancel()
    await first
    const second = connector.connect()
    await showQR(1)
    fixtures.attempts[0].provider.session = { topic: 'late-old-session' }
    fixtures.attempts[0].config.emitter.emit('connect', result)
    fixtures.attempts[0].resolve(result)
    await vi.waitFor(() =>
      expect(
        fixtures.attempts[0].provider.signer.client.disconnect
      ).toHaveBeenCalledWith({
        topic: 'late-old-session',
        reason: expect.any(Object),
      })
    )
    expect(emit).not.toHaveBeenCalled()
    expect(
      fixtures.attempts[1].provider.signer.client.disconnect
    ).not.toHaveBeenCalled()
    expect(fixtures.dialogs[1].close).not.toHaveBeenCalled()
    fixtures.attempts[1].config.emitter.emit('connect', result)
    expect(emit).toHaveBeenCalledWith('connect', result)
    fixtures.attempts[1].resolve(result)
    await second
  })
  it('a late rejected attempt does not close a retry dialog', async () => {
    const { connector } = await setup()
    const first = connector.connect().catch((error) => error)
    await showQR()
    fixtures.dialogs[0].cancel()
    await first
    const second = connector.connect()
    await showQR(1)
    fixtures.attempts[0].reject(new Error('old proposal expired'))
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(fixtures.dialogs[1].close).not.toHaveBeenCalled()
    fixtures.attempts[1].resolve(result)
    await second
  })
  it('does not delete a restored session on cancellation', async () => {
    const { connector } = await setup()
    fixtures.attempts[0].provider.session = { topic: 'restored' }
    const pending = connector.connect().catch((error) => error)
    await showQR()
    fixtures.dialogs[0].cancel()
    await pending
    expect(
      fixtures.attempts[0].provider.signer.client.disconnect
    ).not.toHaveBeenCalled()
    fixtures.attempts[0].reject(new Error('cancelled'))
  })
  it('rejects concurrent connection attempts instead of opening duplicate dialogs', async () => {
    const { connector } = await setup()
    const first = connector.connect()
    await expect(connector.connect()).rejects.toThrow('already pending')
    fixtures.attempts[0].resolve(result)
    await first
  })
  it('cleans up UI and listeners when the wallet rejects', async () => {
    const { connector } = await setup()
    const pending = connector.connect().catch((error) => error)
    await showQR()
    fixtures.attempts[0].reject(new Error('Wallet rejected'))
    expect((await pending).message).toBe('Wallet rejected')
    expect(fixtures.dialogs[0].close).toHaveBeenCalled()
    expect(fixtures.attempts[0].provider.listenerCount('display_uri')).toBe(0)
  })
  it('releases the connection lock when provider initialization fails', async () => {
    const { connector } = await setup()
    fixtures.attempts[0].base.getProvider.mockRejectedValueOnce(
      new Error('Provider unavailable')
    )
    await expect(connector.connect()).rejects.toThrow('Provider unavailable')
    const pending = connector.connect()
    fixtures.attempts[0].resolve(result)
    await expect(pending).resolves.toEqual(result)
  })
  it('cancels while provider initialization is pending and never starts the abandoned proposal', async () => {
    const { connector } = await setup()
    const old = fixtures.attempts[0]
    let initialize: (value: unknown) => void = () => {}
    old.base.getProvider.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          initialize = resolve
        })
    )
    const first = connector.connect().catch((error) => error)
    await vi.waitFor(() => expect(old.base.getProvider).toHaveBeenCalled())
    await connector.disconnect()
    expect((await first).code).toBe(4001)
    const retry = connector.connect()
    await vi.waitFor(() =>
      expect(fixtures.attempts[1].base.connect).toHaveBeenCalled()
    )
    fixtures.attempts[1].resolve(result)
    await expect(retry).resolves.toEqual(result)
    initialize(old.provider)
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(old.base.connect).not.toHaveBeenCalled()
    expect(old.provider.listenerCount('display_uri')).toBe(0)
    expect(fixtures.dialogs).toHaveLength(0)
  })
  it('retains normal EVM chain switching and disconnect behavior after connection', async () => {
    const { connector } = await setup()
    await expect(connector.switchChain!({ chainId: 1 })).resolves.toEqual(
      mainnet
    )
    await connector.disconnect()
    expect(fixtures.attempts[0].base.disconnect).toHaveBeenCalledOnce()
  })
})
