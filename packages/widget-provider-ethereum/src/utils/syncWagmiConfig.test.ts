import type { Chain } from 'viem'
import { describe, expect, it, vi } from 'vitest'
import {
  type Config,
  type CreateConnectorFn,
  createConfig,
  createConnector,
} from 'wagmi'
import { getConnectorClient, switchChain } from 'wagmi/actions'
import { syncWagmiConfig } from './syncWagmiConfig.js'

type Instance = {
  request: () => Promise<null>
  chainId: number
  accounts: readonly `0x${string}`[]
  onChainChanged?: (chainId: string) => void
}

// Like `metaMask()` and `walletConnect()`: one SDK instance per connector
// function, with its event handler bound to the first connector object.
const createClosureConnector = () => {
  let instance: Instance | undefined
  // Like the `session_delete` handler that `walletConnect()` binds in `setup`.
  let onWalletDisconnect: (() => void) | undefined
  const setups = vi.fn()
  const connectorFn = createConnector((config) => {
    setups()
    const getInstance = async (onChainChanged: (chainId: string) => void) => {
      instance ??= {
        request: async () => null,
        chainId: 1,
        accounts: ['0x0000000000000000000000000000000000000001'],
        onChainChanged,
      }
      return instance
    }
    return {
      id: 'closureConnector',
      name: 'Closure Connector',
      type: 'closureConnector',
      async setup() {
        onWalletDisconnect ??= this.onDisconnect.bind(this)
      },
      async connect() {
        const { accounts, chainId } = await getInstance(
          this.onChainChanged.bind(this)
        )
        return { accounts, chainId } as never
      },
      async disconnect() {},
      async getAccounts() {
        return (await getInstance(this.onChainChanged.bind(this))).accounts
      },
      async getChainId() {
        return (await getInstance(this.onChainChanged.bind(this))).chainId
      },
      async getProvider() {
        return getInstance(this.onChainChanged.bind(this))
      },
      async isAuthorized() {
        return true
      },
      async switchChain({ chainId }) {
        const chain = config.chains.find((chain) => chain.id === chainId)
        if (!chain) {
          throw new Error(`Chain ${chainId} is not configured.`)
        }
        const current = await getInstance(this.onChainChanged.bind(this))
        current.chainId = chainId
        current.onChainChanged?.(`0x${chainId.toString(16)}`)
        return chain
      },
      onAccountsChanged() {},
      onChainChanged(chainId) {
        config.emitter.emit('change', { chainId: Number(chainId) })
      },
      onDisconnect() {
        config.emitter.emit('disconnect')
      },
    }
  })
  const switchInWallet = (chainId: number) => {
    instance!.chainId = chainId
    instance!.onChainChanged?.(`0x${chainId.toString(16)}`)
  }
  const disconnectInWallet = () => onWalletDisconnect?.()
  return { connectorFn, setups, switchInWallet, disconnectInWallet }
}

const createChain = (
  id: number,
  overrides: Partial<Chain> & { priceUSD?: string } = {}
): Chain =>
  ({
    id,
    name: `Chain ${id}`,
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: [`https://rpc.example/${id}`] } },
    blockExplorers: {
      default: { name: 'Explorer', url: `https://scan.example/${id}` },
    },
    contracts: {},
    nativeToken: { priceUSD: overrides.priceUSD ?? '3000' },
    ...overrides,
  }) as Chain

const createChains = (priceUSD: string): [Chain, ...Chain[]] => [
  createChain(1, { priceUSD }),
  createChain(8453, { priceUSD }),
  createChain(42161, { priceUSD }),
]

const createTestConfig = (): Config =>
  createConfig({
    chains: [createChain(1)],
    client: () => ({}) as never,
    storage: null,
    multiInjectedProviderDiscovery: false,
  })

const setUp = async () => {
  const config = createTestConfig()
  const connector = createClosureConnector()
  const connectors = [connector.connectorFn]
  await syncWagmiConfig(config, connectors, createChains('3000'))
  await vi.waitFor(() => expect(config.state.status).toBe('connected'))
  return { config, connectors, ...connector }
}

const resync = async (
  config: Config,
  connectors: Parameters<typeof syncWagmiConfig>[1],
  chains: [Chain, ...Chain[]]
) => {
  await syncWagmiConfig(config, connectors, chains)
  await vi.waitFor(() => expect(config.state.status).toBe('connected'))
}

describe('syncWagmiConfig', () => {
  it('does not set up connectors again when only chain prices change', async () => {
    const { config, connectors, setups } = await setUp()
    const reconnects = vi.fn()
    config.subscribe((state) => state.status, reconnects)

    await syncWagmiConfig(config, connectors, createChains('3001'))

    expect(setups).toHaveBeenCalledTimes(1)
    expect(reconnects).not.toHaveBeenCalled()
  })

  it('keeps wagmi on the wallet chain after a price-only refetch', async () => {
    const { config, connectors, switchInWallet } = await setUp()

    await resync(config, connectors, createChains('3001'))
    await switchChain(config, { chainId: 8453 })
    expect(config.state.chainId).toBe(8453)

    switchInWallet(42161)
    expect(config.state.chainId).toBe(42161)
    await expect(getConnectorClient(config)).resolves.toBeDefined()
  })

  it.each([
    {
      change: 'a new chain',
      chains: [...createChains('3000'), createChain(10)],
    },
    {
      change: 'the chain order',
      chains: createChains('3000').reverse(),
    },
    {
      change: 'an RPC URL',
      chains: [
        createChain(1, {
          rpcUrls: { default: { http: ['https://rpc.example/new'] } },
        }),
        ...createChains('3000').slice(1),
      ],
    },
  ])(
    'updates the chains without a new setup for $change',
    async ({ chains }) => {
      const { config, connectors, setups } = await setUp()
      const reconnects = vi.fn()
      config.subscribe((state) => state.status, reconnects)

      await syncWagmiConfig(config, connectors, chains as [Chain, ...Chain[]])

      expect(config.chains).toBe(chains)
      expect(setups).toHaveBeenCalledTimes(1)
      expect(reconnects).not.toHaveBeenCalled()
    }
  )

  it('switches to a chain that is added after setup', async () => {
    const { config, connectors, switchInWallet } = await setUp()

    await syncWagmiConfig(config, connectors, [
      ...createChains('3001'),
      createChain(10),
    ])
    await switchChain(config, { chainId: 10 })
    expect(config.state.chainId).toBe(10)

    switchInWallet(8453)
    expect(config.state.chainId).toBe(8453)
    await expect(getConnectorClient(config)).resolves.toBeDefined()
  })

  it('keeps the EIP-6963 wallet connector and gives it the live chain list', async () => {
    const config = createTestConfig()
    const wallet = createClosureConnector()
    const internal = config._internal as unknown as {
      mipd: { getProviders: () => unknown[]; subscribe: () => () => void }
      connectors: { providerDetailToConnector: () => CreateConnectorFn }
    }
    internal.mipd = {
      getProviders: () => [{ info: { uuid: 'wallet', rdns: 'io.example' } }],
      subscribe: () => () => {},
    }
    internal.connectors.providerDetailToConnector = () => wallet.connectorFn

    await resync(config, [], createChains('3000'))
    const [injected] = config.connectors
    await syncWagmiConfig(
      config,
      [],
      [...createChains('3001'), createChain(10)]
    )
    await switchChain(config, { chainId: 10 })

    expect(config.connectors).toEqual([injected])
    expect(config.state.chainId).toBe(10)
  })

  it('sets up only a new connector function and keeps the old connector', async () => {
    const { config, connectors, setups, switchInWallet, disconnectInWallet } =
      await setUp()
    const [connector] = config.connectors
    const added = createClosureConnector()

    await resync(
      config,
      [...connectors, added.connectorFn],
      createChains('3000')
    )

    expect(setups).toHaveBeenCalledTimes(1)
    expect(added.setups).toHaveBeenCalledTimes(1)
    expect(config.connectors[0]).toBe(connector)
    expect(config.state.current).toBe(connector.uid)

    switchInWallet(8453)
    expect(config.state.chainId).toBe(8453)
    disconnectInWallet()
    expect(config.state.connections.has(connector.uid)).toBe(false)
  })

  it('does not set up connectors again for a new array with the same functions', async () => {
    const { config, connectors, setups } = await setUp()

    await syncWagmiConfig(config, [...connectors], createChains('3000'))

    expect(setups).toHaveBeenCalledTimes(1)
  })

  it('syncs the chains and reconnects on the first call with no connectors', async () => {
    const config = createTestConfig()
    const statuses = vi.fn()
    config.subscribe((state) => state.status, statuses)

    await syncWagmiConfig(config, [], createChains('3000'))
    await vi.waitFor(() => expect(config.state.status).toBe('disconnected'))
    expect(statuses).toHaveBeenCalled()

    statuses.mockClear()
    const chains = createChains('3001')
    await syncWagmiConfig(config, [], chains)

    expect(config.chains).toBe(chains)
    expect(statuses).not.toHaveBeenCalled()
  })

  it('does not set up a connector again after a later connector fails', async () => {
    const config = createTestConfig()
    const { connectorFn, setups } = createClosureConnector()
    const flaky = createClosureConnector()
    let fail = true
    const flakyConnectorFn: typeof connectorFn = (connectorConfig) => {
      if (fail) {
        fail = false
        throw new Error('Setup failed.')
      }
      return flaky.connectorFn(connectorConfig)
    }
    const connectors = [connectorFn, flakyConnectorFn]

    await expect(
      syncWagmiConfig(config, connectors, createChains('3000'))
    ).rejects.toThrow('Setup failed.')
    await resync(config, connectors, createChains('3000'))

    expect(setups).toHaveBeenCalledTimes(1)
    expect(flaky.setups).toHaveBeenCalledTimes(1)
  })

  it('sends the events of a shared connector function to its own config', async () => {
    const { connectorFn, switchInWallet } = createClosureConnector()
    const first = createTestConfig()
    const second = createTestConfig()

    await resync(first, [connectorFn], createChains('3000'))
    await resync(second, [connectorFn], createChains('3000'))
    switchInWallet(8453)

    expect(first.state.chainId).toBe(8453)
  })

  it('keeps one change listener over many price-only refetches', async () => {
    const { config, connectors } = await setUp()

    for (const priceUSD of ['3001', '3002', '3003']) {
      await syncWagmiConfig(config, connectors, createChains(priceUSD))
    }
    await new Promise((resolve) => setTimeout(resolve, 20))

    expect(config.connectors[0].emitter.listenerCount('change')).toBe(1)
  })

  it('reconnects when wagmi Hydrate cleared the connections', async () => {
    const { config, connectors } = await setUp()
    const [connector] = config.connectors

    for (const priceUSD of ['3001', '3002', '3003']) {
      config.setState((state) => ({ ...state, connections: new Map() }))
      await syncWagmiConfig(config, connectors, createChains(priceUSD))
      await vi.waitFor(() => expect(config.state.connections.size).toBe(1))
    }
    await new Promise((resolve) => setTimeout(resolve, 20))

    expect(connector.emitter.listenerCount('change')).toBe(1)
    expect(connector.emitter.listenerCount('disconnect')).toBe(1)
  })

  it('reconnects a connector that is added while a reconnect runs', async () => {
    const config = createTestConfig()
    let release!: () => void
    const gate = new Promise<void>((resolve) => {
      release = resolve
    })
    const slowConnectorFn = createConnector(() => ({
      id: 'slow',
      name: 'Slow',
      type: 'slow',
      async connect() {
        throw new Error('Not authorized.')
      },
      async disconnect() {},
      async getAccounts() {
        return []
      },
      async getChainId() {
        return 1
      },
      async getProvider() {
        await gate
        return {}
      },
      async isAuthorized() {
        return false
      },
      onAccountsChanged() {},
      onChainChanged() {},
      onDisconnect() {},
    }))
    const added = createClosureConnector()

    await syncWagmiConfig(config, [slowConnectorFn], createChains('3000'))
    await syncWagmiConfig(
      config,
      [added.connectorFn, slowConnectorFn],
      createChains('3000')
    )
    release()

    await vi.waitFor(() => expect(config.state.status).toBe('connected'))
    expect(config.state.current).toBe(config.connectors[0].uid)
  })

  it('replaces an EIP-6963 connector that wagmi set up itself', async () => {
    const config = createTestConfig()
    const wallet = createClosureConnector()
    const providers: unknown[] = []
    const internal = config._internal as unknown as {
      mipd: { getProviders: () => unknown[]; subscribe: () => () => void }
      connectors: { providerDetailToConnector: () => CreateConnectorFn }
    }
    internal.mipd = { getProviders: () => providers, subscribe: () => () => {} }
    internal.connectors.providerDetailToConnector = () => wallet.connectorFn
    const { connectorFn } = createClosureConnector()
    await resync(config, [connectorFn], createChains('3000'))

    // Like wagmi's own handler for a wallet that announces itself late.
    providers.push({ info: { uuid: 'late', rdns: 'io.example' } })
    config._internal.connectors.setState((connectors) => [
      ...connectors,
      config._internal.connectors.setup(wallet.connectorFn),
    ])
    await resync(
      config,
      [connectorFn],
      [...createChains('3001'), createChain(10)]
    )
    const injected = config.connectors[1]
    await switchChain(config, { chainId: 10, connector: injected })

    expect(config.connectors).toHaveLength(2)
    expect(config.state.connections.get(injected.uid)?.chainId).toBe(10)
  })

  it('gives the emitter to a connector that spreads its parameters', async () => {
    const config = createTestConfig()
    const { connectorFn, switchInWallet } = createClosureConnector()
    const spreadingConnectorFn: CreateConnectorFn = (parameters) =>
      connectorFn({ ...parameters })

    await resync(config, [spreadingConnectorFn], createChains('3000'))
    switchInWallet(8453)

    expect(config.state.chainId).toBe(8453)
  })

  it('keeps the properties of the connector function', async () => {
    const { config } = await setUp()

    expect(config.connectors[0]).toMatchObject({
      id: 'closureConnector',
      name: 'Closure Connector',
    })
  })
})
