import type { ExchangeRateUpdateParams, RouteExtended } from '@lifi/sdk'
import { useCallback, useMemo } from 'react'
import { useRouteExecutionStore } from '../stores/routes/RouteExecutionStore.js'
import { RouteExecutionStatus } from '../stores/routes/types.js'
import { usePacedValue } from './usePacedValue.js'
import { useRouteExecution } from './useRouteExecution.js'

/**
 * Returns a copy of `route` with failed steps and actions set back to `PENDING`
 * and their errors cleared, so a restarted route shows as in-progress.
 */
function buildReset(route: RouteExtended): RouteExtended {
  const reset = structuredClone(route)
  for (const step of reset.steps) {
    if (step.execution?.status !== 'FAILED') {
      continue
    }
    step.execution.status = 'PENDING'
    for (const action of step.execution.actions ?? []) {
      if (action.status !== 'FAILED') {
        continue
      }
      action.status = 'PENDING'
      action.error = undefined
      action.substatus = undefined
      action.substatusMessage = undefined
    }
  }
  return reset
}

interface PacedRouteExecutionProps {
  routeId: string
  executeInBackground?: boolean
  onAcceptExchangeRateUpdate?(
    resolver: (value: boolean) => void,
    data: ExchangeRateUpdateParams
  ): void
}

/**
 * Wraps {@link useRouteExecution} and slows down how fast `route` and `status`
 * reach the UI, so the `ExecutionStatusCard` animation has time to play between
 * updates (see {@link usePacedValue}). Only the display is slowed — events and
 * store writes still happen at the SDK's real speed.
 *
 * `restartRoute` saves the reset (in-progress) route to the store. The store
 * keeps it across navigation, so when the user retries from the history list,
 * the execution page opens already showing progress and resumes itself on
 * mount. When retrying on the execution page (no remount), it resumes here.
 */
export function usePacedRouteExecution({
  routeId,
  executeInBackground,
  onAcceptExchangeRateUpdate,
}: PacedRouteExecutionProps): {
  executeRoute: () => void
  restartRoute: () => void
  deleteRoute: () => void
  route: RouteExtended | undefined
  status: RouteExecutionStatus | undefined
} {
  const {
    executeRoute,
    restartRoute: baseRestartRoute,
    deleteRoute,
    route: liveRoute,
    status: liveStatus,
  } = useRouteExecution({
    routeId,
    executeInBackground,
    onAcceptExchangeRateUpdate,
  })

  const updateRoute = useRouteExecutionStore((state) => state.updateRoute)

  // Pace route and status as one value so they always match. Don't pace while
  // Idle, so the review screen shows live data.
  const live = useMemo(
    () => ({ route: liveRoute, status: liveStatus }),
    [liveRoute, liveStatus]
  )
  const { value: display, flush } = usePacedValue(
    live,
    liveStatus !== RouteExecutionStatus.Idle
  )

  const restartRoute = useCallback((): void => {
    if (!liveRoute) {
      baseRestartRoute()
      return
    }

    const reset = buildReset(liveRoute)
    updateRoute(reset)
    flush({ route: reset, status: RouteExecutionStatus.Pending })

    // From the history list, the execution page resumes itself on mount, so
    // resuming here as well would start the route twice. Only resume here when
    // we're already on the execution page.
    if (!executeInBackground) {
      baseRestartRoute()
    }
  }, [baseRestartRoute, executeInBackground, flush, liveRoute, updateRoute])

  return {
    executeRoute,
    restartRoute,
    deleteRoute,
    route: display.route,
    status: display.status,
  }
}
