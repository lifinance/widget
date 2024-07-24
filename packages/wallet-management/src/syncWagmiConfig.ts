import type { ExtendedChain } from '@lifi/sdk';
import type { Chain } from 'viem';
import { mainnet } from 'viem/chains';
import type { Config, CreateConnectorFn } from 'wagmi';
import { reconnect } from 'wagmi/actions';
import {
  convertExtendedChain,
  isExtendedChain,
} from './utils/convertExtendedChain.js';

export const syncWagmiConfig = (
  wagmiConfig: Config,
  connectors: CreateConnectorFn[],
  chains: (ExtendedChain | Chain)[],
) => {
  const _chains = chains.map((chain) =>
    isExtendedChain(chain) ? convertExtendedChain(chain) : chain,
  ) as [Chain, ...Chain[]];
  const _mainnet = _chains.find((chain) => chain.id === mainnet.id);
  if (_mainnet) {
    _mainnet.contracts = { ...mainnet.contracts, ..._mainnet.contracts };
  }
  wagmiConfig._internal.chains.setState(_chains);
  wagmiConfig._internal.connectors.setState(() =>
    [
      ...connectors,
      ...(wagmiConfig._internal.mipd
        ?.getProviders()
        .map(wagmiConfig._internal.connectors.providerDetailToConnector) ?? []),
    ].map(wagmiConfig._internal.connectors.setup),
  );
  reconnect(wagmiConfig);
};
