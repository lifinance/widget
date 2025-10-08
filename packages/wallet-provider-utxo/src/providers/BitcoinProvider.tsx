import { BigmiContext } from '@bigmi/react'
import type { WalletProviderProps } from '@lifi/wallet-provider'
import { type PropsWithChildren, useContext } from 'react'
import { CaptureUTXOValues } from './CaptureUTXOValues.js'
import { UTXOBaseProvider } from './UTXOBaseProvider.js'

function useInUTXOContext(): boolean {
  const context = useContext(BigmiContext)

  return Boolean(context)
}

const UTXOWalletProvider = ({
  forceInternalWalletManagement,
  children,
}: PropsWithChildren<WalletProviderProps>) => {
  const inUTXOContext = useInUTXOContext()

  if (inUTXOContext && !forceInternalWalletManagement) {
    return (
      <CaptureUTXOValues isExternalContext={inUTXOContext}>
        {children}
      </CaptureUTXOValues>
    )
  }

  return (
    <UTXOBaseProvider>
      <CaptureUTXOValues isExternalContext={inUTXOContext}>
        {children}
      </CaptureUTXOValues>
    </UTXOBaseProvider>
  )
}

export const BitcoinProvider = () => {
  return ({ children, ...props }: PropsWithChildren<WalletProviderProps>) => (
    <UTXOWalletProvider {...props}>{children}</UTXOWalletProvider>
  )
}
