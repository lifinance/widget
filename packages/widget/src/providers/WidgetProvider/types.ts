import { PaletteOptions } from '@mui/material';
import { Signer } from 'ethers';
import { CSSProperties } from 'react';
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
  containerStyle?: CSSProperties;
  paletteOptions?: PaletteOptions;
}

export interface WidgetProviderProps {
  config: WidgetConfig;
}
