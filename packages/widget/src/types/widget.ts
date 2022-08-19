import type { ChainKey, Token } from '@lifi/sdk';
import type { PaletteMode, PaletteOptions, Shape } from '@mui/material';
import type { TypographyOptions } from '@mui/material/styles/createTypography';
import type { Signer } from 'ethers';
import type { CSSProperties } from 'react';

export type Appearance = PaletteMode | 'auto';
export type ThemeConfig = {
  palette?: Pick<PaletteOptions, 'primary' | 'secondary'>;
  shape?: Shape;
  typography?: TypographyOptions;
};

export interface WidgetWalletManagement {
  connect(): Promise<Signer>;
  disconnect(): Promise<void>;
  switchChain?(chainId: number): Promise<Signer>;
  addToken?(token: Token, chainId: number): Promise<void>;
  addChain?(chainId: number): Promise<boolean>;
  signer?: Signer;
}

interface WidgetConfigBase {
  fromAmount?: number | string;
  containerStyle?: CSSProperties;
  theme?: ThemeConfig;
  appearance?: Appearance;
  disableAppearance?: boolean;
  disableTelemetry?: boolean;
  walletManagement?: WidgetWalletManagement;
  integrator?: string;
  disabledChains?: number[];
  featuredTokens?: Token[];
}

type WidgetFromTokenConfig =
  | {
      fromChain: `${ChainKey}` | number;
      fromToken?: string;
    }
  | {
      fromChain?: never;
      fromToken?: never;
    };

type WidgetToTokenConfig =
  | {
      toChain: `${ChainKey}` | number;
      toToken?: string;
    }
  | {
      toChain?: never;
      toToken?: never;
    };

export type WidgetConfig = WidgetConfigBase &
  WidgetFromTokenConfig &
  WidgetToTokenConfig;
