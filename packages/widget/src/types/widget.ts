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

export interface WidgetWalletCallbacks {
  connect(): Promise<Signer>;
  disconnect(): Promise<void>;
  provideSigner(): Promise<Signer>;
  switchChain(reqChainId: number): Promise<Signer>;
  addToken(tokenAddress: string, chainId: number): Promise<void>;
  addChain(chainId: number): Promise<boolean>;
}

interface WidgetConfigBase {
  fromAmount?: number;
  disabledChains?: number[];
  containerStyle?: CSSProperties;
  theme?: ThemeConfig;
  appearance?: Appearance;
  disableAppearance?: boolean;
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

type WidgetWalletManagementConfig =
  | {
      disableInternalWalletManagement: true;
      walletCallbacks: WidgetWalletCallbacks;
    }
  | {
      disableInternalWalletManagement?: false;
      walletCallbacks?: never;
    };

export type WidgetConfig = WidgetConfigBase &
  WidgetFromTokenConfig &
  WidgetToTokenConfig &
  WidgetWalletManagementConfig;
