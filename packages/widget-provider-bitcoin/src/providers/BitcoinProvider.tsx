import { BigmiContext } from '@bigmi/react'
import type { WidgetProviderProps } from '@lifi/widget-provider'
import { type PropsWithChildren, useContext } from 'react'
import { BitcoinBaseProvider } from './BitcoinBaseProvider.js'
import { BitcoinProviderValues } from './BitcoinProviderValues.js'

function useInBitcoinContext(): boolean {
  const context = useContext(BigmiContext)

  return Boolean(context)
}

const BitcoinWidgetProvider = ({
  forceInternalWalletManagement,
  children,
}: PropsWithChildren<WidgetProviderProps>) => {
  const inBitcoinContext = useInBitcoinContext()

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
