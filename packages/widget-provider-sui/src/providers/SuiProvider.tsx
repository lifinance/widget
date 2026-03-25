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
  isExternalContext = false,
  chains,
  children,
}: PropsWithChildren<WidgetProviderProps>) => {
  const inSuiContext = useInSuiContext()
  const effectiveIsExternal = isExternalContext || inSuiContext

  if (inSuiContext && !forceInternalWalletManagement) {
    return (
      <SuiProviderValues isExternalContext={effectiveIsExternal}>
        {children}
      </SuiProviderValues>
    )
  }

  return (
    <SuiBaseProvider chains={chains} isExternalContext={effectiveIsExternal}>
      {children}
    </SuiBaseProvider>
  )
}

export const SuiProvider = () => {
  return ({ children, ...props }: PropsWithChildren<WidgetProviderProps>) => (
    <SuiWidgetProvider {...props}>{children}</SuiWidgetProvider>
  )
}
