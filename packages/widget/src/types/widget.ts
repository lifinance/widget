import type { ChainKey, ConfigUpdate, Token } from '@lifi/sdk';
import type { PaletteMode, PaletteOptions, Shape } from '@mui/material';
import type { TypographyOptions } from '@mui/material/styles/createTypography';
import type { Signer } from 'ethers';
import type { CSSProperties } from 'react';

export type WidgetVariant = 'default' | 'expandable' | 'drawer';

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

export interface WidgetConfig {
  fromChain?: `${ChainKey}` | number;
  toChain?: `${ChainKey}` | number;
  fromToken?: string;
  toToken?: string;
  toAddress?: string;
  fromAmount?: number | string;

  appearance?: Appearance;
  theme?: ThemeConfig;
  containerStyle?: CSSProperties;

  disableAppearance?: boolean;
  disableTelemetry?: boolean;

  /** @deprecated Use chains.deny instead */
  disabledChains?: number[];
  /** @deprecated Use tokens.featured instead */
  featuredTokens?: Token[];

  integrator?: string;

  variant?: WidgetVariant;

  walletManagement?: WidgetWalletManagement;
  sdkConfig?: ConfigUpdate;

  buildSwapUrl?: boolean;

  bridges?: {
    allow?: string[];
    deny?: string[];
  };
  exchanges?: {
    allow?: string[];
    deny?: string[];
  };
  chains?: {
    allow?: number[];
    deny?: number[];
  };
  tokens?: {
    featured?: Token[];
    allow?: Token[];
    deny?: (Partial<Token> & Pick<Token, 'address' | 'chainId'>)[];
  };
}
