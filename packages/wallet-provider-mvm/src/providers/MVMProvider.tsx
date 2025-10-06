import type { WalletProviderProps } from '@lifi/wallet-provider'
import { SuiClientContext } from '@mysten/dapp-kit'
import { type FC, type PropsWithChildren, useContext } from 'react'
import { CaptureMVMValues } from './CaptureMVMValues.js'
import { MVMBaseProvider } from './MVMBaseProvider.js'

export function useInMVMContext(): boolean {
  const context = useContext(SuiClientContext)
  return Boolean(context)
}

export const MVMProvider: FC<PropsWithChildren<WalletProviderProps>> = ({
  forceInternalWalletManagement,
  chains,
  children,
}) => {
  const inSuiContext = useInMVMContext()

  if (inSuiContext && !forceInternalWalletManagement) {
    return (
      <CaptureMVMValues isExternalContext={inSuiContext}>
        {children}
      </CaptureMVMValues>
    )
  }

  return (
    <MVMBaseProvider chains={chains}>
      <CaptureMVMValues isExternalContext={inSuiContext}>
        {children}
      </CaptureMVMValues>
    </MVMBaseProvider>
  )
}
