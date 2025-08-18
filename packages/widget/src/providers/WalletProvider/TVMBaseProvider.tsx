import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks'
import { TronLinkAdapter } from '@tronweb3/tronwallet-adapters'
import { type FC, type PropsWithChildren, useMemo } from 'react'
// import { useAvailableChains } from '../../hooks/useAvailableChains.js'

export const TVMBaseProvider: FC<PropsWithChildren> = ({ children }) => {
  // const { chains } = useAvailableChains()

  // TODO: update adapters based on chains?
  const adapters = useMemo(
    () => [new TronLinkAdapter({ checkTimeout: 3000 })],
    []
  )

  return (
    <WalletProvider
      autoConnect
      adapters={adapters}
      localStorageKey="li.fi-widget-tron-wallet-connection"
    >
      {children}
    </WalletProvider>
  )
}
