import { SVMContext } from '@lifi/wallet-provider'
import { ConnectionContext, useWallet } from '@solana/wallet-adapter-react'
import { type FC, type PropsWithChildren, useContext } from 'react'
import { SVMBaseProvider } from './SVMBaseProvider.js'

interface SVMProviderProps {
  forceInternalWalletManagement?: boolean
}

export function useInSVMContext(): boolean {
  const context = useContext(ConnectionContext)
  return Boolean(context?.connection)
}

export const SVMProvider: FC<PropsWithChildren<SVMProviderProps>> = ({
  forceInternalWalletManagement,
  children,
}) => {
  const inSVMContext = useInSVMContext()

  if (inSVMContext && !forceInternalWalletManagement) {
    return (
      <CaptureSVMValues isExternalContext={inSVMContext}>
        {children}
      </CaptureSVMValues>
    )
  }

  return (
    <SVMBaseProvider>
      <CaptureSVMValues isExternalContext={inSVMContext}>
        {children}
      </CaptureSVMValues>
    </SVMBaseProvider>
  )
}

const CaptureSVMValues: FC<
  PropsWithChildren<{ isExternalContext: boolean }>
> = ({ children, isExternalContext }) => {
  const {
    wallets,
    wallet: currentWallet,
    select: connect, // We use autoConnect on wallet selection
    disconnect,
    connected,
  } = useWallet()

  return (
    <SVMContext.Provider
      value={{
        wallets,
        currentWallet,
        // connectionStatus,
        isConnected: connected,
        connect,
        disconnect,
        isExternalContext,
      }}
    >
      {children}
    </SVMContext.Provider>
  )
}
