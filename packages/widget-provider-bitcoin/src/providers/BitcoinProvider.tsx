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
  isExternalContext = false,
  children,
}: PropsWithChildren<WidgetProviderProps>) => {
  const inBitcoinContext = useInBitcoinContext()
  const effectiveIsExternal = isExternalContext || inBitcoinContext

  if (inBitcoinContext && !forceInternalWalletManagement) {
    return (
      <BitcoinProviderValues isExternalContext={effectiveIsExternal}>
        {children}
      </BitcoinProviderValues>
    )
  }

  return (
    <BitcoinBaseProvider>
      <BitcoinProviderValues isExternalContext={effectiveIsExternal}>
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
