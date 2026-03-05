import type { WidgetProviderProps } from '@lifi/widget-provider'
import { SuiClientContext } from '@mysten/dapp-kit'
import { type PropsWithChildren, useContext } from 'react'
import { SuiBaseProvider } from './SuiBaseProvider.js'
import { SuiIframeProviderValues } from './SuiIframeProviderValues.js'
import { SuiProviderValues } from './SuiProviderValues.js'

const isIframeEnvironment =
  typeof window !== 'undefined' && window.parent !== window

function useInSuiContext(): boolean {
  const context = useContext(SuiClientContext)
  return Boolean(context)
}

const SuiWidgetProvider = ({
  forceInternalWalletManagement,
  chains,
  children,
}: PropsWithChildren<WidgetProviderProps>) => {
  const inSuiContext = useInSuiContext()

  if (isIframeEnvironment) {
    return <SuiIframeProviderValues>{children}</SuiIframeProviderValues>
  }

  if (inSuiContext && !forceInternalWalletManagement) {
    return (
      <SuiProviderValues isExternalContext={inSuiContext}>
        {children}
      </SuiProviderValues>
    )
  }

  return (
    <SuiBaseProvider chains={chains}>
      <SuiProviderValues isExternalContext={inSuiContext}>
        {children}
      </SuiProviderValues>
    </SuiBaseProvider>
  )
}

export const SuiProvider = () => {
  return ({ children, ...props }: PropsWithChildren<WidgetProviderProps>) => (
    <SuiWidgetProvider {...props}>{children}</SuiWidgetProvider>
  )
}
