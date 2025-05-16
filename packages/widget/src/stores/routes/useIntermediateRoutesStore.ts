import type { Route } from '@lifi/sdk'
import { create } from 'zustand'

interface IntermediateRoutesState {
  intermediateRoutes: Record<string, Route[] | undefined>
  setIntermediateRoutes: (
    key: readonly unknown[],
    routes: Route[] | undefined
  ) => void
  getIntermediateRoutes: (key: readonly unknown[]) => Route[] | undefined
}

export const useIntermediateRoutesStore = create<IntermediateRoutesState>(
  (set, get) => ({
    intermediateRoutes: {},
    setIntermediateRoutes: (key, routes) => {
      const stringKey = JSON.stringify(key)
      // Create a new state with only the current key
      const newRoutesByKey: Record<string, Route[] | undefined> = {}
      newRoutesByKey[stringKey] = routes
      set({ intermediateRoutes: newRoutesByKey })
    },
    getIntermediateRoutes: (key) => {
      const stringKey = JSON.stringify(key)
      return get().intermediateRoutes[stringKey]
    },
  })
)
