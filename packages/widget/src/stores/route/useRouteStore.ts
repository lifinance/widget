import { Route } from '@lifi/sdk';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { RouteExecutionStore } from './types';

export const useRouteStore = create<RouteExecutionStore>()(
  persist(
    immer((set) => ({
      routes: {},
      setExecutableRoute: (route: Route) =>
        set((state: RouteExecutionStore) => {
          if (!state.routes[route.id]) {
            // clean previous idle routes that were not executed
            Object.keys(state.routes)
              .filter((routeId) => state.routes[routeId]?.status === 'idle')
              .forEach((routeId) => delete state.routes[routeId]);
            state.routes[route.id] = {
              route,
              status: 'idle',
            };
          }
        }),
      updateRoute: (route: Route) =>
        set((state: RouteExecutionStore) => {
          if (state.routes[route.id]) {
            state.routes[route.id]!.route = route;
            const isFailed = route.steps.some(
              (step) => step.execution?.status === 'FAILED',
            );
            if (isFailed) {
              state.routes[route.id]!.status = 'error';
              return;
            }
            const isDone = route.steps.every(
              (step) => step.execution?.status === 'DONE',
            );
            if (isDone) {
              state.routes[route.id]!.status = 'success';
              return;
            }
            const isLoading = route.steps.some((step) => step.execution);
            if (isLoading) {
              state.routes[route.id]!.status = 'loading';
            }
          }
        }),
      restartRoute: (routeId: string) =>
        set((state: RouteExecutionStore) => {
          state.routes[routeId]?.route.steps.forEach((step) => {
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
          state.routes[routeId]!.status = 'loading';
        }),
      deleteRoute: (routeId: string) =>
        set((state: RouteExecutionStore) => {
          if (state.routes[routeId]) {
            delete state.routes[routeId];
          }
        }),
    })),
    {
      name: 'li.fi-widget-routes',
      partialize: (state) => ({ routes: state.routes }),
    },
  ),
);
