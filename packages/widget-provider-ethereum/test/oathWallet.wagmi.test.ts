import { EventEmitter } from 'node:events'
import { connect, createConfig, disconnect, http } from '@wagmi/core'
import { mainnet } from 'viem/chains'
import { beforeEach, expect, it, vi } from 'vitest'
import { createOathWalletConnector } from '../src/connectors/oathWallet.js'

const state = vi.hoisted(() => ({
  providers: [] as any[],
  dialogs: [] as any[],
}))
vi.mock('@walletconnect/ethereum-provider', () => ({
  EthereumProvider: {
    init: vi.fn(async (options) => {
      let approve: () => void = () => {}
      const address = `0x${(state.providers.length + 1).toString(16).padStart(40, '0')}`
      const provider = Object.assign(new EventEmitter(), {
        events: new EventEmitter(),
        options,
        chainId: 1,
        accounts: [] as string[],
        session: undefined as any,
        connect: vi.fn(
          () =>
            new Promise<void>((resolve) => {
              approve = () => {
                provider.session = {
                  topic: `session-${state.providers.indexOf(provider)}`,
                  namespaces: {
                    eip155: {
                      accounts: [`eip155:1:${address}`],
                      chains: ['eip155:1'],
                    },
                  },
                }
                provider.accounts = [address]
                provider.emit('connect', { chainId: '0x1' })
                resolve()
              }
              provider.emit(
                'display_uri',
                'wc:fixture@2?relay-protocol=irn&symKey=fixture'
              )
            })
        ),
        enable: vi.fn(async () => provider.accounts),
        disconnect: vi.fn(async () => {
          provider.session = undefined
          provider.accounts = []
          provider.emit('disconnect')
        }),
        approve: () => approve(),
        signer: {
          client: {
            disconnect: vi.fn().mockResolvedValue(undefined),
            core: {
              pairing: { disconnect: vi.fn().mockResolvedValue(undefined) },
            },
          },
        },
      })
      state.providers.push(provider)
      return provider
    }),
  },
}))
vi.mock('../src/connectors/oathWalletDialog.js', () => ({
  openOathConnectionDialog: vi.fn(async (_uri, cancel) => {
    const dialog = { cancel, close: vi.fn() }
    state.dialogs.push(dialog)
    return dialog
  }),
}))
beforeEach(() => {
  state.providers.length = 0
  state.dialogs.length = 0
  vi.clearAllMocks()
})

it('updates real Wagmi account state on approval and clears it on disconnect', async () => {
  const config = createConfig({
    chains: [mainnet],
    storage: null,
    transports: { [mainnet.id]: http() },
    connectors: [createOathWalletConnector({ projectId: 'fixture' })],
  })
  const oath = config.connectors.find(
    (connector) => connector.id === 'oath-wallet'
  )!
  const pending = connect(config, { connector: oath, chainId: 1 })
  await vi.waitFor(() => expect(state.dialogs).toHaveLength(1))
  const provider = (await oath.getProvider()) as any
  provider.approve()
  await pending
  expect(config.state.connections.get(oath.uid)?.accounts).toEqual([
    '0x0000000000000000000000000000000000000001',
  ])
  expect(config.state.current).toBe(oath.uid)
  await disconnect(config, { connector: oath })
  expect(config.state.connections.size).toBe(0)
})

it('filters late provider connect events through real Wagmi after cancellation', async () => {
  const config = createConfig({
    chains: [mainnet],
    storage: null,
    transports: { [mainnet.id]: http() },
    connectors: [createOathWalletConnector({ projectId: 'fixture' })],
  })
  const oath = config.connectors[0]
  const first = connect(config, { connector: oath }).catch((error) => error)
  await vi.waitFor(() => expect(state.dialogs).toHaveLength(1))
  const old = (await oath.getProvider()) as any
  state.dialogs[0].cancel()
  expect((await first).code).toBe(4001)
  const next = connect(config, { connector: oath })
  await vi.waitFor(() => expect(state.dialogs).toHaveLength(2))
  old.approve()
  await vi.waitFor(() =>
    expect(old.signer.client.disconnect).toHaveBeenCalled()
  )
  expect(config.state.connections.size).toBe(0)
  expect(state.dialogs[1].close).not.toHaveBeenCalled()
  const current = (await oath.getProvider()) as any
  current.approve()
  await next
  expect(config.state.current).toBe(oath.uid)
  await disconnect(config, { connector: oath })
})

it('does not replace the new approved accounts when an old approval arrives later', async () => {
  const config = createConfig({
    chains: [mainnet],
    storage: null,
    transports: { [mainnet.id]: http() },
    connectors: [createOathWalletConnector({ projectId: 'fixture' })],
  })
  const oath = config.connectors[0]
  const first = connect(config, { connector: oath }).catch((error) => error)
  await vi.waitFor(() => expect(state.dialogs).toHaveLength(1))
  const old = (await oath.getProvider()) as any
  state.dialogs[0].cancel()
  await first
  const second = connect(config, { connector: oath })
  await vi.waitFor(() => expect(state.dialogs).toHaveLength(2))
  const current = (await oath.getProvider()) as any
  current.approve()
  await second
  expect(config.state.connections.get(oath.uid)?.accounts).toEqual([
    '0x0000000000000000000000000000000000000002',
  ])
  old.approve()
  await vi.waitFor(() =>
    expect(old.signer.client.disconnect).toHaveBeenCalled()
  )
  expect(config.state.connections.get(oath.uid)?.accounts).toEqual([
    '0x0000000000000000000000000000000000000002',
  ])
  expect(current.signer.client.disconnect).not.toHaveBeenCalled()
  await disconnect(config, { connector: oath })
})
