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
  wagmiConfig._internal.connectors.setState(() =>
    [
      ...connectors,
      ...(wagmiConfig._internal.mipd
        ?.getProviders()
        .map(wagmiConfig._internal.connectors.providerDetailToConnector) ?? []),
    ].map(wagmiConfig._internal.connectors.setup)
  )
  reconnect(wagmiConfig)
}
