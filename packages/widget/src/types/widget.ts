import type {
  BaseToken,
  ChainType,
  ContractCall,
  Order,
  RouteOptions,
  SDKConfig,
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
import type { TypographyOptions } from '@mui/material/styles/createTypography.js';
import type {
  CoinbaseWalletParameters,
  WalletConnectParameters,
} from '@wagmi/connectors';
import type { CSSProperties, ReactNode, RefObject } from 'react';
import type {
  LanguageKey,
  LanguageResources,
} from '../providers/I18nProvider/types.js';

export type WidgetVariant = 'compact' | 'wide' | 'drawer';
export type WidgetSubvariant = 'default' | 'split' | 'custom' | 'refuel';
export type SplitSubvariant = 'bridge' | 'swap';
export type CustomSubvariant = 'checkout' | 'deposit';
export interface SubvariantOptions {
  split?: SplitSubvariant;
  custom?: CustomSubvariant;
}

export type Appearance = PaletteMode | 'auto';
export interface NavigationProps {
  /**
   * If given, uses a negative margin to counteract the padding on sides for navigation elements like icon buttons.
   * @default true
   */
  edge?: boolean;
}
export type WidgetThemeComponents = Pick<
  Components<Theme>,
  | 'MuiAppBar'
  | 'MuiAvatar'
  | 'MuiButton'
  | 'MuiCard'
  | 'MuiIconButton'
  | 'MuiInputCard'
  | 'MuiTabs'
>;
export type WidgetTheme = {
  palette?: Pick<
    PaletteOptions,
    'background' | 'grey' | 'primary' | 'secondary' | 'text'
  >;
  shape?: Partial<Shape>;
  typography?: TypographyOptions;
  components?: WidgetThemeComponents;
  container?: CSSProperties;
  playground?: CSSProperties;
  navigation?: NavigationProps;
};

export enum DisabledUI {
  FromAmount = 'fromAmount',
  FromToken = 'fromToken',
  ToAddress = 'toAddress',
  ToToken = 'toToken',
}
export type DisabledUIType = `${DisabledUI}`;

export enum HiddenUI {
  Appearance = 'appearance',
  DrawerCloseButton = 'drawerCloseButton',
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

export interface WidgetWalletConfig {
  onConnect?(): void;
  walletConnect?: WalletConnectParameters;
  coinbase?: CoinbaseWalletParameters;
}

export interface WidgetSDKConfig
  extends Omit<
    SDKConfig,
    | 'apiKey'
    | 'disableVersionCheck'
    | 'integrator'
    | 'routeOptions'
    | 'widgetVersion'
  > {
  routeOptions?: Omit<RouteOptions, 'bridges' | 'exchanges'>;
}

export interface WidgetContractTool {
  logoURI: string;
  name: string;
}

export interface ToAddress {
  name?: string;
  address: string;
  chainType: ChainType;
  logoURI?: string;
}

export interface AllowDeny<T> {
  allow?: T[];
  deny?: T[];
}

export interface WidgetConfig {
  fromChain?: number;
  toChain?: number;
  fromToken?: string;
  toToken?: string;
  toAddress?: ToAddress;
  toAddresses?: ToAddress[];
  fromAmount?: number | string;
  toAmount?: number | string;

  contractCalls?: ContractCall[];
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

  variant?: WidgetVariant;
  subvariant?: WidgetSubvariant;
  subvariantOptions?: SubvariantOptions;

  appearance?: Appearance;
  theme?: WidgetTheme;

  disabledUI?: DisabledUIType[];
  hiddenUI?: HiddenUIType[];
  requiredUI?: RequiredUIType[];
  useRecommendedRoute?: boolean;

  walletConfig?: WidgetWalletConfig;
  sdkConfig?: WidgetSDKConfig;

  buildUrl?: boolean;
  keyPrefix?: string;

  bridges?: AllowDeny<string>;
  exchanges?: AllowDeny<string>;
  chains?: {
    from?: AllowDeny<number>;
    to?: AllowDeny<number>;
    types?: AllowDeny<ChainType>;
  } & AllowDeny<number>;
  tokens?: {
    featured?: StaticToken[];
    include?: Token[];
    popular?: StaticToken[];
  } & AllowDeny<BaseToken>;
  languages?: {
    default?: LanguageKey;
  } & AllowDeny<LanguageKey>;
  languageResources?: LanguageResources;
}

export interface WidgetConfigProps {
  config: WidgetConfig;
}

export interface WidgetConfigPartialProps {
  config?: Partial<WidgetConfig>;
}

export type WidgetProps = WidgetDrawerProps &
  WidgetConfig &
  WidgetConfigPartialProps;

export interface WidgetDrawerProps extends WidgetConfigPartialProps {
  elementRef?: RefObject<HTMLDivElement>;
  open?: boolean;
  /**
   * Make sure to make the onClose callback stable (e.g. using useCallback) to avoid causing re-renders of the entire widget
   */
  onClose?(): void;
}
