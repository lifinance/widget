import type { ChainType } from '@lifi/sdk'
import type { WalletConfig } from '../../types/walletConfig.js'
import type { LanguageKey } from '../I18nProvider/types.js'

export interface WalletManagementConfig extends WalletConfig {
  locale?: LanguageKey
  enabledChainTypes?: ChainType[]
}

export interface WalletManagementProviderProps {
  config?: WalletManagementConfig
}
