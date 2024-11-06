import type { ChainId, ChainType, Process, Route } from '@lifi/sdk'
import type { DefaultValues } from '../stores/form/types.js'
import type { SettingsProps } from '../stores/settings/types.js'
import type { NavigationRouteType } from '../utils/navigationRoutes.js'
import type { TokenAmount } from './token.js'

export enum WidgetEvent {
  RouteExecutionStarted = 'routeExecutionStarted',
  RouteExecutionUpdated = 'routeExecutionUpdated',
  RouteExecutionCompleted = 'routeExecutionCompleted',
  RouteExecutionFailed = 'routeExecutionFailed',
  RouteHighValueLoss = 'routeHighValueLoss',
  RouteSelected = 'routeSelected',
  AvailableRoutes = 'availableRoutes',
  ContactSupport = 'contactSupport',
  SourceChainTokenSelected = 'sourceChainTokenSelected',
  DestinationChainTokenSelected = 'destinationChainTokenSelected',
  SendToWalletToggled = 'sendToWalletToggled',
  /**
   * @deprecated Use `PageEntered` event instead.
   */
  ReviewTransactionPageEntered = 'reviewTransactionPageEntered',
  /**
   * @deprecated use useWalletManagementEvents hook.
   */
  WalletConnected = 'walletConnected',
  WidgetExpanded = 'widgetExpanded',
  PageEntered = 'pageEntered',
  FormFieldChanged = 'formFieldChanged',
  SettingUpdated = 'settingUpdated',
  TokenSearch = 'tokenSearch',
}

export type WidgetEvents = {
  routeExecutionStarted: Route
  routeExecutionUpdated: RouteExecutionUpdate
  routeExecutionCompleted: Route
  routeExecutionFailed: RouteExecutionUpdate
  routeHighValueLoss: RouteHighValueLossUpdate
  routeSelected: RouteSelected
  availableRoutes: Route[]
  contactSupport: ContactSupport
  sourceChainTokenSelected: ChainTokenSelected
  destinationChainTokenSelected: ChainTokenSelected
  sendToWalletToggled: boolean
  formFieldChanged: FormFieldChanged
  reviewTransactionPageEntered?: Route
  walletConnected: WalletConnected
  widgetExpanded: boolean
  pageEntered: NavigationRouteType
  settingUpdated: SettingUpdated
  tokenSearch: TokenSearch
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
