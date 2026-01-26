import type { WidgetProviderProps } from '@lifi/widget-provider'
import type { PropsWithChildren } from 'react'
import { SolanaProviderValues } from './SolanaProviderValues.js'

const SolanaWidgetProvider = ({
  children,
}: PropsWithChildren<WidgetProviderProps>) => {
  return (
    <SolanaProviderValues isExternalContext={false}>
      {children}
    </SolanaProviderValues>
  )
}

export const SolanaProvider = () => {
  return ({ children, ...props }: PropsWithChildren<WidgetProviderProps>) => (
    <SolanaWidgetProvider {...props}>{children}</SolanaWidgetProvider>
  )
}
