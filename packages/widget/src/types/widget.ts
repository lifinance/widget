import { ChainKey } from '@lifinance/sdk';
import { PaletteMode, PaletteOptions, Shape } from '@mui/material';
import { TypographyOptions } from '@mui/material/styles/createTypography';
import { Signer } from 'ethers';
import { CSSProperties } from 'react';

export type Appearance = PaletteMode | 'auto';
export type ThemeConfig = {
  palette?: PaletteOptions;
  shape?: Shape;
  typography?: TypographyOptions;
};

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
  theme?: ThemeConfig;
  appearance?: Appearance;
  disableAppearance?: boolean;
}
