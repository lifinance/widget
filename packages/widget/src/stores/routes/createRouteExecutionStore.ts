import type { Route } from '@lifi/sdk';
import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';
import { hasEnumFlag } from '../../utils';
import type { PersistStoreProps } from '../types';
import type { RouteExecutionState } from './types';
import { RouteExecutionStatus } from './types';
import {
  isRouteDone,
  isRouteFailed,
  isRoutePartiallyDone,
  isRouteRefunded,
} from './utils';

export const createRouteExecutionStore = ({ namePrefix }: PersistStoreProps) =>
  createWithEqualityFn<RouteExecutionState>(
    persist(
      (set, get) => ({
        routes: {},
        setExecutableRoute: (route: Route, insurableRouteId?: string) => {
          if (!get().routes[route.id]) {
            set((state: RouteExecutionState) => {
              const routes = { ...state.routes };
              // clean previous idle routes that were not executed
              Object.keys(routes)
                .filter(
                  (routeId) =>
                    routeId !== insurableRouteId &&
                    routes[routeId]?.status === RouteExecutionStatus.Idle,
                )
                .forEach((routeId) => delete routes[routeId]);
              routes[route.id] = {
                route,
                status: RouteExecutionStatus.Idle,
              };
              return {
                routes,
              };
            });
          }
        },
        updateRoute: (route: Route) => {
          if (get().routes[route.id]) {
            set((state: RouteExecutionState) => {
              const updatedState = {
                routes: {
                  ...state.routes,
                  [route.id]: { ...state.routes[route.id]!, route },
                },
              };
              const isFailed = isRouteFailed(route);
              if (isFailed) {
                updatedState.routes[route.id]!.status =
                  RouteExecutionStatus.Failed;
                return updatedState;
              }
              const isDone = isRouteDone(route);
              if (isDone) {
                updatedState.routes[route.id]!.status =
                  RouteExecutionStatus.Done;
                if (isRoutePartiallyDone(route)) {
                  updatedState.routes[route.id]!.status |=
                    RouteExecutionStatus.Partial;
                } else if (isRouteRefunded(route)) {
                  updatedState.routes[route.id]!.status |=
                    RouteExecutionStatus.Refunded;
                }
                return updatedState;
              }
              const isLoading = route.steps.some((step) => step.execution);
              if (isLoading) {
                updatedState.routes[route.id]!.status =
                  RouteExecutionStatus.Pending;
              }
              return updatedState;
            });
          }
        },
        restartRoute: (routeId: string) => {
          if (get().routes[routeId]) {
            set((state: RouteExecutionState) => ({
              routes: {
                ...state.routes,
                [routeId]: {
                  ...state.routes[routeId]!,
                  status: RouteExecutionStatus.Pending,
                },
              },
            }));
          }
        },
        deleteRoute: (routeId: string) => {
          if (get().routes[routeId]) {
            set((state: RouteExecutionState) => {
              const routes = { ...state.routes };
              delete routes[routeId];
              return {
                routes,
              };
            });
          }
        },
        deleteRoutes: (type) =>
          set((state: RouteExecutionState) => {
            const routes = { ...state.routes };
            Object.keys(routes)
              .filter((routeId) =>
                type === 'completed'
                  ? hasEnumFlag(
                      routes[routeId]?.status ?? 0,
                      RouteExecutionStatus.Done,
                    )
                  : !hasEnumFlag(
                      routes[routeId]?.status ?? 0,
                      RouteExecutionStatus.Done,
                    ),
              )
              .forEach((routeId) => delete routes[routeId]);
            return {
              routes,
            };
          }),
      }),
      {
        name: `${namePrefix || 'li.fi'}-widget-routes`,
        version: 1,
        partialize: (state) => ({ routes: state.routes }),
        merge: (persistedState: any, currentState: RouteExecutionState) => {
          const state = {
            ...currentState,
            ...persistedState,
          } as RouteExecutionState;
          try {
            // Move transactions to history after 1 day
            const currentTime = new Date().getTime();
            const oneDay = 1000 * 60 * 60 * 24;
            Object.values(state.routes).forEach((routeExecution) => {
              const startedAt =
                routeExecution?.route.steps
                  ?.find((step) => step.execution?.status === 'FAILED')
                  ?.execution?.process.find((process) => process.startedAt)
                  ?.startedAt ?? 0;
              const outdated =
                startedAt > 0 && currentTime - startedAt > oneDay;
              if (routeExecution?.route && outdated) {
                routeExecution.status |= RouteExecutionStatus.Done;
              }
            });
            // migrate old routes
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
              localStorage.removeItem('routes');
            }
          } catch (error) {
            console.error(error);
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
          return persistedState as RouteExecutionState;
        },
      },
    ) as StateCreator<RouteExecutionState, [], [], RouteExecutionState>,
    Object.is,
  );
