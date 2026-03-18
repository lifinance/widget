import type { WidgetProviderProps } from '@lifi/widget-provider'
import { DAppKitContext } from '@mysten/dapp-kit-react'
import { type PropsWithChildren, useContext } from 'react'
import { SuiBaseProvider } from './SuiBaseProvider.js'
import { SuiProviderValues } from './SuiProviderValues.js'

function useInSuiContext(): boolean {
  const context = useContext(DAppKitContext)
  return Boolean(context)
}

const SuiWidgetProvider = ({
  forceInternalWalletManagement,
  chains,
  children,
}: PropsWithChildren<WidgetProviderProps>) => {
  const inSuiContext = useInSuiContext()

  if (inSuiContext && !forceInternalWalletManagement) {
    return (
      <SuiProviderValues isExternalContext={inSuiContext}>
        {children}
      </SuiProviderValues>
    )
  }

  return <SuiBaseProvider chains={chains}>{children}</SuiBaseProvider>
}

export const SuiProvider = () => {
  return ({ children, ...props }: PropsWithChildren<WidgetProviderProps>) => (
    <SuiWidgetProvider {...props}>{children}</SuiWidgetProvider>
  )
}
