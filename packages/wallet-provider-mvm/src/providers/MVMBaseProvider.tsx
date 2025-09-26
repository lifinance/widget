import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from '@mysten/dapp-kit'
import { getFullnodeUrl } from '@mysten/sui/client'
import { type FC, type PropsWithChildren, useMemo } from 'react'

export const MVMBaseProvider: FC<PropsWithChildren> = ({ children }) => {
  const config = useMemo(() => {
    return createNetworkConfig({
      // TODO: original: mainnet: { url: sui?.metamask?.rpcUrls[0] ?? getFullnodeUrl('mainnet') },
      // sui chain: from useAvailableChains()
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
