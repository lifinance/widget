import { SuiContext } from '@lifi/wallet-store'
import {
  SuiClientContext,
  useConnectWallet,
  useCurrentWallet,
  useDisconnectWallet,
  useWallets,
} from '@mysten/dapp-kit'
import { type FC, type PropsWithChildren, useContext } from 'react'
import { SuiBaseProvider } from './SuiBaseProvider.js'
import { SuiExternalContext } from './SuiExternalContext.js'

export function useInSuiContext(): boolean {
  const context = useContext(SuiClientContext)

  return Boolean(context)
}

export const SuiProviderWrapper: FC<
  PropsWithChildren<{ forceInternalWalletManagement?: boolean }>
> = ({ children, forceInternalWalletManagement }) => {
  const inSuiContext = useInSuiContext()

  return inSuiContext && !forceInternalWalletManagement ? (
    <SuiExternalContext.Provider value={inSuiContext}>
      {children}
    </SuiExternalContext.Provider>
  ) : (
    <SuiBaseProvider>{children}</SuiBaseProvider>
  )
}

export const SuiProvider: FC<
  PropsWithChildren<{ forceInternalWalletManagement?: boolean }>
> = ({ forceInternalWalletManagement, children }) => {
  const inSuiContext = useInSuiContext()

  return (
    <SuiProviderWrapper
      forceInternalWalletManagement={forceInternalWalletManagement}
    >
      <CaptureSuiValues isExternalContext={inSuiContext}>
        {children}
      </CaptureSuiValues>
    </SuiProviderWrapper>
  )
}

const CaptureSuiValues: FC<
  PropsWithChildren<{ isExternalContext: boolean }>
> = ({ children, isExternalContext }) => {
  const suiWallets = useWallets()
  const { currentWallet, connectionStatus } = useCurrentWallet()
  const { mutateAsync: disconnectWallet } = useDisconnectWallet()
  const { mutateAsync: connectWallet } = useConnectWallet()

  return (
    <SuiContext.Provider
      value={{
        suiWallets,
        currentWallet,
        connectionStatus,
        connectWallet,
        disconnectWallet,
        isExternalContext,
      }}
    >
      {children}
    </SuiContext.Provider>
  )
}
