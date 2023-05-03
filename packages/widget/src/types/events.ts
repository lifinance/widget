import type { Process, Route } from '@lifi/sdk';

export enum WidgetEvent {
  RouteExecutionStarted = 'routeExecutionStarted',
  RouteExecutionUpdated = 'routeExecutionUpdated',
  RouteExecutionCompleted = 'routeExecutionCompleted',
  RouteExecutionFailed = 'routeExecutionFailed',
  RouteHighValueLoss = 'highValueLoss',
}

export interface HighValueLossUpdate {
  fromAmountUsd: string;
  gasCostUSD: string | undefined;
  toAmountUSD: string;
  valueLoss: string;
}

export type WidgetEvents = {
  routeExecutionStarted: Route;
  routeExecutionUpdated: RouteExecutionUpdate;
  routeExecutionCompleted: Route;
  routeExecutionFailed: RouteExecutionUpdate;
  highValueLoss: HighValueLossUpdate;
};

export interface RouteExecutionUpdate {
  route: Route;
  process: Process;
}
