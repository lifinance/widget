import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from '@mysten/dapp-kit'
import { getFullnodeUrl } from '@mysten/sui/client'
import { type FC, type PropsWithChildren, useMemo } from 'react'

export const SuiBaseProvider: FC<PropsWithChildren> = ({ children }) => {
  const config = useMemo(() => {
    return createNetworkConfig({
      mainnet: { url: getFullnodeUrl('mainnet') },
    })
  }, [])

  return (
    <SuiClientProvider networks={config.networkConfig} defaultNetwork="mainnet">
      <WalletProvider
        storageKey="li.fi-widget-sui-wallet-connection"
        autoConnect
      >
        {children}
      </WalletProvider>
    </SuiClientProvider>
  )
}
