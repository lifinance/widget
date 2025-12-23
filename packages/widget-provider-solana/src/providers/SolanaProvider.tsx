import type { WidgetProviderProps } from '@lifi/widget-provider'
import type { PropsWithChildren } from 'react'
import { SolanaBaseProvider } from './SolanaBaseProvider'
import { SolanaProviderValues } from './SolanaProviderValues'
import { useSolanaWalletStandardContext } from './SolanaWalletStandardProvider'

function useInSolanaContext(): boolean {
  const context = useSolanaWalletStandardContext()
  return Boolean(context)
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
