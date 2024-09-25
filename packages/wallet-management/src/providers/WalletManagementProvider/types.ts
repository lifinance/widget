import type { WalletConfig } from '../../types/walletConfig.js';
import type { LanguageKey } from '../I18nProvider/types.js';

export interface WalletManagementConfig extends WalletConfig {
  locale?: LanguageKey;
}

export interface WalletManagementProviderProps {
  config?: WalletManagementConfig;
}
