import type { WidgetProviderProps } from '@lifi/widget-provider'
import type { JSX, PropsWithChildren } from 'react'
import type { SolanaProviderConfig } from '../types.js'
import { SolanaProviderValues } from './SolanaProviderValues.js'

interface SolanaWidgetProviderProps extends WidgetProviderProps {
  config?: SolanaProviderConfig
}

const SolanaWidgetProvider = ({
  children,
  isExternalContext = false,
  config,
}: PropsWithChildren<SolanaWidgetProviderProps>) => {
  return (
    <SolanaProviderValues isExternalContext={isExternalContext} config={config}>
      {children}
    </SolanaProviderValues>
  )
}

export const SolanaProvider = (
  config?: SolanaProviderConfig
): ((props: PropsWithChildren<WidgetProviderProps>) => JSX.Element) => {
  return ({ children, ...props }: PropsWithChildren<WidgetProviderProps>) => (
    <SolanaWidgetProvider {...props} config={config}>
      {children}
    </SolanaWidgetProvider>
  )
}
