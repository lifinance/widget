import { Route } from '@lifinance/sdk';

export interface RouteExecutionStore {
  currentRoute?: Route;
  routes: Record<string, RouteExecution>;
  setCurrentRoute: (route?: Route) => void;
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
