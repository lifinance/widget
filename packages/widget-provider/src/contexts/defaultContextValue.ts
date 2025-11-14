import type { WidgetProviderContext } from '../types.js'

export const defaultContextValue: WidgetProviderContext = {
  isEnabled: false,
  isExternalContext: false,
  isConnected: false,
  account: null,
  sdkProvider: null,
  installedWallets: [],
  isValidAddress: () => false,
  connect: async () => {},
  disconnect: async () => {},
}
