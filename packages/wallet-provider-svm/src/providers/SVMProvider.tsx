import type { WalletProviderProps } from '@lifi/wallet-provider'
import { ConnectionContext } from '@solana/wallet-adapter-react'
import { type FC, type PropsWithChildren, useContext } from 'react'
import { CaptureSVMValues } from './CaptureSVMValues.js'
import { SVMBaseProvider } from './SVMBaseProvider.js'

export function useInSVMContext(): boolean {
  const context = useContext(ConnectionContext)
  return Boolean(context?.connection)
}

export const SVMProvider: FC<PropsWithChildren<WalletProviderProps>> = ({
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
