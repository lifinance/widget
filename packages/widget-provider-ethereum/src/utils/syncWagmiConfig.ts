import type { Chain } from 'viem'
import { mainnet } from 'viem/chains'
import type { Config, CreateConnectorFn } from 'wagmi'
import { reconnect } from 'wagmi/actions'

type ConnectorEmitter = Parameters<CreateConnectorFn>[0]['emitter']

const lastSync = new WeakMap<
  Config,
  { chainsKey: string; connectors: CreateConnectorFn[] }
>()

// Only the chain fields that wagmi and the connectors read. LI.FI chain data
// also carries token prices, which change on every refetch.
const getChainsKey = (chains: readonly Chain[]): string =>
  JSON.stringify(
    chains.map((chain) => [
      chain.id,
      chain.name,
      chain.nativeCurrency,
      chain.rpcUrls.default?.http,
      Object.values(chain.blockExplorers ?? {}).map((explorer) => explorer.url),
      chain.contracts?.multicall3?.address,
    ])
  )

const latestEmitterConnectors = new WeakMap<
  CreateConnectorFn,
  CreateConnectorFn
>()

// Connector SDKs (MetaMask Connect, WalletConnect, Coinbase) bind their event
// handlers to the first connector object; `setup` gives each a new emitter.
const withLatestEmitter = (
  connectorFn: CreateConnectorFn
): CreateConnectorFn => {
  const cached = latestEmitterConnectors.get(connectorFn)
  if (cached) {
    return cached
  }
  let latestEmitter: ConnectorEmitter | undefined
  const emitter = new Proxy({} as ConnectorEmitter, {
    get: (_, key) => {
      const value = Reflect.get(latestEmitter!, key)
      return typeof value === 'function' ? value.bind(latestEmitter) : value
    },
  })
  const wrapped: CreateConnectorFn = (config) => {
    latestEmitter = config.emitter
    // A proxy, not a spread: `config.providers` is a getter.
    return connectorFn(
      new Proxy(config, {
        get: (target, key) =>
          key === 'emitter' ? emitter : Reflect.get(target, key),
      })
    )
  }
  Object.assign(wrapped, connectorFn)
  latestEmitterConnectors.set(connectorFn, wrapped)
  return wrapped
}

export const syncWagmiConfig = async (
  wagmiConfig: Config,
  connectors: CreateConnectorFn[],
  chains: readonly [Chain, ...Chain[]]
): Promise<void> => {
  const chainsKey = getChainsKey(chains)
  const previous = lastSync.get(wagmiConfig)
  if (previous?.chainsKey === chainsKey && previous.connectors === connectors) {
    return
  }
  lastSync.set(wagmiConfig, { chainsKey, connectors })

  const _mainnet = chains.find((chain) => chain.id === mainnet.id)
  if (_mainnet) {
    _mainnet.contracts = { ...mainnet.contracts, ..._mainnet.contracts }
  }

  wagmiConfig._internal.chains.setState(chains)
  wagmiConfig._internal.connectors.setState(() =>
    [
      ...connectors.map(withLatestEmitter),
      ...(wagmiConfig._internal.mipd
        ?.getProviders()
        .map(wagmiConfig._internal.connectors.providerDetailToConnector) ?? []),
    ].map(wagmiConfig._internal.connectors.setup)
  )
  reconnect(wagmiConfig)
}
