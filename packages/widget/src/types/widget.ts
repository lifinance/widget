import { ChainKey } from '@lifinance/sdk';
import { PaletteMode, PaletteOptions } from '@mui/material';
import { Signer } from 'ethers';
import { CSSProperties } from 'react';

export type Appearance = PaletteMode | 'auto';
export interface WidgetConfig {
  fromAmount?: number;
  fromChain?: `${ChainKey}` | number;
  fromToken?: string;
  toChain?: `${ChainKey}` | number;
  toToken?: string;
  enabledChains: number[];
  disableInternalWalletManagement?: boolean;
  walletCallbacks?: {
    connect: { (): Signer };
    disconnect: { (): void };
    provideSigner: { (): Signer };
    switchChain: { (): Signer };
    addToken: { (): void };
  };
  containerStyle?: CSSProperties;
  paletteOptions?: PaletteOptions;
  appearance?: Appearance;
  disableAppearance?: boolean;
}
