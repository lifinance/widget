import { MVMContext } from '@lifi/wallet-provider'
import {
  SuiClientContext,
  useConnectWallet,
  useCurrentWallet,
  useDisconnectWallet,
  useWallets,
} from '@mysten/dapp-kit'
import { isValidSuiAddress } from '@mysten/sui/utils'
import { type FC, type PropsWithChildren, useContext } from 'react'
import { MVMBaseProvider } from './MVMBaseProvider.js'

interface MVMProviderProps {
  walletConfig?: any // TODO: WidgetWalletConfig type
}

export function useInMVMContext(): boolean {
  const context = useContext(SuiClientContext)
  return Boolean(context)
}

export const MVMProvider: FC<PropsWithChildren<MVMProviderProps>> = ({
  walletConfig,
  children,
}) => {
  const forceInternalWalletManagement =
    walletConfig?.forceInternalWalletManagement

  const inSuiContext = useInMVMContext()

  if (inSuiContext && !forceInternalWalletManagement) {
    return (
      <CaptureMVMValues isExternalContext={inSuiContext}>
        {children}
      </CaptureMVMValues>
    )
  }

  return (
    <MVMBaseProvider>
      <CaptureMVMValues isExternalContext={inSuiContext}>
        {children}
      </CaptureMVMValues>
    </MVMBaseProvider>
  )
}

const CaptureMVMValues: FC<
  PropsWithChildren<{ isExternalContext: boolean }>
> = ({ children, isExternalContext }) => {
  const wallets = useWallets()
  const { currentWallet, connectionStatus } = useCurrentWallet()
  const { mutateAsync: disconnect } = useDisconnectWallet()
  const { mutateAsync: connect } = useConnectWallet()

  return (
    <MVMContext.Provider
      value={{
        wallets,
        currentWallet,
        connectionStatus,
        connect,
        disconnect,
        isValidAddress: isValidSuiAddress,
        isExternalContext,
      }}
    >
      {children}
    </MVMContext.Provider>
  )
}
