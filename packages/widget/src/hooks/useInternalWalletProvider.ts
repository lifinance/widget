import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'

export function useInternalWalletProvider(hasExternalContext: boolean) {
  const { walletConfig } = useWidgetConfig()
  return walletConfig?.forceInternalWalletManagement || !hasExternalContext
}
