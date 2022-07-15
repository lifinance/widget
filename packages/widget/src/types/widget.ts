import { ChainKey, Token } from '@lifi/sdk';
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

export interface WidgetWalletManagement {
  connect(): Promise<Signer>;
  disconnect(): Promise<void>;
  getSigner(): Promise<Signer | undefined>;
  switchChain(reqChainId: number): Promise<Signer>;
  addToken(token: Token, chainId: number): Promise<void>;
  addChain(chainId: number): Promise<boolean>;
  signer?: Signer;
}

interface WidgetConfigBase {
  fromAmount?: number;
  disabledChains?: number[];
  containerStyle?: CSSProperties;
  theme?: ThemeConfig;
  appearance?: Appearance;
  disableAppearance?: boolean;
  disableTelemetry?: boolean;
  walletManagement?: WidgetWalletManagement;
  integrator?: string;
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
