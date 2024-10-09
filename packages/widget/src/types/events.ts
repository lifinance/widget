import type { ChainId, ChainType, Process, Route } from '@lifi/sdk'

export enum WidgetEvent {
  RouteExecutionStarted = 'routeExecutionStarted',
  RouteExecutionUpdated = 'routeExecutionUpdated',
  RouteExecutionCompleted = 'routeExecutionCompleted',
  RouteExecutionFailed = 'routeExecutionFailed',
  RouteHighValueLoss = 'routeHighValueLoss',
  AvailableRoutes = 'availableRoutes',
  ContactSupport = 'contactSupport',
  SourceChainTokenSelected = 'sourceChainTokenSelected',
  DestinationChainTokenSelected = 'destinationChainTokenSelected',
  SendToWalletToggled = 'sendToWalletToggled',
  ReviewTransactionPageEntered = 'reviewTransactionPageEntered',
  /**
   * @deprecated use useWalletManagementEvents hook.
   */
  WalletConnected = 'walletConnected',
  WidgetExpanded = 'widgetExpanded',
}

export type WidgetEvents = {
  routeExecutionStarted: Route
  routeExecutionUpdated: RouteExecutionUpdate
  routeExecutionCompleted: Route
  routeExecutionFailed: RouteExecutionUpdate
  routeHighValueLoss: RouteHighValueLossUpdate
  availableRoutes: Route[]
  contactSupport: ContactSupport
  sourceChainTokenSelected: ChainTokenSelected
  destinationChainTokenSelected: ChainTokenSelected
  sendToWalletToggled: boolean
  reviewTransactionPageEntered?: Route
  /**
   * @deprecated use useWalletManagementEvents hook.
   */
  walletConnected: WalletConnected
  widgetExpanded: boolean
}

export interface ContactSupport {
  supportId?: string
}

export interface RouteHighValueLossUpdate {
  fromAmountUSD: number
  toAmountUSD: number
  gasCostUSD?: number
  feeCostUSD?: number
  valueLoss: number
}

export interface RouteExecutionUpdate {
  route: Route
  process: Process
}

export interface ChainTokenSelected {
  chainId: ChainId
  tokenAddress: string
}

export interface WalletConnected {
  address?: string
  chainId?: number
  chainType?: ChainType
}
