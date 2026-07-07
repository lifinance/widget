// ============================================================================
// Serializable subset of WidgetConfig for the postMessage boundary.
// Zero external dependencies — all types are self-contained.
// ============================================================================

// ---------------------------------------------------------------------------
// Chain type (mirrors ChainType from @lifi/types)
// ---------------------------------------------------------------------------

export type WidgetChainType = 'EVM' | 'SVM' | 'MVM' | 'UTXO' | 'TVM'

// ---------------------------------------------------------------------------
// Token primitives (mirrors BaseToken, StaticToken, Token from @lifi/types)
// ---------------------------------------------------------------------------

export interface WidgetBaseToken {
  chainId: number
  address: string
}

export interface WidgetStaticToken extends WidgetBaseToken {
  symbol: string
  decimals: number
  name: string
  coinKey?: string
  logoURI?: string
  tags?: string[]
}

export interface WidgetToken extends WidgetStaticToken {
  priceUSD: string
}

// ---------------------------------------------------------------------------
// AllowDeny (mirrors AllowDeny<T> from widget)
// ---------------------------------------------------------------------------

export interface WidgetAllowDeny<T> {
  allow?: T[]
  deny?: T[]
}

// ---------------------------------------------------------------------------
// ContractCall (mirrors ContractCall from @lifi/types)
// ---------------------------------------------------------------------------

export interface WidgetContractCall {
  fromAmount: string
  fromTokenAddress: string
  toContractAddress: string
  toContractCallData: string
  toContractGasLimit: string
  toApprovalAddress?: string
  toTokenAddress?: string
}

// ---------------------------------------------------------------------------
// ToAddress (mirrors ToAddress from widget)
// ---------------------------------------------------------------------------

export interface WidgetToAddress {
  name?: string
  address: string
  chainType: WidgetChainType
  logoURI?: string
}

// ---------------------------------------------------------------------------
// Widget variant / mode
// ---------------------------------------------------------------------------

export type WidgetVariant = 'compact' | 'wide' | 'drawer'
export type WidgetMode = 'default' | 'split' | 'custom' | 'refuel'
export type WidgetSplitMode = 'bridge' | 'swap'
export type WidgetCustomMode = 'checkout' | 'deposit'

export interface WidgetSplitModeOptions {
  defaultTab: WidgetSplitMode
}

export interface WidgetModeOptions {
  split?: WidgetSplitMode | WidgetSplitModeOptions
  custom?: { type: WidgetCustomMode }
}

// ---------------------------------------------------------------------------
// Appearance
// ---------------------------------------------------------------------------

export type WidgetAppearance = 'light' | 'dark' | 'system'

// ---------------------------------------------------------------------------
// Theme — serializable subset only.
// Excluded: palette, colorSchemes, shape, typography, components (all MUI)
// ---------------------------------------------------------------------------

export type WidgetCSSProperties = Record<string, string | number | undefined>

export interface WidgetNavigationProps {
  /** @default true */
  edge?: boolean
}

export interface WidgetTheme {
  container?: WidgetCSSProperties
  routesContainer?: WidgetCSSProperties
  chainSidebarContainer?: WidgetCSSProperties
  header?: WidgetCSSProperties
  navigation?: WidgetNavigationProps
}

// ---------------------------------------------------------------------------
// UI controls (mirrors DisabledUIConfig, HiddenUIConfig, RequiredUIConfig)
// ---------------------------------------------------------------------------

export interface WidgetDisabledUIConfig {
  fromAmount?: boolean
  fromToken?: boolean
  toAddress?: boolean
  toToken?: boolean
}

export interface WidgetHiddenUIConfig {
  addressBookConnectedWallets?: boolean
  allNetworks?: boolean
  appearance?: boolean
  bridgesSettings?: boolean
  chainSelect?: boolean
  /**
   * Hide the chain sidebar in the `wide` variant. No effect in other variants.
   * @default false
   */
  chainSidebar?: boolean
  contactSupport?: boolean
  /**
   * Hide the drawer close button. Only meaningful when `variant === 'drawer'`.
   * @default false
   */
  drawerCloseButton?: boolean
  fromToken?: boolean
  gasRefuelMessage?: boolean
  hideSmallBalances?: boolean
  history?: boolean
  insufficientGasMessage?: boolean
  integratorStepDetails?: boolean
  language?: boolean
  /**
   * Hide the warning shown when sending to an address with low historical
   * on-chain activity (low transaction count or contract-like behavior).
   * @default false
   */
  lowAddressActivityConfirmation?: boolean
  poweredBy?: boolean
  reverseTokensButton?: boolean
  routeCardPriceImpact?: boolean
  routeTokenDescription?: boolean
  searchTokenInput?: boolean
  toAddress?: boolean
  toToken?: boolean
  walletMenu?: boolean
}

export interface WidgetRequiredUIConfig {
  accountDeployedMessage?: boolean
  toAddress?: boolean
}

export interface WidgetDefaultUI {
  transactionDetailsExpanded?: boolean
  navigationHeaderTitleNoWrap?: boolean
}

// ---------------------------------------------------------------------------
// Route priority (mirrors Order from @lifi/types)
// ---------------------------------------------------------------------------

export type WidgetRoutePriority =
  | 'RECOMMENDED'
  | 'FASTEST'
  | 'CHEAPEST'
  | 'SAFEST'

// ---------------------------------------------------------------------------
// Languages
// ---------------------------------------------------------------------------

export type WidgetLanguageKey =
  | 'en'
  | 'es'
  | 'fr'
  | 'de'
  | 'it'
  | 'pt'
  | 'ja'
  | 'ko'
  | 'zh'
  | 'hi'
  | 'bn'
  | 'th'
  | 'vi'
  | 'tr'
  | 'uk'
  | 'id'
  | 'pl'

export interface WidgetLanguages {
  default?: WidgetLanguageKey
  allow?: WidgetLanguageKey[]
  deny?: WidgetLanguageKey[]
}

export type WidgetLanguageResources = Record<string, Record<string, unknown>>

// ---------------------------------------------------------------------------
// Chain filtering (mirrors WidgetChains)
// ---------------------------------------------------------------------------

export type WidgetChains = {
  types?: WidgetAllowDeny<WidgetChainType>
  from?: WidgetAllowDeny<number>
  to?: WidgetAllowDeny<number>
} & WidgetAllowDeny<number>

// ---------------------------------------------------------------------------
// Token filtering (mirrors WidgetTokens)
// ---------------------------------------------------------------------------

export type WidgetTokens = {
  featured?: WidgetStaticToken[]
  include?: WidgetToken[]
  popular?: WidgetStaticToken[]
  verified?: WidgetBaseToken[]
  from?: WidgetAllowDeny<WidgetBaseToken>
  to?: WidgetAllowDeny<WidgetBaseToken>
} & WidgetAllowDeny<WidgetBaseToken>

// ---------------------------------------------------------------------------
// Fee configuration — serializable subset.
// Excluded: feeTooltipComponent (ReactNode), calculateFee (fn)
// ---------------------------------------------------------------------------

export interface WidgetFeeConfig {
  name?: string
  logoURI?: string
  fee?: number
  /** @default false */
  showFeePercentage?: boolean
  /** @default false */
  showFeeTooltip?: boolean
}

// ---------------------------------------------------------------------------
// Wallet configuration — serializable subset.
// Excluded: onConnect (callback)
// ---------------------------------------------------------------------------

export interface WidgetWalletConfig {
  walletEcosystemsOrder?: Record<string, WidgetChainType[]>
  /** @default false */
  usePartialWalletManagement?: boolean
  /** @default false */
  forceInternalWalletManagement?: boolean
  /**
   * When true, the widget inside the iframe will send a CONNECT_WALLET_REQUEST
   * message to the host instead of opening its internal wallet menu.
   * Set automatically by the host when `onConnect` is provided.
   * @internal
   */
  useExternalWalletManagement?: boolean
}

// ---------------------------------------------------------------------------
// SDK configuration — serializable subset.
// Excluded: executionOptions hooks, requestInterceptor, storage
// ---------------------------------------------------------------------------

export interface WidgetRouteOptions {
  maxPriceImpact?: number
  allowSwitchChain?: boolean
  allowDestinationCall?: boolean
  bridges?: { allow?: string[]; deny?: string[]; prefer?: string[] }
  exchanges?: { allow?: string[]; deny?: string[]; prefer?: string[] }
  jitoBundle?: boolean
}

export interface WidgetSDKConfig {
  apiUrl?: string
  userId?: string
  rpcUrls?: Record<number, string[]>
  routeOptions?: WidgetRouteOptions
  preloadChains?: boolean
  chainsRefetchInterval?: number
}

// ---------------------------------------------------------------------------
// ExplorerUrl (mirrors ExplorerUrl)
// ---------------------------------------------------------------------------

export type WidgetExplorerUrl =
  | string
  | {
      url: string
      txPath?: string
      addressPath?: string
    }

// ---------------------------------------------------------------------------
// Route labels — serializable subset.
// Excluded: RouteLabel.sx (SxProps<Theme>), RouteLabelRule.match (function)
// ---------------------------------------------------------------------------

export interface WidgetRouteLabel {
  text: string
}

export interface WidgetRouteLabelRule {
  label: WidgetRouteLabel
  bridges?: WidgetAllowDeny<string>
  exchanges?: WidgetAllowDeny<string>
  fromChainId?: number[]
  toChainId?: number[]
  fromTokenAddress?: string[]
  toTokenAddress?: string[]
}

// ---------------------------------------------------------------------------
// Contract tool
// ---------------------------------------------------------------------------

export interface WidgetContractTool {
  name: string
  logoURI: string
}

export type WidgetPoweredBy = 'default' | 'jumper'

// ============================================================================
// WidgetLightConfig — the primary export
// ============================================================================

export interface WidgetLightConfig {
  // -- Required --
  integrator: string

  // -- Chain / token selection --
  fromChain?: number
  toChain?: number
  fromToken?: string
  toToken?: string
  toAddress?: WidgetToAddress
  toAddresses?: WidgetToAddress[]
  fromAmount?: number | string
  toAmount?: number | string
  minFromAmountUSD?: number
  formUpdateKey?: string

  // -- Contract calls --
  contractCalls?: WidgetContractCall[]
  contractTool?: WidgetContractTool

  // -- API / fees --
  apiKey?: string
  feeConfig?: WidgetFeeConfig
  referrer?: string

  // -- Routing --
  routePriority?: WidgetRoutePriority
  slippage?: number

  // -- Layout --
  variant?: WidgetVariant
  mode?: WidgetMode
  modeOptions?: WidgetModeOptions

  // -- Appearance --
  appearance?: WidgetAppearance
  theme?: WidgetTheme

  // -- UI controls --
  disabledUI?: WidgetDisabledUIConfig
  hiddenUI?: WidgetHiddenUIConfig
  requiredUI?: WidgetRequiredUIConfig
  defaultUI?: WidgetDefaultUI
  /**
   * When true, shows only the recommended route and hides the route
   * selector UI. Distinct from `routePriority`, which sets the SDK
   * ranking order across multiple displayed routes.
   * @default false
   */
  showSingleRoute?: boolean
  useRelayerRoutes?: boolean

  // -- Wallet / SDK --
  walletConfig?: WidgetWalletConfig
  sdkConfig?: WidgetSDKConfig

  // -- URL / storage --
  buildUrl?: boolean
  keyPrefix?: string

  // -- Allow/deny lists --
  bridges?: WidgetAllowDeny<string>
  exchanges?: WidgetAllowDeny<string>
  chains?: WidgetChains
  tokens?: WidgetTokens

  // -- i18n --
  languages?: WidgetLanguages
  languageResources?: WidgetLanguageResources

  // -- Misc --
  explorerUrls?: Record<number, WidgetExplorerUrl[]> &
    Partial<Record<'internal', WidgetExplorerUrl[]>>
  poweredBy?: WidgetPoweredBy
  routeLabels?: WidgetRouteLabelRule[]
}
