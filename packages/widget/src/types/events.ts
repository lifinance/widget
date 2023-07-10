import type { ChainId, Process, Route } from '@lifi/sdk';

export enum WidgetEvent {
  RouteExecutionStarted = 'routeExecutionStarted',
  RouteExecutionUpdated = 'routeExecutionUpdated',
  RouteExecutionCompleted = 'routeExecutionCompleted',
  RouteExecutionFailed = 'routeExecutionFailed',
  RouteHighValueLoss = 'routeHighValueLoss',
  RouteContactSupport = 'routeContactSupport',
  SourceChainTokenSelected = 'sourceChainTokenSelected',
  DestinationChainTokenSelected = 'destinationChainTokenSelected',
}

export type WidgetEvents = {
  routeExecutionStarted: Route;
  routeExecutionUpdated: RouteExecutionUpdate;
  routeExecutionCompleted: Route;
  routeExecutionFailed: RouteExecutionUpdate;
  routeHighValueLoss: RouteHighValueLossUpdate;
  routeContactSupport: RouteContactSupport;
  sourceChainTokenSelected: ExecutionPathDetails;
  destinationChainTokenSelected: ExecutionPathDetails;
};

export interface RouteContactSupport {
  supportId?: string;
}

export interface RouteHighValueLossUpdate {
  fromAmountUsd: string;
  gasCostUSD?: string;
  toAmountUSD: string;
  valueLoss: string;
}

export interface RouteExecutionUpdate {
  route: Route;
  process: Process;
}

export interface ExecutionPathDetails {
  chainId: ChainId;
  tokenAddress: string;
}