import { Chain } from '@lifinance/sdk';
import { WidgetConfig } from '../../types';

export interface WidgetContextProps {
  fromAmount?: number;
  fromChain?: number;
  fromToken?: string;
  supportedChains: Chain[];
  toChain?: number;
  toToken?: string;
}

export interface WidgetProviderProps {
  config: WidgetConfig;
}
