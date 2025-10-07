import { BigmiContext } from '@bigmi/react'
import type { WalletProviderProps } from '@lifi/wallet-provider'
import { type FC, type PropsWithChildren, useContext } from 'react'
import { CaptureUTXOValues } from './CaptureUTXOValues.js'
import { UTXOBaseProvider } from './UTXOBaseProvider.js'

export function useInUTXOContext(): boolean {
  const context = useContext(BigmiContext)

  return Boolean(context)
}

export const UTXOProvider: FC<PropsWithChildren<WalletProviderProps>> = ({
  forceInternalWalletManagement,
  children,
}) => {
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
