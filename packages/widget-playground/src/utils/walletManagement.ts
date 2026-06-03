export type WalletManagementMode = 'internal' | 'external' | 'partial'

interface WalletManagementOptionConfig {
  id: WalletManagementMode
  title: string
  description: string
}

export const WALLET_MANAGEMENT_OPTIONS: WalletManagementOptionConfig[] = [
  {
    id: 'internal',
    title: 'Internal',
    description: 'Widget manages all wallets.',
  },
  {
    id: 'external',
    title: 'External',
    description: "Your app's wallet handles connection.",
  },
  {
    id: 'partial',
    title: 'Partial',
    description: 'Combination of both.',
  },
]

export const getActiveWalletManagementMode = (
  isExternalWalletManagement: boolean,
  isPartialWalletManagement: boolean
): WalletManagementMode => {
  if (!isExternalWalletManagement) {
    return 'internal'
  }
  if (isPartialWalletManagement) {
    return 'partial'
  }
  return 'external'
}
