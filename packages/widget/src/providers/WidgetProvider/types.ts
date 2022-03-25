import { Chain } from '@lifinance/sdk';
import { Signer } from 'ethers';
import { WidgetConfig } from '../../types';

export interface WidgetContextProps {
  fromAmount?: number;
  fromChain?: number;
  fromToken?: string;
  supportedChains: Chain[];
  toChain?: number;
  toToken?: string;
  useInternalWalletManagement?: boolean;
  walletCallbacks?: {
    connect: { (): Signer };
    disconnect: { (): void };
    provideSigner: { (): Signer };
    switchChain: { (): Signer };
    addToken: { (): void };
  };
}

export interface WidgetProviderProps {
  config: WidgetConfig;
}
