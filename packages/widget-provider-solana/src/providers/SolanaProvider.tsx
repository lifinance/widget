import type { WidgetProviderProps } from '@lifi/widget-provider'
import type { PropsWithChildren } from 'react'
import { SolanaIframeProviderValues } from './SolanaIframeProviderValues.js'
import { SolanaProviderValues } from './SolanaProviderValues.js'

const isIframeEnvironment =
  typeof window !== 'undefined' && window.parent !== window

const SolanaWidgetProvider = ({
  children,
}: PropsWithChildren<WidgetProviderProps>) => {
  if (isIframeEnvironment) {
    return <SolanaIframeProviderValues>{children}</SolanaIframeProviderValues>
  }

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
