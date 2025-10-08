import { ChainId, type ExtendedChain } from '@lifi/sdk'
import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from '@mysten/dapp-kit'
import { getFullnodeUrl } from '@mysten/sui/client'
import { type FC, type PropsWithChildren, useMemo } from 'react'

interface MVMBaseProviderProps {
  chains?: ExtendedChain[]
}

export const MVMBaseProvider: FC<PropsWithChildren<MVMBaseProviderProps>> = ({
  chains,
  children,
}) => {
  const config = useMemo(() => {
    const sui = chains?.find((chain) => chain.id === ChainId.SUI)
    return createNetworkConfig({
      mainnet: { url: sui?.metamask?.rpcUrls[0] ?? getFullnodeUrl('mainnet') },
    })
  }, [chains])

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
