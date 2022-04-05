import { Signer } from 'ethers';
import { WidgetConfig } from '../../types';

export interface WidgetContextProps {
  fromAmount?: number;
  fromChain?: number;
  fromToken?: string;
  toChain?: number;
  toToken?: string;
  enabledChains: number[];
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
