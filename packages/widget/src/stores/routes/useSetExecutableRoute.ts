import { useRouteExecutionStore } from './RouteExecutionStore.js'
import type { RouteExecutionState } from './types.js'

export const useSetExecutableRoute =
  (): RouteExecutionState['setExecutableRoute'] => {
    return useRouteExecutionStore((state) => state.setExecutableRoute)
  }
