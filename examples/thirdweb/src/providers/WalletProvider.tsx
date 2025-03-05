import type { FC, PropsWithChildren } from 'react'

import { useSyncWagmiConfig } from '@lifi/wallet-management'
import { ChainType, useAvailableChains } from '@lifi/widget'
import { ThirdwebProvider } from 'thirdweb/react'
import { WagmiProvider } from 'wagmi'
import { thirdwebWagmiConnector } from '../config/thirdweb'
import { wagmiConfig } from '../config/wagmi'

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { chains } = useAvailableChains()
  useSyncWagmiConfig(
    wagmiConfig,
    [thirdwebWagmiConnector],
    chains?.filter((chain) => chain.chainType === ChainType.EVM)
  )
  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
      <ThirdwebProvider>{children}</ThirdwebProvider>
    </WagmiProvider>
  )
}
