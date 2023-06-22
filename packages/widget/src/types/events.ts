import type { Process, Route } from '@lifi/sdk';

export enum WidgetEvent {
  RouteExecutionStarted = 'routeExecutionStarted',
  RouteExecutionUpdated = 'routeExecutionUpdated',
  RouteExecutionCompleted = 'routeExecutionCompleted',
  RouteExecutionFailed = 'routeExecutionFailed',
  RouteHighValueLoss = 'routeHighValueLoss',
  SafeRouteInitiated = 'safeRouteInitiated',
}

export type WidgetEvents = {
  routeExecutionStarted: Route;
  routeExecutionUpdated: RouteExecutionUpdate;
  routeExecutionCompleted: Route;
  routeExecutionFailed: RouteExecutionUpdate;
  routeHighValueLoss: RouteHighValueLossUpdate;
  safeRouteInitiated: Route;
};

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
