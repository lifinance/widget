import type { Route } from '@lifi/sdk'
import { memo, useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRoutes } from '../../hooks/useRoutes.js'
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js'
import { WidgetEvent } from '../../types/events.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { ExpansionTransition } from '../Expansion/ExpansionTransition.js'
import { RoutesContent } from './RoutesContent.js'
import { routesExpansionWidth } from './RoutesExpanded.style.js'

interface RoutesExpandedProps {
  canOpen: boolean
  setOpenExpansion: (open: boolean) => void
}

export const RoutesExpanded = memo(function RoutesExpanded({
  canOpen,
  setOpenExpansion,
}: RoutesExpandedProps) {
  const emitter = useWidgetEvents()
  const navigate = useNavigate()
  const routesRef = useRef<Route[]>(undefined)
  const routesActiveRef = useRef(false)

  const {
    routes,
    isLoading,
    isFetching,
    isFetched,
    dataUpdatedAt,
    refetchTime,
    fromChain,
    refetch,
    setReviewableRoute,
  } = useRoutes()

  const onExit = useCallback(() => {
    // Clean routes cache on exit
    routesRef.current = undefined
  }, [])

  // We cache routes results in ref for a better exit animation
  if (routesRef.current && !routes) {
    routesActiveRef.current = false
    // If we are loading routes with a new queryKey, we need to clear the cache
    if (isLoading) {
      routesRef.current = undefined
    }
  } else {
    routesRef.current = routes
    routesActiveRef.current = Boolean(routes)
  }

  const expanded =
    Boolean(routesActiveRef.current || isLoading || isFetching || isFetched) &&
    canOpen

  // biome-ignore lint/correctness/useExhaustiveDependencies: stable navigation callback that won't cause rerenders in RoutesContent
  const onRouteClick = useCallback(
    (route: Route) => {
      setReviewableRoute(route)
      navigate(navigationRoutes.transactionExecution, {
        state: { routeId: route.id },
      })
      emitter.emit(WidgetEvent.RouteSelected, { route, routes: routes! })
    },
    [emitter, routes, setReviewableRoute]
  )

  // Use layout effect to update parent's width when expansion changes
  useLayoutEffect(() => {
    setOpenExpansion(expanded)
  }, [expanded, setOpenExpansion])

  useEffect(() => {
    emitter.emit(WidgetEvent.WidgetExpanded, expanded)
  }, [emitter, expanded])

  return (
    <ExpansionTransition
      in={expanded}
      width={routesExpansionWidth}
      onExited={onExit}
    >
      <RoutesContent
        routes={routesRef.current}
        isFetching={isFetching}
        isLoading={isLoading}
        dataUpdatedAt={dataUpdatedAt}
        refetchTime={refetchTime}
        fromChain={fromChain}
        refetch={refetch}
        onRouteClick={onRouteClick}
      />
    </ExpansionTransition>
  )
})
