import type {
  BaseToken,
  ChainType,
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

export type WidgetVariant = 'default' | 'expandable' | 'drawer';
export type WidgetSubvariant = 'default' | 'split' | 'nft' | 'refuel';
export type SplitSubvariantOptions = 'bridge' | 'swap';

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

export interface WidgetWalletConfig {
  onConnect(): void;
  walletConnect?: WalletConnectParameters;
  coinbase?: CoinbaseWalletParameters;
}

export interface AllowDeny<T> {
  allow?: T[];
  deny?: T[];
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
  routeOptions?: Omit<RouteOptions, 'bridges' | 'exchanges' | 'insurance'>;
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

export interface ToAddress {
  name?: string;
  address: string;
  chainType: ChainType;
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
