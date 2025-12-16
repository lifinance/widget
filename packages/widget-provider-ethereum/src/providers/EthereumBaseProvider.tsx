import type { ExtendedChain } from '@lifi/sdk'
import { type FC, type PropsWithChildren, useMemo } from 'react'
import { WagmiProvider } from 'wagmi'
import { defaultBaseAccountConfig } from '../config/baseAccount.js'
import { defaultCoinbaseConfig } from '../config/coinbase.js'
import { defaultMetaMaskConfig } from '../config/metaMask.js'
import { defaultWalletConnectConfig } from '../config/walletConnect.js'
import { useSyncWagmiConfig } from '../hooks/useSyncWagmiConfig.js'
import type { EthereumProviderConfig } from '../types.js'
import { createDefaultWagmiConfig } from '../utils/createDefaultWagmiConfig.js'

interface EthereumBaseProviderProps {
  config?: EthereumProviderConfig
  chains?: ExtendedChain[]
}

// Resolve config values: true = use defaults, object = use that, false/undefined = skip
const resolveConfig = <T,>(
  value: T | boolean | undefined,
  defaultValue: T
): T | undefined => {
  if (value === true) {
    return defaultValue
  }
  if (value === false || value === undefined) {
    return undefined
  }
  return value
}

export const EthereumBaseProvider: FC<
  PropsWithChildren<EthereumBaseProviderProps>
> = ({ chains, config, children }) => {
  const wagmiConfig = useMemo(
    () =>
      createDefaultWagmiConfig({
        coinbase: resolveConfig(config?.coinbase, defaultCoinbaseConfig),
        metaMask: resolveConfig(config?.metaMask, defaultMetaMaskConfig),
        walletConnect: resolveConfig(
          config?.walletConnect,
          defaultWalletConnectConfig
        ),
        baseAccount: resolveConfig(
          config?.baseAccount,
          defaultBaseAccountConfig
        ),
        porto: resolveConfig(config?.porto, undefined),
        wagmiConfig: {
          ssr: true,
        },
        lazy: true,
      }),
    [config]
  )

  useSyncWagmiConfig(wagmiConfig.config, wagmiConfig.connectors, chains)

  return (
    <WagmiProvider config={wagmiConfig.config} reconnectOnMount={false}>
      {children}
    </WagmiProvider>
  )
}
