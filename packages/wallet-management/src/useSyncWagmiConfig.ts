import { ChainType, type ExtendedChain } from '@lifi/sdk'
import { useEffect, useMemo } from 'react'
import type { Chain } from 'viem'
import type { Config, CreateConnectorFn } from 'wagmi'
import { syncWagmiConfig } from './syncWagmiConfig.js'
import {
  convertExtendedChain,
  isExtendedChain,
} from './utils/convertExtendedChain.js'

export const useSyncWagmiConfig = (
  wagmiConfig: Config,
  connectors: CreateConnectorFn[],
  chains?: (ExtendedChain | Chain)[]
) => {
  const _chains = useMemo(() => {
    if (!chains) {
      return undefined
    }
    const mappedChains = chains
      .map((chain) => {
        if (!isExtendedChain(chain)) {
          return chain
        }
        return chain.chainType === ChainType.EVM
          ? convertExtendedChain(chain)
          : undefined
      })
      .filter(Boolean) as [Chain, ...Chain[]]
    return mappedChains
  }, [chains])

  useEffect(() => {
    if (_chains?.length) {
      syncWagmiConfig(wagmiConfig, connectors, _chains)
    }
  }, [_chains, connectors, wagmiConfig])
}
