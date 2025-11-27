import type { WidgetProviderContext } from '../types'

export const defaultContextValue: WidgetProviderContext = {
  isEnabled: false,
  isExternalContext: false,
  isConnected: false,
  account: undefined,
  sdkProvider: undefined,
  installedWallets: [],
  connect: async () => {},
  disconnect: async () => {},
}
