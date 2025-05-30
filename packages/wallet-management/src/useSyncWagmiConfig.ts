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
  const _chains = useMemo(
    () =>
      chains
        ?.filter((chain) =>
          isExtendedChain(chain) ? chain.chainType === ChainType.EVM : true
        )
        .map((chain) =>
          isExtendedChain(chain) ? convertExtendedChain(chain) : chain
        ) as [Chain, ...Chain[]],
    [chains]
  )

  useEffect(() => {
    if (_chains?.length) {
      syncWagmiConfig(wagmiConfig, connectors, _chains)
    }
  }, [_chains, connectors, wagmiConfig])
}
