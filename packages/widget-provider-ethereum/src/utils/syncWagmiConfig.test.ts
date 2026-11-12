import type { Chain } from 'viem'
import { describe, expect, it, vi } from 'vitest'
import { type Config, createConfig, createConnector } from 'wagmi'
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
        createChain(8453),
        createChain(42161),
      ],
    },
    {
      change: 'a WebSocket RPC URL',
      chains: [
        createChain(1, {
          rpcUrls: {
            default: {
              http: ['https://rpc.example/1'],
              webSocket: ['wss://rpc.example/1'],
            },
          },
        }),
        ...createChains('3000').slice(1),
      ],
    },
    {
      change: 'a chain name',
      chains: [
        createChain(1, { name: 'Renamed' }),
        ...createChains('3000').slice(1),
      ],
    },
    {
      change: 'a block explorer',
      chains: [
        createChain(1, {
          blockExplorers: {
            default: { name: 'Explorer', url: 'https://scan.example/new' },
          },
        }),
        ...createChains('3000').slice(1),
      ],
    },
    {
      change: 'the multicall address',
      chains: [
        createChain(1, {
          contracts: {
            multicall3: {
              address: '0x0000000000000000000000000000000000000002',
            },
          },
        }),
        ...createChains('3000').slice(1),
      ],
    },
  ])('sets up connectors again for $change', async ({ chains }) => {
    const { config, connectors, setups } = await setUp()

    await resync(config, connectors, chains as [Chain, ...Chain[]])

    expect(setups).toHaveBeenCalledTimes(2)
  })

  it('sets up connectors again for another connector function', async () => {
    const { config, connectors, setups } = await setUp()

    await resync(
      config,
      [...connectors, createClosureConnector().connectorFn],
      createChains('3000')
    )

    expect(setups).toHaveBeenCalledTimes(2)
  })

  it('does not set up connectors again for a new array with the same functions', async () => {
    const { config, connectors, setups } = await setUp()

    await syncWagmiConfig(config, [...connectors], createChains('3000'))

    expect(setups).toHaveBeenCalledTimes(1)
  })

  it('does not set up connectors again for the same mainnet chains array', async () => {
    const config = createTestConfig()
    const { connectorFn, setups } = createClosureConnector()
    const chains = createChains('3000')

    await resync(config, [connectorFn], chains)
    await syncWagmiConfig(config, [connectorFn], chains)

    expect(setups).toHaveBeenCalledTimes(1)
  })

  it('tries the sync again after a failed setup', async () => {
    const config = createTestConfig()
    const { connectorFn } = createClosureConnector()
    let fail = true
    const flakyConnectorFn: typeof connectorFn = (connectorConfig) => {
      if (fail) {
        fail = false
        throw new Error('Setup failed.')
      }
      return connectorFn(connectorConfig)
    }

    const connectors = [flakyConnectorFn]

    await expect(
      syncWagmiConfig(config, connectors, createChains('3000'))
    ).rejects.toThrow('Setup failed.')
    await resync(config, connectors, createChains('3000'))

    expect(config.state.status).toBe('connected')
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

  it('keeps chain events after connectors are set up again', async () => {
    const { config, connectors, switchInWallet } = await setUp()

    await resync(config, connectors, [...createChains('3000'), createChain(10)])
    await switchChain(config, { chainId: 10 })
    expect(config.state.chainId).toBe(10)

    switchInWallet(8453)
    expect(config.state.chainId).toBe(8453)
    await expect(getConnectorClient(config)).resolves.toBeDefined()
  })

  it('keeps setup events after connectors are set up again', async () => {
    const { config, connectors, disconnectInWallet } = await setUp()

    await resync(config, connectors, [...createChains('3000'), createChain(10)])
    disconnectInWallet()

    expect(config.state.status).toBe('disconnected')
  })

  it('keeps the properties of the connector function', async () => {
    const { config } = await setUp()

    expect(config.connectors[0]).toMatchObject({
      id: 'closureConnector',
      name: 'Closure Connector',
    })
  })
})
