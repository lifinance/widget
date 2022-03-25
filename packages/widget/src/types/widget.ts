import { ChainKey } from '@lifinance/sdk';
import { Signer } from 'ethers';

export interface WidgetConfig {
  enabledChains: string;
  fromChain?: `${ChainKey}` | number;
  fromToken?: string;
  fromAmount?: number;
  toChain?: `${ChainKey}` | number;
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
