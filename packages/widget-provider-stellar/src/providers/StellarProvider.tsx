import type { WidgetProviderProps } from '@lifi/widget-provider'
import type { JSX, PropsWithChildren } from 'react'
import type { StellarProviderConfig } from '../types.js'
import { StellarProviderValues } from './StellarProviderValues.js'

interface StellarWidgetProviderProps extends WidgetProviderProps {
  config?: StellarProviderConfig
}

const StellarWidgetProvider = ({
  children,
  isExternalContext = false,
  config,
}: PropsWithChildren<StellarWidgetProviderProps>) => {
  return (
    <StellarProviderValues
      isExternalContext={isExternalContext}
      config={config}
    >
      {children}
    </StellarProviderValues>
  )
}

export const StellarProvider = (
  config?: StellarProviderConfig
): ((props: PropsWithChildren<WidgetProviderProps>) => JSX.Element) => {
  return ({ children, ...props }: PropsWithChildren<WidgetProviderProps>) => (
    <StellarWidgetProvider {...props} config={config}>
      {children}
    </StellarWidgetProvider>
  )
}
