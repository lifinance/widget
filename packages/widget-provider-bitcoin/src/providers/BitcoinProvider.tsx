import { BigmiContext } from '@bigmi/react'
import type { WidgetProviderProps } from '@lifi/widget-provider'
import { type JSX, type PropsWithChildren, useContext } from 'react'
import type { BitcoinProviderConfig } from '../types.js'
import { BitcoinBaseProvider } from './BitcoinBaseProvider.js'
import { BitcoinProviderValues } from './BitcoinProviderValues.js'

interface BitcoinWidgetProviderProps extends WidgetProviderProps {
  config?: BitcoinProviderConfig
}

function useInBitcoinContext(): boolean {
  const context = useContext(BigmiContext)

  return Boolean(context)
}

const BitcoinWidgetProvider = ({
  forceInternalWalletManagement,
  isExternalContext = false,
  children,
  config,
}: PropsWithChildren<BitcoinWidgetProviderProps>) => {
  const inBitcoinContext = useInBitcoinContext()
  const effectiveIsExternal = isExternalContext || inBitcoinContext

  if (inBitcoinContext && !forceInternalWalletManagement) {
    return (
      <BitcoinProviderValues
        isExternalContext={effectiveIsExternal}
        config={config}
      >
        {children}
      </BitcoinProviderValues>
    )
  }

  return (
    <BitcoinBaseProvider>
      <BitcoinProviderValues
        isExternalContext={effectiveIsExternal}
        config={config}
      >
        {children}
      </BitcoinProviderValues>
    </BitcoinBaseProvider>
  )
}

export const BitcoinProvider = (
  config?: BitcoinProviderConfig
): ((props: PropsWithChildren<WidgetProviderProps>) => JSX.Element) => {
  return ({ children, ...props }: PropsWithChildren<WidgetProviderProps>) => (
    <BitcoinWidgetProvider {...props} config={config}>
      {children}
    </BitcoinWidgetProvider>
  )
}
