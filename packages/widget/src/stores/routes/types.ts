import type { Route } from '@lifi/sdk';

export interface RouteExecutionStore {
  routes: Partial<Record<string, RouteExecution>>;
  setExecutableRoute: (route: Route) => void;
  updateRoute: (route: Route) => void;
  restartRoute: (routeId: string) => void;
  deleteRoute: (routeId: string) => void;
  deleteRoutes: (type: 'completed' | 'active') => void;
}

export type RouteExecutionStatus =
  | 'error'
  | 'idle'
  | 'loading'
  | 'success'
  | 'warning';

export interface RouteExecution {
  route: Route;
  status: RouteExecutionStatus;
}

export interface RecommendedRouteStore {
  recommendedRoute?: Route;
  setRecommendedRoute: (route?: Route) => void;
}
