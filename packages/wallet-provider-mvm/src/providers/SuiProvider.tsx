import type { WalletProviderProps } from '@lifi/wallet-provider'
import { SuiClientContext } from '@mysten/dapp-kit'
import { type PropsWithChildren, useContext } from 'react'
import { CaptureMVMValues } from './CaptureMVMValues.js'
import { MVMBaseProvider } from './MVMBaseProvider.js'

function useInMVMContext(): boolean {
  const context = useContext(SuiClientContext)
  return Boolean(context)
}

const MVMWalletProvider = ({
  forceInternalWalletManagement,
  chains,
  children,
}: PropsWithChildren<WalletProviderProps>) => {
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

export const SuiProvider = () => {
  return ({ children, ...props }: PropsWithChildren<WalletProviderProps>) => (
    <MVMWalletProvider {...props}>{children}</MVMWalletProvider>
  )
}
