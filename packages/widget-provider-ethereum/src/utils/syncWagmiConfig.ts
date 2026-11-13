import type { Chain } from 'viem'
import { mainnet } from 'viem/chains'
import type { Config, Connector, CreateConnectorFn } from 'wagmi'
import { reconnect } from 'wagmi/actions'

type SyncState = {
  connectorFns?: CreateConnectorFn[]
  // Connector SDKs bind their event handlers to the first connector object only.
  connectors: WeakMap<CreateConnectorFn, Connector>
}

const syncStates = new WeakMap<Config, SyncState>()

// wagmi gives each connector a copy of the chain list, so it gets the live list.
const withLiveChains =
  (wagmiConfig: Config, connectorFn: CreateConnectorFn): CreateConnectorFn =>
  (config) =>
    connectorFn(
      new Proxy(config, {
        get: (target, key) =>
          key === 'chains' ? wagmiConfig.chains : Reflect.get(target, key),
      })
    )

const isSameConnectorFns = (
  previous: CreateConnectorFn[] | undefined,
  connectorFns: CreateConnectorFn[]
): boolean =>
  previous?.length === connectorFns.length &&
  previous.every((connectorFn, index) => connectorFn === connectorFns[index])

export const syncWagmiConfig = async (
  wagmiConfig: Config,
  connectors: CreateConnectorFn[],
  chains: readonly [Chain, ...Chain[]]
): Promise<void> => {
  const _mainnet = chains.find((chain) => chain.id === mainnet.id)
  if (_mainnet) {
    _mainnet.contracts = { ...mainnet.contracts, ..._mainnet.contracts }
  }

  wagmiConfig._internal.chains.setState(chains)

  let state = syncStates.get(wagmiConfig)
  if (!state) {
    state = { connectors: new WeakMap() }
    syncStates.set(wagmiConfig, state)
  }
  if (isSameConnectorFns(state.connectorFns, connectors)) {
    return
  }

  const setUpConnectors = state.connectors
  const getConnector = (connectorFn: CreateConnectorFn): Connector => {
    let connector = setUpConnectors.get(connectorFn)
    if (!connector) {
      connector = wagmiConfig._internal.connectors.setup(
        withLiveChains(wagmiConfig, connectorFn)
      )
      setUpConnectors.set(connectorFn, connector)
    }
    return connector
  }

  wagmiConfig._internal.connectors.setState(() => [
    ...connectors.map(getConnector),
    ...(wagmiConfig._internal.mipd
      ?.getProviders()
      .map((providerDetail) =>
        wagmiConfig._internal.connectors.setup(
          withLiveChains(
            wagmiConfig,
            wagmiConfig._internal.connectors.providerDetailToConnector(
              providerDetail
            )
          )
        )
      ) ?? []),
  ])
  state.connectorFns = [...connectors]
  reconnect(wagmiConfig)
}
