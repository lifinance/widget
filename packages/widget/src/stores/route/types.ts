import { Route } from '@lifi/sdk';

export interface RouteExecutionStore {
  routes: Partial<Record<string, RouteExecution>>;
  setExecutableRoute: (route: Route) => void;
  updateRoute: (route: Route) => void;
  restartRoute: (routeId: string) => void;
  deleteRoute: (routeId: string) => void;
  deleteRoutes: () => void;
}

export type RouteExecutionStatus = 'error' | 'idle' | 'loading' | 'success';

export interface RouteExecution {
  route: Route;
  status: RouteExecutionStatus;
}
