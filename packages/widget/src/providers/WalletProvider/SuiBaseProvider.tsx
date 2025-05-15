import { ChainId } from '@lifi/sdk'
import {
  SuiClientProvider,
  WalletProvider,
  createNetworkConfig,
} from '@mysten/dapp-kit'
import { getFullnodeUrl } from '@mysten/sui/client'
import { type FC, type PropsWithChildren, useMemo } from 'react'
import { useAvailableChains } from '../../hooks/useAvailableChains.js'

export const SuiBaseProvider: FC<PropsWithChildren> = ({ children }) => {
  const { chains } = useAvailableChains()

  const config = useMemo(() => {
    const sui = chains?.find((chain) => chain.id === ChainId.SUI)
    if (sui) {
      return createNetworkConfig({
        mainnet: { url: sui.metamask?.rpcUrls[0] ?? getFullnodeUrl('mainnet') },
      })
    }
  }, [chains])

  if (!config?.networkConfig) {
    return null
  }

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
