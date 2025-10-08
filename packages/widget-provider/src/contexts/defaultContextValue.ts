import type { WalletProviderContext } from '../types.js'

export const defaultContextValue: WalletProviderContext = {
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
