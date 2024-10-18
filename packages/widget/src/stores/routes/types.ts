import type { Route, RouteExtended } from '@lifi/sdk'

export interface RouteExecution {
  route: RouteExtended
  status: RouteExecutionStatus
}

export interface RouteExecutionState {
  routes: Partial<Record<string, RouteExecution>>
  setExecutableRoute: (route: Route, observableRouteIds?: string[]) => void
  updateRoute: (route: Route) => void
  restartRoute: (routeId: string) => void
  deleteRoute: (routeId: string) => void
  deleteRoutes: (type: 'completed' | 'active') => void
}

export enum RouteExecutionStatus {
  Idle = 1 << 0,
  Pending = 1 << 1,
  Done = 1 << 2,
  Failed = 1 << 3,
  Partial = 1 << 4,
  Refunded = 1 << 5,
}
