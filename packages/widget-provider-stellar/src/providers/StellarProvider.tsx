import type { WidgetProviderProps } from '@lifi/widget-provider'
import type { JSX, PropsWithChildren } from 'react'
import { initStellarWalletsKit } from '../stellar-kit/createStellarWalletsKit.js'
import type { StellarProviderConfig } from '../types.js'
import { StellarProviderValues } from './StellarProviderValues.js'

interface StellarWidgetProviderProps extends WidgetProviderProps {
  config?: StellarProviderConfig
}

const StellarWidgetProvider = ({
  children,
  isExternalContext = false,
  config,
}: PropsWithChildren<StellarWidgetProviderProps>) => {
  return (
    <StellarProviderValues
      isExternalContext={isExternalContext}
      config={config}
    >
      {children}
    </StellarProviderValues>
  )
}

export const StellarProvider = (
  config?: StellarProviderConfig
): ((props: PropsWithChildren<WidgetProviderProps>) => JSX.Element) => {
  // The kit is a static singleton and the first initialization wins, so claim it
  // here — `useWalletAccount()` is a public hook that creates the store without
  // config and would otherwise drop the projectId and the network passphrase.
  if (typeof window !== 'undefined') {
    initStellarWalletsKit(config)
  }
  return ({ children, ...props }: PropsWithChildren<WidgetProviderProps>) => (
    <StellarWidgetProvider {...props} config={config}>
      {children}
    </StellarWidgetProvider>
  )
}
