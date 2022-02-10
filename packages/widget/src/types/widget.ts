import { ChainKey, CoinKey } from '@lifinance/sdk';

export interface WidgetConfig {
  enabledChains: string;
  fromChain?: `${ChainKey}` | number;
  fromToken?: `${CoinKey}`;
  fromAmount?: number;
  toChain?: `${ChainKey}` | number;
  toToken?: `${CoinKey}`;
}
