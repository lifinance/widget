import type { WalletProviderProps } from '@lifi/widget-provider'
import { type PropsWithChildren, useContext } from 'react'
import { WagmiContext } from 'wagmi'
import type { EVMWalletConfig } from '../types.js'
import { CaptureEVMValues } from './CaptureEVMValues.js'
import { EVMBaseProvider } from './EVMBaseProvider.js'

interface EVMWalletProviderProps extends WalletProviderProps {
  config?: EVMWalletConfig
}

function useInEVMContext(): boolean {
  const context = useContext(WagmiContext)
  return Boolean(context)
}

const EVMWalletProvider = ({
  forceInternalWalletManagement,
  chains,
  config,
  children,
}: PropsWithChildren<EVMWalletProviderProps>) => {
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

export const EthereumProvider = (config?: EVMWalletConfig) => {
  return ({ children, ...props }: PropsWithChildren<WalletProviderProps>) => (
    <EVMWalletProvider {...props} config={config}>
      {children}
    </EVMWalletProvider>
  )
}
