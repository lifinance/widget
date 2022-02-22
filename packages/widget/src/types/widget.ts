import { ChainKey } from '@lifinance/sdk';

export interface WidgetConfig {
  enabledChains: string;
  fromChain?: `${ChainKey}` | number;
  fromToken?: string;
  fromAmount?: number;
  toChain?: `${ChainKey}` | number;
  toToken?: string;
  useLiFiWalletManagement?: boolean;
}
