import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useRef, useState } from 'react'
import { ProgressToNextUpdate } from '../../components/ProgressToNextUpdate.js'
import { useRoutes } from '../../hooks/useRoutes.js'
import { useRouteExecutionStoreContext } from '../../stores/routes/RouteExecutionStore.js'
import { useSetExecutableRoute } from '../../stores/routes/useSetExecutableRoute.js'

interface RouteTrackerProps {
  observableRouteId: string
  onChange: Dispatch<SetStateAction<string>>
  onFetching: Dispatch<SetStateAction<boolean>>
}

export const RouteTracker = ({
  observableRouteId,
  onChange,
  onFetching,
}: RouteTrackerProps) => {
  const routeExecutionStore = useRouteExecutionStoreContext()
  const setExecutableRoute = useSetExecutableRoute()
  const [observableRoute] = useState(
    () => routeExecutionStore.getState().routes[observableRouteId]?.route
  )
  const observableRouteIdRef = useRef(observableRoute?.id)
  const { routes, isFetching, dataUpdatedAt, refetchTime, refetch } = useRoutes(
    { observableRoute }
  )
  const currentRoute = routes?.[0]

  /**
   * The reviewable route is the route that the user currently sees on the review page.
   * The observable route is the route for which we track bridges and exchanges.
   * This allows us to query the route using the same tool each time we refresh.
   * The observable and reviewable routes can be the same when we first enter the review page.
   */
  // biome-ignore lint/correctness/useExhaustiveDependencies: run only when currentRoute changes
  useEffect(() => {
    if (
      observableRouteIdRef.current &&
      currentRoute &&
      observableRouteIdRef.current !== currentRoute.id
    ) {
      const reviewableRouteId = observableRouteIdRef.current
      observableRouteIdRef.current = currentRoute.id
      setExecutableRoute(currentRoute, [observableRouteId, reviewableRouteId])
      onChange(currentRoute.id)
    }
  }, [currentRoute?.id, observableRouteId])

  useEffect(() => {
    onFetching(isFetching)
  }, [isFetching, onFetching])

  const handleRefetch = () => {
    refetch()
  }

  return (
    <ProgressToNextUpdate
      updatedAt={dataUpdatedAt || Date.now()}
      timeToUpdate={refetchTime}
      isLoading={isFetching}
      onClick={handleRefetch}
      sx={{ marginRight: -1 }}
      size="medium"
    />
  )
}
