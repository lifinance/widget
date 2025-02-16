import type {
  BaseToken,
  ChainType,
  ContractCall,
  Order,
  RouteOptions,
  SDKConfig,
  StaticToken,
  Token,
} from '@lifi/sdk'
import type {
  Components,
  PaletteMode,
  PaletteOptions,
  Shape,
  SxProps,
  Theme,
} from '@mui/material'
import type { TypographyOptions } from '@mui/material/styles/createTypography.js'
import type {
  CSSProperties,
  MutableRefObject,
  ReactNode,
  RefObject,
} from 'react'
import type {
  CoinbaseWalletParameters,
  MetaMaskParameters,
  WalletConnectParameters,
} from 'wagmi/connectors'
import type {
  LanguageKey,
  LanguageResources,
} from '../providers/I18nProvider/types.js'
import type { DefaultFieldValues } from '../stores/form/types.js'

export type WidgetVariant = 'compact' | 'wide' | 'drawer'
export type WidgetSubvariant = 'default' | 'split' | 'custom' | 'refuel'
export type SplitSubvariant = 'bridge' | 'swap'
export type CustomSubvariant = 'checkout' | 'deposit'
export interface SubvariantOptions {
  split?: SplitSubvariant
  custom?: CustomSubvariant
}

export type Appearance = PaletteMode | 'auto'
export interface NavigationProps {
  /**
   * If given, uses a negative margin to counteract the padding on sides for navigation elements like icon buttons.
   * @default true
   */
  edge?: boolean
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
>

export type WidgetTheme = {
  palette?: Pick<
    PaletteOptions,
    'background' | 'grey' | 'primary' | 'secondary' | 'text'
  >
  shape?: Partial<Shape>
  typography?: TypographyOptions
  components?: WidgetThemeComponents
  container?: CSSProperties
  header?: CSSProperties
  playground?: CSSProperties
  navigation?: NavigationProps
}

export enum DisabledUI {
  FromAmount = 'fromAmount',
  FromToken = 'fromToken',
  ToAddress = 'toAddress',
  ToToken = 'toToken',
}
export type DisabledUIType = `${DisabledUI}`

export enum HiddenUI {
  Appearance = 'appearance',
  DrawerCloseButton = 'drawerCloseButton',
  History = 'history',
  Language = 'language',
  PoweredBy = 'poweredBy',
  ToAddress = 'toAddress',
  ToToken = 'toToken',
  WalletMenu = 'walletMenu',
  IntegratorStepDetails = 'integratorStepDetails',
  ReverseTokensButton = 'reverseTokensButton',
}
export type HiddenUIType = `${HiddenUI}`

export enum RequiredUI {
  ToAddress = 'toAddress',
}
export type RequiredUIType = `${RequiredUI}`

export interface WidgetWalletConfig {
  onConnect?(): void
  walletConnect?: WalletConnectParameters
  coinbase?: CoinbaseWalletParameters
  metaMask?: MetaMaskParameters
  /**
   * Determines whether the widget should provide partial wallet management functionality.
   *
   * In partial mode, external wallet management will be used for "opt-out" providers,
   * while the internal management is applied for any remaining providers that do not opt out.
   * This allows a flexible balance between the integrator’s custom wallet menu and the widget’s native wallet menu.
   * @default false
   */
  usePartialWalletManagement?: boolean
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
  routeOptions?: Omit<RouteOptions, 'bridges' | 'exchanges'>
}

export interface WidgetContractTool {
  name: string
  logoURI: string
}

export interface CalculateFeeParams {
  fromChainId: number
  toChainId: number
  fromTokenAddress: string
  toTokenAddress: string
  fromAddress?: string
  toAddress?: string
  fromAmount?: bigint
  toAmount?: bigint
  slippage?: number
}

export interface WidgetFeeConfig {
  name?: string
  logoURI?: string
  fee?: number
  /**
   * Function to calculate fees before fetching quotes.
   * If provided, this function will be used instead of the `fee` parameter.
   * Only one of `fee` or `calculateFee` should be used.
   *
   * @param params Object containing the fee calculation parameters
   * @returns A promise that resolves to the calculated fee as a number (e.g., 0.03 represents a 3% fee)
   */
  calculateFee?(params: CalculateFeeParams): Promise<number | undefined>
}

export interface ToAddress {
  name?: string
  address: string
  chainType: ChainType
  logoURI?: string
}

export interface AllowDeny<T> {
  allow?: T[]
  deny?: T[]
}

export type WidgetChains = {
  from?: AllowDeny<number>
  to?: AllowDeny<number>
  types?: AllowDeny<ChainType>
} & AllowDeny<number>

export type WidgetTokens = {
  featured?: StaticToken[]
  include?: Token[]
  popular?: StaticToken[]
} & AllowDeny<BaseToken>

export type WidgetLanguages = {
  default?: LanguageKey
} & AllowDeny<LanguageKey>

export type PoweredByType = 'default' | 'jumper'

export interface RouteLabel {
  text: string
  sx?: SxProps<Theme>
}

export interface RouteLabelRule {
  label: RouteLabel
  // Matching criteria
  bridges?: AllowDeny<string>
  exchanges?: AllowDeny<string>
  fromChainId?: number[]
  toChainId?: number[]
  fromTokenAddress?: string[]
  toTokenAddress?: string[]
}

export interface WidgetConfig {
  fromChain?: number
  toChain?: number
  fromToken?: string
  toToken?: string
  toAddress?: ToAddress
  toAddresses?: ToAddress[]
  fromAmount?: number | string
  toAmount?: number | string
  formUpdateKey?: string

  contractCalls?: ContractCall[]
  contractComponent?: ReactNode
  contractSecondaryComponent?: ReactNode
  contractCompactComponent?: ReactNode
  contractTool?: WidgetContractTool
  integrator: string
  apiKey?: string
  fee?: number
  feeConfig?: WidgetFeeConfig
  referrer?: string

  routePriority?: Order
  slippage?: number

  variant?: WidgetVariant
  subvariant?: WidgetSubvariant
  subvariantOptions?: SubvariantOptions

  appearance?: Appearance
  theme?: WidgetTheme

  disabledUI?: DisabledUIType[]
  hiddenUI?: HiddenUIType[]
  requiredUI?: RequiredUIType[]
  useRecommendedRoute?: boolean

  walletConfig?: WidgetWalletConfig
  sdkConfig?: WidgetSDKConfig

  buildUrl?: boolean
  keyPrefix?: string

  bridges?: AllowDeny<string>
  exchanges?: AllowDeny<string>
  chains?: WidgetChains
  tokens?: WidgetTokens
  languages?: WidgetLanguages
  languageResources?: LanguageResources
  explorerUrls?: Record<number, string[]> &
    Partial<Record<'internal', string[]>>
  poweredBy?: PoweredByType

  /**
   * Custom labels/badges to show on routes based on specified rules
   */
  routeLabels?: RouteLabelRule[]
}

export interface FormFieldOptions {
  setUrlSearchParam: boolean
}

export interface FieldValues
  extends Omit<DefaultFieldValues, 'fromAmount' | 'toAmount' | 'toAddress'> {
  fromAmount?: number | string
  toAmount?: number | string
  toAddress?: ToAddress | string
}

export type FieldNames = keyof FieldValues

export type SetFieldValueFunction = <K extends FieldNames>(
  key: K,
  value: FieldValues[K],
  options?: FormFieldOptions
) => void

export type FormState = {
  setFieldValue: SetFieldValueFunction
}

export type FormRef = MutableRefObject<FormState | null>

export interface FormRefProps {
  formRef?: FormRef
}

export interface WidgetConfigProps extends FormRefProps {
  config: WidgetConfig
}

export interface WidgetConfigPartialProps {
  config?: Partial<WidgetConfig>
}

export type WidgetProps = WidgetDrawerProps &
  WidgetConfig &
  WidgetConfigPartialProps &
  FormRefProps

export interface WidgetDrawerProps extends WidgetConfigPartialProps {
  elementRef?: RefObject<HTMLDivElement>
  open?: boolean
  /**
   * Make sure to make the onClose callback stable (e.g. using useCallback) to avoid causing re-renders of the entire widget
   */
  onClose?(): void
}
