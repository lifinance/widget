import type { ChainType } from '@lifi/sdk'
import type { LanguageKey } from '../I18nProvider/types.js'

export interface WalletManagementConfig {
  locale?: LanguageKey
  enabledChainTypes?: ChainType[]
  walletEcosystemsOrder?: Record<string, ChainType[]>
}

export interface WalletManagementProviderProps {
  config?: WalletManagementConfig
}
