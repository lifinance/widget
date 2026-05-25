import type { ChainId, ChainType, ExecutionAction, Route } from '@lifi/sdk'
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
  availableRoutes: (data: Route[]) => void
  chainPinned: (data: ChainPinned) => void
  contactSupport: (data: ContactSupport) => void
  destinationChainTokenSelected: (data: ChainTokenSelected) => void
  formFieldChanged: (data: FormFieldChanged) => void
  lowAddressActivityConfirmed: (data: LowAddressActivityConfirmed) => void
  pageEntered: (data: NavigationRouteType) => void
  routeExecutionCompleted: (data: Route) => void
  routeExecutionFailed: (data: RouteExecutionUpdate) => void
  routeExecutionStarted: (data: Route) => void
  routeExecutionUpdated: (data: RouteExecutionUpdate) => void
  routeHighValueLoss: (data: RouteHighValueLossUpdate) => void
  routeSelected: (data: RouteSelected) => void
  sendToWalletToggled: (data: boolean) => void
  settingUpdated: (data: SettingUpdated) => void
  sourceChainTokenSelected: (data: ChainTokenSelected) => void
  tokenSearch: (data: TokenSearch) => void
  widgetExpanded: (data: boolean) => void
}

// Compile-time invariant: WidgetEvent enum values and keyof WidgetEvents
// must stay in lockstep. Adding to one without the other fails the build.
type Exact<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false
const _eventEnumMatchesEventMap: Exact<`${WidgetEvent}`, keyof WidgetEvents> =
  true
void _eventEnumMatchesEventMap

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
  action: ExecutionAction
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
