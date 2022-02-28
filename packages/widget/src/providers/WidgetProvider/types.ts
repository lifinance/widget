import { Chain, ChainKey } from '@lifinance/sdk';
import { Signer } from 'ethers';
import { WidgetConfig } from '../../types';

export interface WidgetContextProps {
  fromAmount?: number;
  fromChain?: ChainKey;
  fromToken?: string;
  supportedChains: Chain[];
  toChain?: ChainKey;
  toToken?: string;
  useLiFiWalletManagement?: boolean;
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
