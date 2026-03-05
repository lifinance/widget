import { BigmiContext } from '@bigmi/react'
import type { WidgetProviderProps } from '@lifi/widget-provider'
import { type PropsWithChildren, useContext } from 'react'
import { BitcoinBaseProvider } from './BitcoinBaseProvider.js'
import { BitcoinIframeProviderValues } from './BitcoinIframeProviderValues.js'
import { BitcoinProviderValues } from './BitcoinProviderValues.js'

const isIframeEnvironment =
  typeof window !== 'undefined' && window.parent !== window

function useInBitcoinContext(): boolean {
  const context = useContext(BigmiContext)

  return Boolean(context)
}

const BitcoinWidgetProvider = ({
  forceInternalWalletManagement,
  children,
}: PropsWithChildren<WidgetProviderProps>) => {
  const inBitcoinContext = useInBitcoinContext()

  if (isIframeEnvironment) {
    return <BitcoinIframeProviderValues>{children}</BitcoinIframeProviderValues>
  }

  if (inBitcoinContext && !forceInternalWalletManagement) {
    return (
      <BitcoinProviderValues isExternalContext={inBitcoinContext}>
        {children}
      </BitcoinProviderValues>
    )
  }

  return (
    <BitcoinBaseProvider>
      <BitcoinProviderValues isExternalContext={inBitcoinContext}>
        {children}
      </BitcoinProviderValues>
    </BitcoinBaseProvider>
  )
}

export const BitcoinProvider = () => {
  return ({ children, ...props }: PropsWithChildren<WidgetProviderProps>) => (
    <BitcoinWidgetProvider {...props}>{children}</BitcoinWidgetProvider>
  )
}
