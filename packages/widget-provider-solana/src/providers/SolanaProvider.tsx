import type { WidgetProviderProps } from '@lifi/widget-provider'
import type { JSX, PropsWithChildren } from 'react'
import { SolanaProviderValues } from './SolanaProviderValues.js'

const SolanaWidgetProvider = ({
  children,
  isExternalContext = false,
}: PropsWithChildren<WidgetProviderProps>) => {
  return (
    <SolanaProviderValues isExternalContext={isExternalContext}>
      {children}
    </SolanaProviderValues>
  )
}

export const SolanaProvider = (): ((
  props: PropsWithChildren<WidgetProviderProps>
) => JSX.Element) => {
  return ({ children, ...props }: PropsWithChildren<WidgetProviderProps>) => (
    <SolanaWidgetProvider {...props}>{children}</SolanaWidgetProvider>
  )
}
