import type {
  ExtendedTransactionInfo,
  FullStatusData,
  StatusResponse,
} from '@lifi/sdk'
import { useEffect } from 'react'
import { useRouteExecutionStoreContext } from '../stores/routes/RouteExecutionStore.js'
import { getSourceTxHash } from '../stores/routes/utils.js'

export const useDeduplicateRoutes = (transactions: StatusResponse[]) => {
  const store = useRouteExecutionStoreContext()

  useEffect(() => {
    if (!transactions.length) {
      return
    }
    // Match by sending txHash — the only reliable link between store routes and API transfers
    const apiTxHashes = new Set(
      transactions.map(
        (t) => ((t as FullStatusData).sending as ExtendedTransactionInfo).txHash
      )
    )
    const { routes, deleteRoute } = store.getState()
    for (const [id, routeExecution] of Object.entries(routes)) {
      const txHash = getSourceTxHash(routeExecution?.route)
      if (txHash && apiTxHashes.has(txHash)) {
        deleteRoute(id)
      }
    }
  }, [store, transactions])
}
