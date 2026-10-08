import { ZcashProvider as ZcashSDKProvider } from '@lifi/sdk-provider-zcash'
import {
  type WidgetProviderContext,
  type WidgetProviderProps,
  ZcashContext,
} from '@lifi/widget-provider'
import type { JSX, PropsWithChildren } from 'react'
import type { ZcashProviderConfig } from '../types.js'

export const ZcashProvider = (
  config?: ZcashProviderConfig
): ((props: PropsWithChildren<WidgetProviderProps>) => JSX.Element) => {
  // No wallet can connect on Zcash yet; the context carries the SDK provider only.
  const value: WidgetProviderContext = {
    isEnabled: true,
    isExternalContext: false,
    isConnected: false,
    sdkProvider: config?.sdkProvider ?? ZcashSDKProvider(),
    installedWallets: [],
    connect: async () => {},
    disconnect: async () => {},
  }
  return ({ children }: PropsWithChildren<WidgetProviderProps>) => (
    <ZcashContext value={value}>{children}</ZcashContext>
  )
}
