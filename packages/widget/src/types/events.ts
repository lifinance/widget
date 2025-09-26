import type { ChainId, ChainType, Process, Route } from '@lifi/sdk'
import type { DefaultValues } from '../stores/form/types.js'
import type { SettingsProps } from '../stores/settings/types.js'
import type { NavigationRouteType } from '../utils/navigationRoutes.js'
import type { TokenAmount } from './token.js'

export enum WidgetEvent {
  AvailableRoutes = 'availableRoutes',
  ChainPinned = 'chainPinned',
  ContactSupport = 'contactSupport',
  DestinationChainTokenSelected = 'destinationChainTokenSelected',
  FormFieldChanged = 'formFieldChanged',
  LowAddressActivityConfirmed = 'lowAddressActivityConfirmed',
  PageEntered = 'pageEntered',
  /**
   * @deprecated Use `PageEntered` event instead.
   */
  ReviewTransactionPageEntered = 'reviewTransactionPageEntered',
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
}

export type WidgetEvents = {
  availableRoutes: Route[]
  chainPinned: ChainPinned
  contactSupport: ContactSupport
  destinationChainTokenSelected: ChainTokenSelected
  formFieldChanged: FormFieldChanged
  lowAddressActivityConfirmed: LowAddressActivityConfirmed
  pageEntered: NavigationRouteType
  reviewTransactionPageEntered?: Route
  routeExecutionCompleted: Route
  routeExecutionFailed: RouteExecutionUpdate
  routeExecutionStarted: Route
  routeExecutionUpdated: RouteExecutionUpdate
  routeHighValueLoss: RouteHighValueLossUpdate
  routeSelected: RouteSelected
  sendToWalletToggled: boolean
  settingUpdated: SettingUpdated
  sourceChainTokenSelected: ChainTokenSelected
  tokenSearch: TokenSearch
  walletConnected: WalletConnected
  widgetExpanded: boolean
}

export type ContactSupport = {
  supportId?: string
}

export type RouteHighValueLossUpdate = {
  fromAmountUSD: number
  toAmountUSD: number
  gasCostUSD?: number
  feeCostUSD?: number
  valueLoss: number
}

export type RouteExecutionUpdate = {
  route: Route
  process: Process
}

export type RouteSelected = {
  route: Route
  routes: Route[]
}

export type TokenSearch = {
  value: string
  tokens: TokenAmount[]
}

export type ChainTokenSelected = {
  chainId: ChainId
  tokenAddress: string
}

export type WalletConnected = {
  address?: string
  chainId?: number
  chainType?: ChainType
}

export type FormFieldChanged = {
  [K in keyof DefaultValues]: {
    fieldName: K
    newValue: DefaultValues[K]
    oldValue: DefaultValues[K]
  }
}[keyof DefaultValues]

export type SettingUpdated<
  K extends keyof SettingsProps = keyof SettingsProps,
> = {
  setting: K
  newValue: SettingsProps[K]
  oldValue: SettingsProps[K]
  newSettings: SettingsProps
  oldSettings: SettingsProps
}

export type ChainPinned = {
  chainId: number
  pinned: boolean
}

export type LowAddressActivityConfirmed = {
  address: string
  chainId: number
}
