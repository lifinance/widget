import type { ExtendedChain } from '@lifi/sdk';
import { useEffect } from 'react';
import type { Config, CreateConnectorFn } from 'wagmi';
import { syncWagmiConfig } from './syncWagmiConfig.js';

export const useSyncWagmiConfig = (
  wagmiConfig: Config,
  connectors: CreateConnectorFn[],
  chains?: ExtendedChain[],
) => {
  useEffect(() => {
    if (chains?.length) {
      syncWagmiConfig(wagmiConfig, connectors, chains);
    }
  }, [chains, connectors, wagmiConfig]);
};
