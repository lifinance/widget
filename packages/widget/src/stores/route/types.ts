import { Route } from '@lifi/sdk';

export interface RouteExecutionStore {
  routes: Record<string, RouteExecution>;
  setExecutableRoute: (route: Route) => void;
  updateRoute: (route: Route) => void;
  restartRoute: (routeId: string) => void;
  removeRoute: (routeId: string) => void;
}

export type RouteExecutionStatus = 'error' | 'idle' | 'loading' | 'success';

export interface RouteExecution {
  route: Route;
  status: RouteExecutionStatus;
}
