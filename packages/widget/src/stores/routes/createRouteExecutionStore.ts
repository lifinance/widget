import type { Route, RouteExtended } from '@lifi/sdk'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { hasEnumFlag } from '../../utils/enum.js'
import type { PersistStoreProps } from '../types.js'
import type { RouteExecution, RouteExecutionState } from './types.js'
import { RouteExecutionStatus } from './types.js'
import {
  isRouteDone,
  isRouteFailed,
  isRoutePartiallyDone,
  isRouteRefunded,
} from './utils.js'

export const createRouteExecutionStore = ({ namePrefix }: PersistStoreProps) =>
  create<RouteExecutionState>()(
    persist(
      (set, get) => ({
        routes: {},
        setExecutableRoute: (route: Route, observableRouteIds?: string[]) => {
          if (!get().routes[route.id]) {
            set((state: RouteExecutionState) => {
              const routes = { ...state.routes }
              // clean previous idle routes
              Object.keys(routes)
                .filter(
                  (routeId) =>
                    !observableRouteIds?.includes(routeId) &&
                    hasEnumFlag(
                      routes[routeId]!.status,
                      RouteExecutionStatus.Idle
                    )
                )
                .forEach((routeId) => {
                  delete routes[routeId]
                })
              routes[route.id] = {
                route,
                status: RouteExecutionStatus.Idle,
              }
              return {
                routes,
              }
            })
          }
        },
        updateRoute: (route: RouteExtended) => {
          if (get().routes[route.id]) {
            set((state: RouteExecutionState) => {
              const updatedState = {
                routes: {
                  ...state.routes,
                  [route.id]: { ...state.routes[route.id]!, route },
                },
              }
              const isFailed = isRouteFailed(route)
              if (isFailed) {
                updatedState.routes[route.id]!.status =
                  RouteExecutionStatus.Failed
                return updatedState
              }
              const isDone = isRouteDone(route)
              if (isDone) {
                updatedState.routes[route.id]!.status =
                  RouteExecutionStatus.Done
                if (isRoutePartiallyDone(route)) {
                  updatedState.routes[route.id]!.status |=
                    RouteExecutionStatus.Partial
                } else if (isRouteRefunded(route)) {
                  updatedState.routes[route.id]!.status |=
                    RouteExecutionStatus.Refunded
                }
                return updatedState
              }
              const isLoading = route.steps.some((step) => step.execution)
              if (isLoading) {
                updatedState.routes[route.id]!.status =
                  RouteExecutionStatus.Pending
              }
              return updatedState
            })
          }
        },
        deleteRoute: (routeId: string) => {
          if (get().routes[routeId]) {
            set((state: RouteExecutionState) => {
              const routes = { ...state.routes }
              delete routes[routeId]
              return {
                routes,
              }
            })
          }
        },
      }),
      {
        name: `${namePrefix || 'li.fi'}-widget-routes`,
        version: 3,
        partialize: (state) => ({ routes: state.routes }),
        merge: (persistedState: any, currentState: RouteExecutionState) => {
          const state = {
            ...currentState,
            ...persistedState,
          } as RouteExecutionState
          try {
            // Keep only the most recent 100 routes, evicting the oldest when the
            // limit is exceeded.
            const maxStoredRoutes = 100
            const allRoutes = Object.values(state.routes) as RouteExecution[]
            const storedRoutes = allRoutes
              .sort(
                (a, b) =>
                  (b.route.steps[0]?.execution?.startedAt ?? 0) -
                  (a.route.steps[0]?.execution?.startedAt ?? 0)
              )
              .slice(0, maxStoredRoutes)
            const keepIds = new Set(storedRoutes.map((r) => r.route.id))
            for (const id of Object.keys(state.routes)) {
              if (!keepIds.has(id)) {
                delete state.routes[id]
              }
            }
          } catch (error) {
            console.error(error)
          }
          return state
        },
      }
    )
  )
