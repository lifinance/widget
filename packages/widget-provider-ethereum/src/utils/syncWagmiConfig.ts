import type { Chain } from 'viem'
import { mainnet } from 'viem/chains'
import type { Config, CreateConnectorFn } from 'wagmi'
import { reconnect } from 'wagmi/actions'

type ConnectorEmitter = Parameters<CreateConnectorFn>[0]['emitter']

const lastSync = new WeakMap<
  Config,
  { chainsKey: string; connectors: CreateConnectorFn[] }
>()

// The viem chain fields only: LI.FI chain data adds token prices that change.
const getChainsKey = (chains: readonly Chain[]): string =>
  JSON.stringify(
    chains.map((chain) => [
      chain.id,
      chain.name,
      chain.nativeCurrency,
      chain.rpcUrls,
      chain.blockExplorers,
      chain.contracts,
      chain.testnet,
    ])
  )

const isSameConnectors = (
  previous: CreateConnectorFn[],
  connectors: CreateConnectorFn[]
): boolean =>
  previous.length === connectors.length &&
  previous.every((connectorFn, index) => connectorFn === connectors[index])

const latestEmitterConnectors = new WeakMap<
  Config,
  WeakMap<CreateConnectorFn, CreateConnectorFn>
>()

// Connector SDKs bind their event handlers to the first connector object only.
const withLatestEmitter = (
  wagmiConfig: Config,
  connectorFn: CreateConnectorFn
): CreateConnectorFn => {
  let cache = latestEmitterConnectors.get(wagmiConfig)
  if (!cache) {
    cache = new WeakMap()
    latestEmitterConnectors.set(wagmiConfig, cache)
  }
  const cached = cache.get(connectorFn)
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
  cache.set(connectorFn, wrapped)
  return wrapped
}

export const syncWagmiConfig = async (
  wagmiConfig: Config,
  connectors: CreateConnectorFn[],
  chains: readonly [Chain, ...Chain[]]
): Promise<void> => {
  const _mainnet = chains.find((chain) => chain.id === mainnet.id)
  if (_mainnet) {
    _mainnet.contracts = { ...mainnet.contracts, ..._mainnet.contracts }
  }

  const chainsKey = getChainsKey(chains)
  const previous = lastSync.get(wagmiConfig)
  if (
    previous?.chainsKey === chainsKey &&
    isSameConnectors(previous.connectors, connectors)
  ) {
    return
  }

  wagmiConfig._internal.chains.setState(chains)
  wagmiConfig._internal.connectors.setState(() =>
    [
      ...connectors.map((connectorFn) =>
        withLatestEmitter(wagmiConfig, connectorFn)
      ),
      ...(wagmiConfig._internal.mipd
        ?.getProviders()
        .map(wagmiConfig._internal.connectors.providerDetailToConnector) ?? []),
    ].map(wagmiConfig._internal.connectors.setup)
  )
  lastSync.set(wagmiConfig, { chainsKey, connectors: [...connectors] })
  reconnect(wagmiConfig)
}
