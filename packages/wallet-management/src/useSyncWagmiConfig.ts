import type { ExtendedChain } from '@lifi/sdk'
import { useEffect } from 'react'
import type { Chain } from 'viem'
import type { Config, CreateConnectorFn } from 'wagmi'
import { syncWagmiConfig } from './syncWagmiConfig.js'

export const useSyncWagmiConfig = (
  wagmiConfig: Config,
  connectors: CreateConnectorFn[],
  chains?: (ExtendedChain | Chain)[]
) => {
  useEffect(() => {
    if (chains?.length) {
      syncWagmiConfig(wagmiConfig, connectors, chains)
    }
  }, [chains, connectors, wagmiConfig])
}
