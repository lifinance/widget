import type { ChainId, ChainType, Process, Route } from '@lifi/sdk';
import type {
  FormFieldNames,
  GenericFormValue,
} from '@lifi/widget/stores/form/types.js';
import type { NavigationRouteType } from '../utils/navigationRoutes.js';

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
  /**
   * @deprecated Use `PageEntered` event instead.
   */
  ReviewTransactionPageEntered = 'reviewTransactionPageEntered',
  WalletConnected = 'walletConnected',
  WidgetExpanded = 'widgetExpanded',
  PageEntered = 'pageEntered',
  FormFieldChanged = 'formFieldChanged',
}

export type WidgetEvents = {
  routeExecutionStarted: Route;
  routeExecutionUpdated: RouteExecutionUpdate;
  routeExecutionCompleted: Route;
  routeExecutionFailed: RouteExecutionUpdate;
  routeHighValueLoss: RouteHighValueLossUpdate;
  availableRoutes: Route[];
  contactSupport: ContactSupport;
  sourceChainTokenSelected: ChainTokenSelected;
  destinationChainTokenSelected: ChainTokenSelected;
  sendToWalletToggled: boolean;
  formFieldChanged: FormFieldChanged;
  reviewTransactionPageEntered?: Route;
  walletConnected: WalletConnected;
  widgetExpanded: boolean;
  pageEntered: NavigationRouteType;
};

export interface ContactSupport {
  supportId?: string;
}

export interface RouteHighValueLossUpdate {
  fromAmountUSD: number;
  toAmountUSD: number;
  gasCostUSD?: number;
  feeCostUSD?: number;
  valueLoss: number;
}

export interface RouteExecutionUpdate {
  route: Route;
  process: Process;
}

export interface ChainTokenSelected {
  chainId: ChainId;
  tokenAddress: string;
}

export interface WalletConnected {
  address?: string;
  chainId?: number;
  chainType?: ChainType;
}

export interface FormFieldChanged {
  fieldName: FormFieldNames;
  value: GenericFormValue;
  oldValue: GenericFormValue;
}
