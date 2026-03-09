import type { WidgetProviderProps } from '@lifi/widget-provider'
import { WalletContext } from '@tronweb3/tronwallet-adapter-react-hooks'
import { type PropsWithChildren, useContext } from 'react'
import type { TronProviderConfig } from '../types.js'
import { TronBaseProvider } from './TronBaseProvider.js'
import { TronProviderValues } from './TronProviderValues.js'

interface TronWidgetProviderProps extends WidgetProviderProps {
  config?: TronProviderConfig
}

function useInTronContext(): boolean {
  const context = useContext(WalletContext)
  const descriptor = Object.getOwnPropertyDescriptor(context, 'wallets')
  return Boolean(descriptor && !descriptor.get)
}

const TronWidgetProvider = ({
  forceInternalWalletManagement,
  config,
  children,
}: PropsWithChildren<TronWidgetProviderProps>) => {
  const inTronContext = useInTronContext()

  if (inTronContext && !forceInternalWalletManagement) {
    return (
      <TronProviderValues isExternalContext={inTronContext}>
        {children}
      </TronProviderValues>
    )
  }

  return (
    <TronBaseProvider config={config}>
      <TronProviderValues isExternalContext={inTronContext}>
        {children}
      </TronProviderValues>
    </TronBaseProvider>
  )
}

export const TronProvider = (config?: TronProviderConfig) => {
  return ({ children, ...props }: PropsWithChildren<WidgetProviderProps>) => (
    <TronWidgetProvider {...props} config={config}>
      {children}
    </TronWidgetProvider>
  )
}
