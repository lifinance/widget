import { useEffect } from 'react'
import { useRouteExecutionStoreContext } from './RouteExecutionStore.js'
import type { RouteExecution } from './types.js'
import { getSourceTxHash } from './utils.js'

export const useDeduplicateRoutes = (routeExecutions: RouteExecution[]) => {
  const store = useRouteExecutionStoreContext()

  useEffect(() => {
    if (!routeExecutions.length) {
      return
    }
    const apiTxHashes = new Set(
      routeExecutions.map((r) => getSourceTxHash(r.route))
    )
    const { routes, deleteRoute } = store.getState()
    for (const [id, routeExecution] of Object.entries(routes)) {
      const txHash = getSourceTxHash(routeExecution?.route)
      if (txHash && apiTxHashes.has(txHash)) {
        deleteRoute(id)
      }
    }
  }, [store, routeExecutions])
}
