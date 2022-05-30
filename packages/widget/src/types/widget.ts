import { ChainKey } from '@lifinance/sdk';
import { PaletteOptions } from '@mui/material';
import { Signer } from 'ethers';
import { CSSProperties } from 'react';

export interface WidgetConfig {
  enabledChains: number[];
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
  containerStyle?: CSSProperties;
  paletteOptions?: PaletteOptions;
}
