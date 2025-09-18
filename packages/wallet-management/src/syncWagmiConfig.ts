import type { Chain } from 'viem'
import { mainnet } from 'viem/chains'
import type { Config, CreateConnectorFn } from 'wagmi'
import { reconnect } from 'wagmi/actions'

export const syncWagmiConfig = async (
  wagmiConfig: Config,
  connectors: CreateConnectorFn[],
  chains: readonly [Chain, ...Chain[]]
) => {
  const _mainnet = chains.find((chain) => chain.id === mainnet.id)
  if (_mainnet) {
    _mainnet.contracts = { ...mainnet.contracts, ..._mainnet.contracts }
  }
  wagmiConfig._internal.chains.setState(chains)

  wagmiConfig._internal.connectors.setState((currentConnectors) => {
    const mipdProviders = wagmiConfig._internal.mipd?.getProviders() || []
    const newMipdRdnsSet = new Set(
      mipdProviders.map((provider) => provider.info.rdns)
    )

    const preservedConnectors = currentConnectors.filter((connector) => {
      return !newMipdRdnsSet.has(connector.id)
    })

    const newConnectors = [
      ...connectors,
      ...(wagmiConfig._internal.mipd
        ?.getProviders()
        .map(wagmiConfig._internal.connectors.providerDetailToConnector) ?? []),
    ].map(wagmiConfig._internal.connectors.setup)

    return [...preservedConnectors, ...newConnectors]
  })

  reconnect(wagmiConfig)
}
