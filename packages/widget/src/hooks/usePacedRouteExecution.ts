import type { ExchangeRateUpdateParams, RouteExtended } from '@lifi/sdk'
import { useMemo } from 'react'
import { RouteExecutionStatus } from '../stores/routes/types.js'
import { usePacedValue } from './usePacedValue.js'
import { useRouteExecution } from './useRouteExecution.js'

interface PacedRouteExecutionProps {
  routeId: string
  onAcceptExchangeRateUpdate?(
    resolver: (value: boolean) => void,
    data: ExchangeRateUpdateParams
  ): void
}

/**
 * Wraps {@link useRouteExecution} and paces `route`/`status` so the
 * `ExecutionStatusCard` animation has time to play between updates. Only the
 * display is paced — events and store writes happen at the SDK's real speed.
 */
export function usePacedRouteExecution({
  routeId,
  onAcceptExchangeRateUpdate,
}: PacedRouteExecutionProps): {
  executeRoute: () => void
  restartRoute: () => void
  deleteRoute: () => void
  route: RouteExtended | undefined
  status: RouteExecutionStatus | undefined
} {
  const { executeRoute, restartRoute, deleteRoute, route, status } =
    useRouteExecution({ routeId, onAcceptExchangeRateUpdate })

  // Pace route and status as one value so they always match. Skip pacing while
  // Idle, so the review screen shows live data.
  const live = useMemo(() => ({ route, status }), [route, status])
  const display = usePacedValue(live, status !== RouteExecutionStatus.Idle)

  return {
    executeRoute,
    restartRoute,
    deleteRoute,
    route: display.route,
    status: display.status,
  }
}
