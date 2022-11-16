import type { Route } from '@lifi/sdk';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { hasEnumFlag } from '../../utils';
import type { RouteExecutionStore } from './types';
import { RouteExecutionStatus } from './types';
import {
  isRouteDone,
  isRouteFailed,
  isRoutePartiallyDone,
  isRouteRefunded,
} from './utils';

export const useRouteExecutionStore = create<RouteExecutionStore>()(
  persist(
    immer((set) => ({
      routes: {},
      setExecutableRoute: (route: Route) =>
        set((state: RouteExecutionStore) => {
          if (!state.routes[route.id]) {
            // clean previous idle routes that were not executed
            Object.keys(state.routes)
              .filter(
                (routeId) =>
                  state.routes[routeId]?.status === RouteExecutionStatus.Idle,
              )
              .forEach((routeId) => delete state.routes[routeId]);
            state.routes[route.id] = {
              route,
              status: RouteExecutionStatus.Idle,
            };
          }
        }),
      updateRoute: (route: Route) =>
        set((state: RouteExecutionStore) => {
          if (state.routes[route.id]) {
            state.routes[route.id]!.route = route;
            const isFailed = isRouteFailed(route);
            if (isFailed) {
              state.routes[route.id]!.status = RouteExecutionStatus.Failed;
              return;
            }
            const isDone = isRouteDone(route);
            if (isDone) {
              state.routes[route.id]!.status = RouteExecutionStatus.Done;
              if (isRoutePartiallyDone(route)) {
                state.routes[route.id]!.status |= RouteExecutionStatus.Partial;
              } else if (isRouteRefunded(route)) {
                state.routes[route.id]!.status |= RouteExecutionStatus.Refunded;
              }
              return;
            }
            const isLoading = route.steps.some((step) => step.execution);
            if (isLoading) {
              state.routes[route.id]!.status = RouteExecutionStatus.Pending;
            }
          }
        }),
      restartRoute: (routeId: string) =>
        set((state: RouteExecutionStore) => {
          state.routes[routeId]!.status = RouteExecutionStatus.Pending;
        }),
      deleteRoute: (routeId: string) =>
        set((state: RouteExecutionStore) => {
          if (state.routes[routeId]) {
            delete state.routes[routeId];
          }
        }),
      deleteRoutes: (type) =>
        set((state: RouteExecutionStore) => {
          Object.keys(state.routes)
            .filter((routeId) =>
              type === 'completed'
                ? hasEnumFlag(
                    state.routes[routeId]?.status ?? 0,
                    RouteExecutionStatus.Done,
                  )
                : !hasEnumFlag(
                    state.routes[routeId]?.status ?? 0,
                    RouteExecutionStatus.Done,
                  ),
            )
            .forEach((routeId) => delete state.routes[routeId]);
        }),
    })),
    {
      name: 'li.fi-widget-routes',
      version: 1,
      partialize: (state) => ({ routes: state.routes }),
      merge: (persistedState: any, currentState: RouteExecutionStore) => {
        const state = { ...currentState, ...persistedState };
        try {
          const routeString = localStorage.getItem('routes');
          if (routeString) {
            const routes = JSON.parse(routeString) as Array<Route>;
            routes.forEach((route) => {
              if (state.routes[route.id]) {
                return;
              }
              state.routes[route.id] = {
                route,
                status: RouteExecutionStatus.Idle,
              };
              const isFailed = isRouteFailed(route);
              if (isFailed) {
                state.routes[route.id]!.status = RouteExecutionStatus.Failed;
                return;
              }
              const isDone = isRouteDone(route);
              if (isDone) {
                state.routes[route.id]!.status = RouteExecutionStatus.Done;
                return;
              }
              const isLoading = route.steps.some((step) => step.execution);
              if (isLoading) {
                state.routes[route.id]!.status = RouteExecutionStatus.Pending;
              }
            });
          }
          localStorage.removeItem('routes');
        } catch (error) {
          console.log(error);
        }
        return state;
      },
      migrate: (persistedState: any, version) => {
        if (version === 0) {
          Object.values(persistedState.routes).forEach((route: any) => {
            if (route) {
              switch (route.status) {
                case 'idle':
                  route.status = RouteExecutionStatus.Idle;
                  break;
                case 'loading':
                  route.status = RouteExecutionStatus.Pending;
                  break;
                case 'success':
                case 'warning':
                  route.status = RouteExecutionStatus.Done;
                  break;
                case 'error':
                  route.status = RouteExecutionStatus.Failed;
                  break;
                default:
                  break;
              }
            }
          });
        }
        return persistedState as RouteExecutionStore;
      },
    },
  ),
);
