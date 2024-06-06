import type { ExtendedChain } from '@lifi/sdk';
import type { Chain } from 'viem';
import type { Config, CreateConnectorFn } from 'wagmi';
import { reconnect } from 'wagmi/actions';
import { convertExtendedChain } from './utils/convertExtendedChain.js';

export const syncWagmiConfig = (
  wagmiConfig: Config,
  connectors: CreateConnectorFn[],
  chains: ExtendedChain[],
) => {
  const _chains = chains.map(convertExtendedChain) as [Chain, ...Chain[]];
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
