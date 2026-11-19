import { ChainType, type ExtendedChain } from '@lifi/sdk'
import { useEffect, useMemo, useRef } from 'react'
import type { Chain } from 'viem'
import type { Config, CreateConnectorFn } from 'wagmi'
import {
  convertExtendedChain,
  isExtendedChain,
} from '../utils/convertExtendedChain.js'
import { syncWagmiConfig } from '../utils/syncWagmiConfig.js'

export const useSyncWagmiConfig = (
  wagmiConfig: Config,
  connectors: CreateConnectorFn[],
  chains?: (ExtendedChain | Chain)[]
): void => {
  const _chains = useMemo(() => {
    const mappedChains = chains
      ?.map((chain) =>
        isExtendedChain(chain)
          ? chain.chainType === ChainType.EVM
            ? convertExtendedChain(chain)
            : undefined
          : chain
      )
      .filter(Boolean) as [Chain, ...Chain[]]
    return mappedChains
  }, [chains])

  const syncedConfig = useRef<Config>(undefined)

  useEffect(() => {
    if (_chains?.length) {
      // wagmi Hydrate can clear the connections after each mount.
      syncWagmiConfig(
        wagmiConfig,
        connectors,
        _chains,
        syncedConfig.current !== wagmiConfig
      )
      syncedConfig.current = wagmiConfig
    }
  }, [_chains, connectors, wagmiConfig])
}
