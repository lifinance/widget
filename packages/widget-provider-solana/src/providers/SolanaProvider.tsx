import type { WidgetProviderProps } from '@lifi/widget-provider'
import type { PropsWithChildren } from 'react'
import { useSolanaWalletStandard } from '../wallet-standard/useSolanaWalletStandard.js'
import { SolanaProviderValues } from './SolanaProviderValues.js'

const SolanaWidgetProvider = ({
  children,
}: PropsWithChildren<WidgetProviderProps>) => {
  useSolanaWalletStandard({ autoConnect: true })

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
