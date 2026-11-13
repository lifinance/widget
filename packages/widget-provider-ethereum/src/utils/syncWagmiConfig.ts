import type { Chain } from 'viem'
import { mainnet } from 'viem/chains'
import type { Config, Connector, CreateConnectorFn } from 'wagmi'
import { reconnect } from 'wagmi/actions'

type ConnectorCache<Key> = {
  get(key: Key): Connector | undefined
  set(key: Key, connector: Connector): unknown
}

type SyncState = {
  // Connector SDKs bind their event handlers to the first connector object
  // only, so each connector function and EIP-6963 wallet gets one object.
  connectors: WeakMap<CreateConnectorFn, Connector>
  injectedConnectors: Map<string, Connector>
  reconnect: Promise<unknown>
}

const syncStates = new WeakMap<Config, SyncState>()

// wagmi gives each connector a copy of the chain list, so it gets the live list.
const withLiveChains =
  (wagmiConfig: Config, connectorFn: CreateConnectorFn): CreateConnectorFn =>
  (parameters) =>
    connectorFn(
      Object.defineProperties(
        {},
        {
          ...Object.getOwnPropertyDescriptors(parameters),
          chains: { enumerable: true, get: () => wagmiConfig.chains },
        }
      ) as typeof parameters
    )

export const syncWagmiConfig = async (
  wagmiConfig: Config,
  connectors: CreateConnectorFn[],
  chains: readonly [Chain, ...Chain[]]
): Promise<void> => {
  const _mainnet = chains.find((chain) => chain.id === mainnet.id)
  if (_mainnet) {
    _mainnet.contracts = { ...mainnet.contracts, ..._mainnet.contracts }
  }

  const { connectors: connectorStore, mipd } = wagmiConfig._internal
  wagmiConfig._internal.chains.setState(chains)

  const isFirstSync = !syncStates.has(wagmiConfig)
  const sync = syncStates.get(wagmiConfig) ?? {
    connectors: new WeakMap(),
    injectedConnectors: new Map(),
    reconnect: Promise.resolve(),
  }
  syncStates.set(wagmiConfig, sync)

  const getConnector = <Key>(
    cache: ConnectorCache<Key>,
    key: Key,
    getConnectorFn: () => CreateConnectorFn
  ): Connector => {
    let connector = cache.get(key)
    if (!connector) {
      connector = connectorStore.setup(
        withLiveChains(wagmiConfig, getConnectorFn())
      )
      cache.set(key, connector)
    }
    return connector
  }

  const nextConnectors = [
    ...connectors.map((connectorFn) =>
      getConnector(sync.connectors, connectorFn, () => connectorFn)
    ),
    ...(mipd?.getProviders() ?? []).map((providerDetail) =>
      getConnector(sync.injectedConnectors, providerDetail.info.uuid, () =>
        connectorStore.providerDetailToConnector(providerDetail)
      )
    ),
  ]
  const isChanged =
    nextConnectors.length !== wagmiConfig.connectors.length ||
    nextConnectors.some(
      (connector, index) => connector !== wagmiConfig.connectors[index]
    )
  const { connections, current } = wagmiConfig.state
  // wagmi Hydrate can clear the connections, for example on each render when `ssr` is false.
  const isConnectionLost = !!current && !connections.has(current)

  if (isFirstSync || isChanged) {
    connectorStore.setState(nextConnectors)
  }
  if (isFirstSync || isChanged || isConnectionLost) {
    // wagmi drops a reconnect call while another one runs.
    sync.reconnect = sync.reconnect
      .then(async () => {
        await reconnect(wagmiConfig)
        // wagmi adds its listeners again on each reconnect of a connector.
        const { change, disconnect } = wagmiConfig._internal.events
        for (const { connector } of wagmiConfig.state.connections.values()) {
          connector.emitter.off('change', change)
          connector.emitter.on('change', change)
          connector.emitter.off('disconnect', disconnect)
          connector.emitter.on('disconnect', disconnect)
        }
      })
      .catch(() => undefined)
  }
}
