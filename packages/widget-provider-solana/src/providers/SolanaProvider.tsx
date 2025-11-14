import type { WidgetProviderProps } from '@lifi/widget-provider'
import { ConnectionContext } from '@solana/wallet-adapter-react'
import { type PropsWithChildren, useContext } from 'react'
import { SolanaBaseProvider } from './SolanaBaseProvider'
import { SolanaProviderValues } from './SolanaProviderValues'

function useInSolanaContext(): boolean {
  const context = useContext(ConnectionContext)
  return Boolean(context?.connection)
}

const SolanaWidgetProvider = ({
  forceInternalWalletManagement,
  children,
}: PropsWithChildren<WidgetProviderProps>) => {
  const inSolanaContext = useInSolanaContext()

  if (inSolanaContext && !forceInternalWalletManagement) {
    return (
      <SolanaProviderValues isExternalContext={inSolanaContext}>
        {children}
      </SolanaProviderValues>
    )
  }

  return (
    <SolanaBaseProvider>
      <SolanaProviderValues isExternalContext={inSolanaContext}>
        {children}
      </SolanaProviderValues>
    </SolanaBaseProvider>
  )
}

export const SolanaProvider = () => {
  return ({ children, ...props }: PropsWithChildren<WidgetProviderProps>) => (
    <SolanaWidgetProvider {...props}>{children}</SolanaWidgetProvider>
  )
}
