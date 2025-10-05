import type {
  BaseToken,
  ChainType,
  ContractCall,
  ExecutionOptions,
  ExtendedChain,
  Order,
  RouteExtended,
  RouteOptions,
  SDKConfig,
  StaticToken,
  Token,
} from '@lifi/sdk'
import type { WalletMenuOpenArgs } from '@lifi/wallet-management'
import type { WalletProviderProps } from '@lifi/wallet-provider'
import type {
  Components,
  PaletteMode,
  PaletteOptions,
  Shape,
  SxProps,
  Theme,
} from '@mui/material'
import type { TypographyVariantsOptions } from '@mui/material/styles'
import type {
  CSSProperties,
  FC,
  PropsWithChildren,
  ReactNode,
  RefObject,
} from 'react'
import type {
  BaseAccountParameters,
  CoinbaseWalletParameters,
  MetaMaskParameters,
  PortoParameters,
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
export type WideSubvariant = {
  enableChainSidebar?: boolean
}
export interface SubvariantOptions {
  split?: SplitSubvariant
  custom?: CustomSubvariant
  wide?: WideSubvariant
}

export type Appearance = PaletteMode | 'system'
export interface NavigationProps {
  /**
   * If given, uses a negative margin to counteract the padding on sides for navigation elements like icon buttons.
   * @default true
   */
  edge?: boolean
}
export type WidgetThemeComponents = Partial<
  Pick<
    Components<Theme>,
    | 'MuiAppBar'
    | 'MuiAvatar'
    | 'MuiButton'
    | 'MuiCard'
    | 'MuiIconButton'
    | 'MuiInputCard'
    | 'MuiNavigationTabs'
    | 'MuiNavigationTab'
    | 'MuiTabs'
    | 'MuiCheckbox'
  >
>

export type WidgetTheme = {
  /**
   * @deprecated Use `colorScheme` instead.
   */
  palette?: PaletteOptions
  colorSchemes?: {
    light?: {
      palette: PaletteOptions
    }
    dark?: {
      palette: PaletteOptions
    }
  }
  shape?: Partial<Shape>
  typography?: TypographyVariantsOptions
  components?: WidgetThemeComponents
  container?: CSSProperties
  routesContainer?: CSSProperties
  chainSidebarContainer?: CSSProperties
  header?: CSSProperties
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
  RouteTokenDescription = 'routeTokenDescription',
  ChainSelect = 'chainSelect',
  BridgesSettings = 'bridgesSettings',
  AddressBookConnectedWallets = 'addressBookConnectedWallets',
  LowAddressActivityConfirmation = 'lowAddressActivityConfirmation',
  GasRefuelMessage = 'gasRefuelMessage',
  SearchTokenInput = 'searchTokenInput',
  InsufficientGasMessage = 'insufficientGasMessage',
}
export type HiddenUIType = `${HiddenUI}`

export enum RequiredUI {
  ToAddress = 'toAddress',
  AccountDeployedMessage = 'accountDeployedMessage',
}
export type RequiredUIType = `${RequiredUI}`

export type DefaultUI = {
  transactionDetailsExpanded?: boolean
  navigationHeaderTitleNoWrap?: boolean
}

interface EVMWalletConfig {
  walletConnect?: WalletConnectParameters
  coinbase?: CoinbaseWalletParameters
  metaMask?: MetaMaskParameters
  baseAccount?: BaseAccountParameters
  porto?: Partial<PortoParameters>
}

export interface WidgetWalletConfig extends EVMWalletConfig {
  walletProviders?: FC<PropsWithChildren<WalletProviderProps>>[]
  walletEcosystemsOrder?: Record<string, ChainType[]>
  onConnect?(args?: WalletMenuOpenArgs): void
  /**
   * Determines whether the widget should provide partial wallet management functionality.
   *
   * In partial mode, external wallet management will be used for "opt-out" providers,
   * while the internal management is applied for any remaining providers that do not opt out.
   * This allows a flexible balance between the integrator's custom wallet menu and the widget's native wallet menu.
   * @default false
   */
  usePartialWalletManagement?: boolean
  /**
   * This option forces the widget to always use internal wallet management ignoring external wallet management contexts
   * @default false
   */
  forceInternalWalletManagement?: boolean
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
  executionOptions?: Pick<
    ExecutionOptions,
    'disableMessageSigning' | 'updateTransactionRequestHook'
  >
}

export interface WidgetContractTool {
  name: string
  logoURI: string
}

export interface CalculateFeeParams {
  fromChain: ExtendedChain
  toChain: ExtendedChain
  fromToken: Token
  toToken: Token
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
   * Whether to show the fee percentage in the fee details.
   * @default false
   */
  showFeePercentage?: boolean
  /**
   * Whether to show a tooltip with the fee details. Requires `name` or `feeTooltipComponent` to be set.
   * @default false
   */
  showFeeTooltip?: boolean
  /**
   * Custom tooltip component to show with the fee details.
   */
  feeTooltipComponent?: ReactNode
  /**
   * Function to calculate fees before fetching quotes.
   * If provided, this function will be used instead of the `fee` parameter.
   * Only one of `fee` or `calculateFee` should be used.
   *
   * @param params Object containing the fee calculation parameters
   * @returns A promise that resolves to the calculated fee as a number (e.g., 0.03 represents a 3% fee)
   */
  calculateFee?(params: CalculateFeeParams): Promise<number | undefined>
  /**
   * @internal
   */
  _vcComponent?: FC<{ route: RouteExtended }>
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

export type AllowDenySetItem = string | number
export interface AllowDenySet {
  allow?: Set<AllowDenySetItem>
  deny?: Set<AllowDenySetItem>
}

export type AllowDenySets = {
  from?: AllowDenySet
  to?: AllowDenySet
} & AllowDenySet

export type AllowDenyItems<T> = {
  from?: AllowDeny<T>
  to?: AllowDeny<T>
} & AllowDeny<T>

export type WidgetChains = {
  types?: AllowDeny<ChainType>
} & AllowDenyItems<number>

export type WidgetTokens = {
  featured?: StaticToken[]
  include?: Token[]
  popular?: StaticToken[]
} & AllowDenyItems<BaseToken>

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

export type ExplorerUrl =
  | string
  | {
      url: string
      txPath?: string
      addressPath?: string
    }

export interface WidgetConfig {
  fromChain?: number
  toChain?: number
  fromToken?: string
  toToken?: string
  toAddress?: ToAddress
  toAddresses?: ToAddress[]
  fromAmount?: number | string
  minFromAmountUSD?: number
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
  defaultUI?: DefaultUI
  useRecommendedRoute?: boolean
  useRelayerRoutes?: boolean

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
  explorerUrls?: Record<number, ExplorerUrl[]> &
    Partial<Record<'internal', ExplorerUrl[]>>
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

export type FormRef = RefObject<FormState | null>

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

export enum ExpansionType {
  Routes = 'routes',
  FromChain = 'fromChain',
  ToChain = 'toChain',
}
