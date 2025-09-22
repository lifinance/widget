import type { Chain } from 'viem'
import { mainnet } from 'viem/chains'
import type { Config, CreateConnectorFn } from 'wagmi'
import { reconnect } from 'wagmi/actions'

/**
 * Synchronizes a Wagmi configuration with new connectors and chains
 * @param wagmiConfig - The Wagmi configuration to update
 * @param connectors - Array of connector creation functions
 * @param chains - Array of blockchain networks to support
 */
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

    // Keep existing connectors that don't conflict with newly discovered MIPD providers
    const preservedConnectors = currentConnectors.filter((connector) => {
      return !newMipdRdnsSet.has(connector.id)
    })

    // Create set of preserved connector IDs
    const preservedConnectorIds = new Set(
      preservedConnectors.map((connector) => connector.id)
    )

    // Setup and filter connectors that don't already exist in preserved connectors
    const newConnectorsFromParams = connectors
      .map(wagmiConfig._internal.connectors.setup)
      .filter((connector) => !preservedConnectorIds.has(connector.id))

    const newMipdConnectors = mipdProviders
      .map(wagmiConfig._internal.connectors.providerDetailToConnector)
      .map(wagmiConfig._internal.connectors.setup)

    return [
      ...preservedConnectors,
      ...newMipdConnectors,
      ...newConnectorsFromParams,
    ]
  })

  reconnect(wagmiConfig)
}
