import type { ExtendedChain } from '@lifi/sdk'
import { type FC, type PropsWithChildren, useEffect, useState } from 'react'
import { WagmiProvider } from 'wagmi'
import { defaultBaseAccountConfig } from '../config/baseAccount.js'
import { defaultCoinbaseConfig } from '../config/coinbase.js'
import { defaultMetaMaskConfig } from '../config/metaMask.js'
import { defaultWalletConnectConfig } from '../config/walletConnect.js'
import { useSyncWagmiConfig } from '../hooks/useSyncWagmiConfig.js'
import type { EthereumProviderConfig } from '../types.js'
import {
  createDefaultWagmiConfig,
  type DefaultWagmiConfigResult,
} from '../utils/createDefaultWagmiConfig.js'

interface EthereumBaseProviderProps {
  config?: EthereumProviderConfig
  chains?: ExtendedChain[]
}

export const EthereumBaseProvider: FC<
  PropsWithChildren<EthereumBaseProviderProps>
> = ({ chains, config, children }) => {
  const [wagmiConfig, setWagmiConfig] =
    useState<DefaultWagmiConfigResult | null>(null)

  useEffect(() => {
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

    createDefaultWagmiConfig({
      coinbase: resolveConfig(config?.coinbase, defaultCoinbaseConfig),
      metaMask: resolveConfig(config?.metaMask, defaultMetaMaskConfig),
      walletConnect: resolveConfig(
        config?.walletConnect,
        defaultWalletConnectConfig
      ),
      baseAccount: resolveConfig(config?.baseAccount, defaultBaseAccountConfig),
      porto: resolveConfig(config?.porto, undefined),
      wagmiConfig: {
        ssr: true,
      },
      lazy: true,
    }).then(setWagmiConfig)
  }, [config])

  if (!wagmiConfig) {
    return null
  }

  return (
    <EthereumBaseProviderInner wagmiConfig={wagmiConfig} chains={chains}>
      {children}
    </EthereumBaseProviderInner>
  )
}

interface EthereumBaseProviderInnerProps {
  wagmiConfig: DefaultWagmiConfigResult
  chains?: ExtendedChain[]
}

const EthereumBaseProviderInner: FC<
  PropsWithChildren<EthereumBaseProviderInnerProps>
> = ({ wagmiConfig, chains, children }) => {
  useSyncWagmiConfig(wagmiConfig.config, wagmiConfig.connectors, chains)

  return (
    <WagmiProvider config={wagmiConfig.config} reconnectOnMount={false}>
      {children}
    </WagmiProvider>
  )
}
