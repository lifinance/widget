import type { WidgetProviderProps } from '@lifi/widget-provider'
import { DAppKitContext } from '@mysten/dapp-kit-react'
import { type JSX, type PropsWithChildren, useContext } from 'react'
import type { SuiProviderConfig } from '../types.js'
import { SuiBaseProvider } from './SuiBaseProvider.js'
import { SuiProviderValues } from './SuiProviderValues.js'

interface SuiWidgetProviderProps extends WidgetProviderProps {
  config?: SuiProviderConfig
}

function useInSuiContext(): boolean {
  const context = useContext(DAppKitContext)
  return Boolean(context)
}

const SuiWidgetProvider = ({
  forceInternalWalletManagement,
  isExternalContext = false,
  chains,
  children,
  config,
}: PropsWithChildren<SuiWidgetProviderProps>) => {
  const inSuiContext = useInSuiContext()
  const effectiveIsExternal = isExternalContext || inSuiContext

  if (inSuiContext && !forceInternalWalletManagement) {
    return (
      <SuiProviderValues
        isExternalContext={effectiveIsExternal}
        config={config}
      >
        {children}
      </SuiProviderValues>
    )
  }

  return (
    <SuiBaseProvider
      chains={chains}
      isExternalContext={effectiveIsExternal}
      config={config}
    >
      {children}
    </SuiBaseProvider>
  )
}

export const SuiProvider = (
  config?: SuiProviderConfig
): ((props: PropsWithChildren<WidgetProviderProps>) => JSX.Element) => {
  return ({ children, ...props }: PropsWithChildren<WidgetProviderProps>) => (
    <SuiWidgetProvider {...props} config={config}>
      {children}
    </SuiWidgetProvider>
  )
}
