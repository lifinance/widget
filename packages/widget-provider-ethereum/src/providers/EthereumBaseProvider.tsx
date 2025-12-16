import type { ExtendedChain } from '@lifi/sdk'
import { type FC, type PropsWithChildren, useRef } from 'react'
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
import { resolveConfig } from '../utils/resolveConfig.js'

interface EthereumBaseProviderProps {
  config?: EthereumProviderConfig
  chains?: ExtendedChain[]
}

export const EthereumBaseProvider: FC<
  PropsWithChildren<EthereumBaseProviderProps>
> = ({ chains, config, children }) => {
  const wagmi = useRef<DefaultWagmiConfigResult>(null)

  if (!wagmi.current) {
    wagmi.current = createDefaultWagmiConfig({
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
    })
  }

  useSyncWagmiConfig(wagmi.current.config, wagmi.current.connectors, chains)

  return (
    <WagmiProvider config={wagmi.current.config} reconnectOnMount={false}>
      {children}
    </WagmiProvider>
  )
}
