import type { WalletProviderProps } from '@lifi/wallet-provider'
import { ConnectionContext } from '@solana/wallet-adapter-react'
import { type PropsWithChildren, useContext } from 'react'
import { CaptureSVMValues } from './CaptureSVMValues.js'
import { SVMBaseProvider } from './SVMBaseProvider.js'

function useInSVMContext(): boolean {
  const context = useContext(ConnectionContext)
  return Boolean(context?.connection)
}

const SVMWalletProvider = ({
  forceInternalWalletManagement,
  children,
}: PropsWithChildren<WalletProviderProps>) => {
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

export const SVMProvider = () => {
  return ({ children, ...props }: PropsWithChildren<WalletProviderProps>) => (
    <SVMWalletProvider {...props}>{children}</SVMWalletProvider>
  )
}
