import { Route } from '@lifinance/sdk';
import produce from 'immer';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import shallow from 'zustand/shallow';
import type { RouteExecutionStore } from './types';

export const useRouteStore = create<RouteExecutionStore>()(
  persist(
    (set) => ({
      routes: {},
      setCurrentRoute: (route?: Route) =>
        set(
          produce((state: RouteExecutionStore) => {
            state.currentRoute = route;
          }),
        ),
      setExecutableRoute: (route: Route) =>
        set(
          produce((state: RouteExecutionStore) => {
            if (!state.routes[route.id]) {
              // clean previous idle routes that were not executed
              Object.keys(state.routes)
                .filter((routeId) => state.routes[routeId].status === 'idle')
                .forEach((routeId) => delete state.routes[routeId]);
              state.routes[route.id] = {
                route,
                status: 'idle',
              };
              state.currentRoute = route;
            }
          }),
        ),
      updateRoute: (route: Route) =>
        set(
          produce((state: RouteExecutionStore) => {
            state.routes[route.id].route = route;
            const isFailed = route.steps.some(
              (step) => step.execution?.status === 'FAILED',
            );
            if (isFailed) {
              state.routes[route.id].status = 'error';
              return;
            }
            const isDone = route.steps.every(
              (step) => step.execution?.status === 'DONE',
            );
            if (isDone) {
              state.routes[route.id].status = 'success';
              return;
            }
            const isLoading = route.steps.some((step) => step.execution);
            if (isLoading) {
              state.routes[route.id].status = 'loading';
            }
          }),
        ),
      restartRoute: (routeId: string) =>
        set(
          produce((state: RouteExecutionStore) => {
            state.routes[routeId].route.steps.forEach((step) => {
              const stepHasFailed = step.execution?.status === 'FAILED';
              // check if the step has been cancelled which is a "failed" state
              const stepHasBeenCancelled = step.execution?.process.some(
                (process) => process.status === 'CANCELLED',
              );
              if (step.execution && (stepHasFailed || stepHasBeenCancelled)) {
                step.execution.status = 'RESUME';
                // remove last (failed) process
                step.execution.process.pop();
              }
            });
            state.routes[routeId].status = 'loading';
          }),
        ),
      removeRoute: (routeId: string) =>
        set(
          produce((state: RouteExecutionStore) => {
            if (state.routes[routeId]) {
              delete state.routes[routeId];
            }
          }),
        ),
    }),
    {
      name: 'li.fi-widget-executable-routes',
      partialize: (state) => ({ routes: state.routes }),
    },
  ),
);

export const useSetExecutableRoute = () => {
  return useRouteStore((state) => state.setExecutableRoute);
};

export const useExecutingRoutes = () => {
  return useRouteStore((state) =>
    Object.values(state.routes).filter(
      (route) => route.status === 'loading' || route.status === 'error',
    ),
  );
};

export const useCurrentRoute = (): [
  Route | undefined,
  (route?: Route) => void,
] => {
  return useRouteStore(
    (state) => [state.currentRoute, state.setCurrentRoute],
    shallow,
  );
};
