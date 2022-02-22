import { Chain, ChainKey } from '@lifinance/sdk';
import { WidgetConfig } from '../../types';

export interface WidgetContextProps {
  fromAmount?: number;
  fromChain?: ChainKey;
  fromToken?: string;
  supportedChains: Chain[];
  toChain?: ChainKey;
  toToken?: string;
  useLiFiWalletManagement?: boolean;
}

export interface WidgetProviderProps {
  config: WidgetConfig;
}
