import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'

export function useBaseProvider(hasExternalContext: boolean) {
  const { walletConfig } = useWidgetConfig()
  return walletConfig?.forceInternalWalletManagement || !hasExternalContext
}
