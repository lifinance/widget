import type { Signer } from '@ethersproject/abstract-signer';
import type {
  BaseToken,
  ChainKey,
  ConfigUpdate,
  Order,
  RouteOptions,
  StaticToken,
  Token,
} from '@lifi/sdk';
import type {
  Components,
  PaletteMode,
  PaletteOptions,
  Shape,
  Theme,
} from '@mui/material';
import type { TypographyOptions } from '@mui/material/styles/createTypography';
import type { CSSProperties, ReactNode, RefObject } from 'react';
import type { LanguageKey, LanguageResources } from '../providers';
import type { SplitSubvariantOptions } from '../stores';

export type WidgetVariant = 'default' | 'expandable' | 'drawer';

export type WidgetSubvariant = 'default' | 'split' | 'nft' | 'refuel';

export enum DisabledUI {
  FromAmount = 'fromAmount',
  FromToken = 'fromToken',
  ToAddress = 'toAddress',
  ToToken = 'toToken',
}
export type DisabledUIType = `${DisabledUI}`;

export enum HiddenUI {
  Appearance = 'appearance',
  DrawerButton = 'drawerButton',
  History = 'history',
  Language = 'language',
  PoweredBy = 'poweredBy',
  ToAddress = 'toAddress',
  ToToken = 'toToken',
  WalletMenu = 'walletMenu',
}
export type HiddenUIType = `${HiddenUI}`;

export enum RequiredUI {
  ToAddress = 'toAddress',
}
export type RequiredUIType = `${RequiredUI}`;

export type Appearance = PaletteMode | 'auto';
export type ThemeConfig = {
  palette?: Pick<
    PaletteOptions,
    'background' | 'grey' | 'primary' | 'secondary' | 'text'
  >;
  shape?: Shape;
  typography?: TypographyOptions;
  components?: Pick<Components<Omit<Theme, 'components'>>, 'MuiAvatar'>;
};

export interface WidgetWalletManagement {
  connect(): Promise<Signer>;
  disconnect(): Promise<void>;
  switchChain?(chainId: number): Promise<Signer>;
  addToken?(token: StaticToken, chainId: number): Promise<void>;
  addChain?(chainId: number): Promise<boolean>;
  signer?: Signer;
}

export interface SDKConfig
  extends Omit<
    ConfigUpdate,
    | 'defaultExecutionSettings'
    | 'defaultRouteOptions'
    | 'disableVersionCheck'
    | 'integrator'
  > {
  defaultRouteOptions?: Omit<
    RouteOptions,
    'bridges' | 'exchanges' | 'insurance'
  >;
}

export interface WidgetContractTool {
  logoURI: string;
  name: string;
}

export interface WidgetContract {
  address?: string;
  callData?: string;
  gasLimit?: string;
  approvalAddress?: string;
  outputToken?: string;
  fallbackAddress?: string;
}

export interface WidgetConfig {
  fromChain?: `${ChainKey}` | number;
  toChain?: `${ChainKey}` | number;
  fromToken?: string;
  toToken?: string;
  toAddress?: string;
  fromAmount?: number | string;
  toAmount?: number | string;

  contract?: WidgetContract;
  contractComponent?: ReactNode;
  contractSecondaryComponent?: ReactNode;
  contractCompactComponent?: ReactNode;
  contractTool?: WidgetContractTool;

  integrator: string;
  apiKey?: string;
  fee?: number;
  referrer?: string;

  routePriority?: Order;
  slippage?: number;
  insurance?: boolean;

  variant?: WidgetVariant;
  subvariant?: WidgetSubvariant;
  subvariantOptions?: SplitSubvariantOptions;

  appearance?: Appearance;
  theme?: ThemeConfig;
  containerStyle?: CSSProperties;

  disabledUI?: DisabledUIType[];
  hiddenUI?: HiddenUIType[];
  requiredUI?: RequiredUIType[];
  useRecommendedRoute?: boolean;

  walletManagement?: WidgetWalletManagement;
  sdkConfig?: SDKConfig;

  buildUrl?: boolean;
  keyPrefix?: string;

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
    featured?: StaticToken[];
    include?: Token[];
    allow?: BaseToken[];
    deny?: BaseToken[];
  };
  languages?: {
    default?: LanguageKey;
    allow?: LanguageKey[];
    deny?: LanguageKey[];
  };
  languageResources?: LanguageResources;
  disableLanguageDetector?: boolean;
}

export type WidgetDrawerProps = {
  elementRef?: RefObject<HTMLDivElement>;
  open?: boolean;
};

export interface WidgetConfigProps {
  config: WidgetConfig;
}

export interface WidgetConfigPartialProps {
  config?: Partial<WidgetConfig>;
}

export type WidgetProps = WidgetDrawerProps &
  WidgetConfig &
  WidgetConfigPartialProps;
