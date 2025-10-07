import type { WalletProviderProps } from '@lifi/wallet-provider'
import { type FC, type PropsWithChildren, useContext } from 'react'
import { WagmiContext } from 'wagmi'
import type { EVMWalletConfig } from '../types.js'
import { CaptureEVMValues } from './CaptureEVMValues.js'
import { EVMBaseProvider } from './EVMBaseProvider.js'

interface EVMProviderProps extends WalletProviderProps {
  config?: EVMWalletConfig
}

export function useInEVMContext(): boolean {
  const context = useContext(WagmiContext)
  return Boolean(context)
}

export const EVMProvider: FC<PropsWithChildren<EVMProviderProps>> = ({
  forceInternalWalletManagement,
  chains,
  config,
  children,
}) => {
  const inEVMContext = useInEVMContext()

  if (inEVMContext && !forceInternalWalletManagement) {
    return (
      <CaptureEVMValues isExternalContext={inEVMContext}>
        {children}
      </CaptureEVMValues>
    )
  }

  return (
    <EVMBaseProvider config={config} chains={chains}>
      <CaptureEVMValues isExternalContext={inEVMContext} config={config}>
        {children}
      </CaptureEVMValues>
    </EVMBaseProvider>
  )
}
