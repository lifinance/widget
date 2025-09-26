import type { ExtendedChain } from '@lifi/sdk'
import { type FC, type PropsWithChildren, useRef } from 'react'
import { WagmiProvider } from 'wagmi'
import { defaultBaseAccountConfig } from '../config/baseAccount.js'
import { defaultCoinbaseConfig } from '../config/coinbase.js'
import { defaultMetaMaskConfig } from '../config/metaMask.js'
import { defaultWalletConnectConfig } from '../config/walletConnect.js'
import { useSyncWagmiConfig } from '../hooks/useSyncWagmiConfig.js'
import {
  createDefaultWagmiConfig,
  type DefaultWagmiConfigResult,
} from '../utils/createDefaultWagmiConfig.js'

interface EVMBaseProviderProps {
  walletConfig?: any // TODO: WidgetWalletConfig type
  chains?: ExtendedChain[]
}

export const EVMBaseProvider: FC<PropsWithChildren<EVMBaseProviderProps>> = ({
  chains,
  walletConfig,
  children,
}) => {
  const wagmi = useRef<DefaultWagmiConfigResult>(null)

  if (!wagmi.current) {
    wagmi.current = createDefaultWagmiConfig({
      coinbase: walletConfig?.coinbase ?? defaultCoinbaseConfig,
      metaMask: walletConfig?.metaMask ?? defaultMetaMaskConfig,
      walletConnect: walletConfig?.walletConnect ?? defaultWalletConnectConfig,
      baseAccount: walletConfig?.baseAccount ?? defaultBaseAccountConfig,
      porto: walletConfig?.porto,
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
