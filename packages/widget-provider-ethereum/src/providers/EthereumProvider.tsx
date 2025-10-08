import type { WidgetProviderProps } from '@lifi/widget-provider'
import { type PropsWithChildren, useContext } from 'react'
import { WagmiContext } from 'wagmi'
import type { EthereumProviderConfig } from '../types.js'
import { EthereumBaseProvider } from './EthereumBaseProvider.js'
import { EthereumProviderValues } from './EthereumProviderValues.js'

interface EthereumWidgetProviderProps extends WidgetProviderProps {
  config?: EthereumProviderConfig
}

function useInEthereumContext(): boolean {
  const context = useContext(WagmiContext)
  return Boolean(context)
}

const EthereumWidgetProvider = ({
  forceInternalWalletManagement,
  chains,
  config,
  children,
}: PropsWithChildren<EthereumWidgetProviderProps>) => {
  const inEthereumContext = useInEthereumContext()

  if (inEthereumContext && !forceInternalWalletManagement) {
    return (
      <EthereumProviderValues isExternalContext={inEthereumContext}>
        {children}
      </EthereumProviderValues>
    )
  }

  return (
    <EthereumBaseProvider config={config} chains={chains}>
      <EthereumProviderValues
        isExternalContext={inEthereumContext}
        config={config}
      >
        {children}
      </EthereumProviderValues>
    </EthereumBaseProvider>
  )
}

export const EthereumProvider = (config?: EthereumProviderConfig) => {
  return ({ children, ...props }: PropsWithChildren<WidgetProviderProps>) => (
    <EthereumWidgetProvider {...props} config={config}>
      {children}
    </EthereumWidgetProvider>
  )
}
