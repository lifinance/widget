import type { Route } from '@lifi/sdk'
import { useEffect, useRef } from 'react'
import { useRoutes } from '../../hooks/useRoutes.js'
import { ExpansionType } from '../../types/widget.js'
import { ExpansionTransition } from '../Expansion/ExpansionTransition.js'
import { RoutesContent } from './RoutesContent.js'
import { routesExpansionWidth } from './RoutesExpanded.style.js'

interface RoutesExpandedProps {
  expansionType: ExpansionType
  setOpenExpansion: (open: boolean) => void
}

export const RoutesExpanded = ({
  expansionType,
  setOpenExpansion,
}: RoutesExpandedProps) => {
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

  const onExit = () => {
    // Clean routes cache on exit
    routesRef.current = undefined
  }

  // We cache routes results in ref for a better exit animation
  if (routesRef.current && !routes) {
    routesActiveRef.current = false
  } else {
    routesRef.current = routes
    routesActiveRef.current = Boolean(routes)
  }

  const expanded =
    Boolean(routesActiveRef.current || isLoading || isFetching || isFetched) &&
    expansionType === ExpansionType.Routes

  useEffect(() => {
    // To update parent's width when expansion changes
    setOpenExpansion(expanded)
  }, [expanded, setOpenExpansion])

  return (
    <ExpansionTransition
      in={expanded}
      width={routesExpansionWidth}
      onExited={onExit}
    >
      <RoutesContent
        routes={routesRef.current || []}
        isFetching={isFetching}
        isLoading={isLoading}
        expanded={expanded}
        setReviewableRoute={setReviewableRoute}
        dataUpdatedAt={dataUpdatedAt}
        refetchTime={refetchTime}
        fromChain={fromChain}
        refetch={refetch}
      />
    </ExpansionTransition>
  )
}
