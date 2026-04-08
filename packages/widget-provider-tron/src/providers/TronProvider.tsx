import type { WidgetProviderProps } from '@lifi/widget-provider'
import { WalletContext } from '@tronweb3/tronwallet-adapter-react-hooks'
import { type JSX, type PropsWithChildren, useContext } from 'react'
import type { TronProviderConfig } from '../types.js'
import { TronBaseProvider } from './TronBaseProvider.js'
import { TronProviderValues } from './TronProviderValues.js'

interface TronWidgetProviderProps extends WidgetProviderProps {
  config?: TronProviderConfig
}

// Detects if a parent TronWalletProvider already wraps the component tree.
// The default WalletContext uses lazy getters on its properties (e.g. `wallets`),
// while a real provider sets plain data properties. Checking the property descriptor
// distinguishes between the two — a non-getter means a real provider is present.
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

export const TronProvider = (
  config?: TronProviderConfig
): ((props: PropsWithChildren<WidgetProviderProps>) => JSX.Element) => {
  return ({ children, ...props }: PropsWithChildren<WidgetProviderProps>) => (
    <TronWidgetProvider {...props} config={config}>
      {children}
    </TronWidgetProvider>
  )
}
