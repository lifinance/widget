// ============================================================================
// Serializable event types for the widget-light iframe bridge.
// Zero external dependencies — all types are self-contained.
//
// Mirrors WidgetEvent from @lifi/widget + WalletManagement events.
// Route-carrying payloads use `unknown` — host consumers cast to their
// local @lifi/sdk types.
// ============================================================================

// ---------------------------------------------------------------------------
// Event name enum
// ---------------------------------------------------------------------------

export enum WidgetLightEvent {
  AvailableRoutes = 'availableRoutes',
  ChainPinned = 'chainPinned',
  ContactSupport = 'contactSupport',
  DestinationChainTokenSelected = 'destinationChainTokenSelected',
  FormFieldChanged = 'formFieldChanged',
  LowAddressActivityConfirmed = 'lowAddressActivityConfirmed',
  PageEntered = 'pageEntered',
  RouteExecutionCompleted = 'routeExecutionCompleted',
  RouteExecutionFailed = 'routeExecutionFailed',
  RouteExecutionStarted = 'routeExecutionStarted',
  RouteExecutionUpdated = 'routeExecutionUpdated',
  RouteHighValueLoss = 'routeHighValueLoss',
  RouteSelected = 'routeSelected',
  SendToWalletToggled = 'sendToWalletToggled',
  SettingUpdated = 'settingUpdated',
  SourceChainTokenSelected = 'sourceChainTokenSelected',
  TokenSearch = 'tokenSearch',
  WidgetExpanded = 'widgetExpanded',
  // From @lifi/wallet-management
  WalletConnected = 'walletConnected',
  WalletDisconnected = 'walletDisconnected',
}

// ---------------------------------------------------------------------------
// Payload types
// ---------------------------------------------------------------------------

export interface WidgetLightContactSupport {
  supportId?: string
}

export interface WidgetLightChainTokenSelected {
  chainId: number
  tokenAddress: string
}

export interface WidgetLightChainPinned {
  chainId: number
  pinned: boolean
}

export interface WidgetLightLowAddressActivityConfirmed {
  address: string
  chainId: number
}

export interface WidgetLightRouteHighValueLoss {
  fromAmountUSD: number
  toAmountUSD: number
  gasCostUSD?: number
  feeCostUSD?: number
  valueLoss: number
}

export interface WidgetLightRouteExecutionUpdate {
  route: unknown
  action: unknown
}

export interface WidgetLightRouteSelected {
  route: unknown
  routes: unknown[]
}

export interface WidgetLightTokenSearch {
  value: string
  tokens: unknown[]
}

export interface WidgetLightFormFieldChanged {
  fieldName: string
  newValue: unknown
  oldValue: unknown
}

export interface WidgetLightSettingUpdated {
  setting: string
  newValue: unknown
  oldValue: unknown
  newSettings: Record<string, unknown>
  oldSettings: Record<string, unknown>
}

export interface WidgetLightWalletConnected {
  address: string
  chainId: number
  chainType: string
  connectorId: string
  connectorName: string
}

export interface WidgetLightWalletDisconnected {
  address?: string
  chainId?: number
  chainType: string
  connectorId?: string
  connectorName?: string
}

// ---------------------------------------------------------------------------
// Event map
// ---------------------------------------------------------------------------

export interface WidgetLightEvents {
  availableRoutes: unknown[]
  chainPinned: WidgetLightChainPinned
  contactSupport: WidgetLightContactSupport
  destinationChainTokenSelected: WidgetLightChainTokenSelected
  formFieldChanged: WidgetLightFormFieldChanged
  lowAddressActivityConfirmed: WidgetLightLowAddressActivityConfirmed
  pageEntered: string
  routeExecutionCompleted: unknown
  routeExecutionFailed: WidgetLightRouteExecutionUpdate
  routeExecutionStarted: unknown
  routeExecutionUpdated: WidgetLightRouteExecutionUpdate
  routeHighValueLoss: WidgetLightRouteHighValueLoss
  routeSelected: WidgetLightRouteSelected
  sendToWalletToggled: boolean
  settingUpdated: WidgetLightSettingUpdated
  sourceChainTokenSelected: WidgetLightChainTokenSelected
  tokenSearch: WidgetLightTokenSearch
  widgetExpanded: boolean
  walletConnected: WidgetLightWalletConnected
  walletDisconnected: WidgetLightWalletDisconnected
}
