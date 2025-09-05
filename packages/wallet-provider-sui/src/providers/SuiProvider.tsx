import { SuiContext } from '@lifi/wallet-provider'
import {
  SuiClientContext,
  useConnectWallet,
  useCurrentWallet,
  useDisconnectWallet,
  useWallets,
} from '@mysten/dapp-kit'
import { type FC, type PropsWithChildren, useContext } from 'react'
import { SuiBaseProvider } from './SuiBaseProvider.js'

interface SuiProviderProps {
  forceInternalWalletManagement?: boolean
}

export function useInSuiContext(): boolean {
  const context = useContext(SuiClientContext)
  return Boolean(context)
}

export const SuiProvider: FC<PropsWithChildren<SuiProviderProps>> = ({
  forceInternalWalletManagement,
  children,
}) => {
  const inSuiContext = useInSuiContext()

  if (inSuiContext && !forceInternalWalletManagement) {
    return (
      <CaptureSuiValues isExternalContext={inSuiContext}>
        {children}
      </CaptureSuiValues>
    )
  }

  return (
    <SuiBaseProvider>
      <CaptureSuiValues isExternalContext={inSuiContext}>
        {children}
      </CaptureSuiValues>
    </SuiBaseProvider>
  )
}

const CaptureSuiValues: FC<
  PropsWithChildren<{ isExternalContext: boolean }>
> = ({ children, isExternalContext }) => {
  const wallets = useWallets()
  const { currentWallet, connectionStatus } = useCurrentWallet()
  const { mutateAsync: disconnect } = useDisconnectWallet()
  const { mutateAsync: connect } = useConnectWallet()

  return (
    <SuiContext.Provider
      value={{
        wallets,
        currentWallet,
        connectionStatus,
        connect,
        disconnect,
        isExternalContext,
      }}
    >
      {children}
    </SuiContext.Provider>
  )
}
