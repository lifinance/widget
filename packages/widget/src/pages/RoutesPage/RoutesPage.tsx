import type { Route } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import { useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ProgressToNextUpdate } from '../../components/ProgressToNextUpdate'
import { RouteCard } from '../../components/RouteCard/RouteCard'
import { RouteCardSkeleton } from '../../components/RouteCard/RouteCardSkeleton'
import { RouteNotFoundCard } from '../../components/RouteCard/RouteNotFoundCard'
import { useHeader } from '../../hooks/useHeader'
import { useRoutes } from '../../hooks/useRoutes'
import { useToAddressRequirements } from '../../hooks/useToAddressRequirements'
import { useWidgetEvents } from '../../hooks/useWidgetEvents'
import { useFieldValues } from '../../stores/form/useFieldValues'
import { WidgetEvent } from '../../types/events'
import { navigationRoutes } from '../../utils/navigationRoutes'
import { Stack } from './RoutesPage.style'

export const RoutesPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const emitter = useWidgetEvents()
  const {
    routes,
    isLoading,
    isFetching,
    dataUpdatedAt,
    refetchTime,
    fromChain,
    refetch,
    setReviewableRoute,
  } = useRoutes()
  const { account } = useAccount({ chainType: fromChain?.chainType })
  const [toAddress] = useFieldValues('toAddress')
  const { requiredToAddress } = useToAddressRequirements()

  const headerAction = useMemo(
    () => (
      <ProgressToNextUpdate
        updatedAt={dataUpdatedAt || Date.now()}
        timeToUpdate={refetchTime}
        isLoading={isFetching}
        onClick={() => refetch()}
        sx={{ marginRight: -1 }}
        size="medium"
      />
    ),
    [dataUpdatedAt, isFetching, refetch, refetchTime]
  )

  useHeader(t('header.receive'), headerAction)

  const handleRouteClick = (route: Route) => {
    setReviewableRoute(route)
    navigate({
      to: navigationRoutes.transactionExecution,
      search: { routeId: route.id },
    })
    emitter.emit(WidgetEvent.RouteSelected, {
      route,
      routes: routes!,
    })
  }

  const routeNotFound = !routes?.length && !isLoading && !isFetching

  const toAddressUnsatisfied = routes?.[0] && requiredToAddress && !toAddress

  const allowInteraction = account.isConnected && !toAddressUnsatisfied

  return (
    <Stack className="long-list" direction="column" spacing={2} flex={1}>
      {routeNotFound ? (
        <RouteNotFoundCard />
      ) : isLoading && !routes?.length ? (
        Array.from({ length: 3 }).map((_, index) => (
          <RouteCardSkeleton key={index} />
        ))
      ) : (
        routes?.map((route: Route, index: number) => (
          <RouteCard
            key={index}
            route={route}
            onClick={
              allowInteraction ? () => handleRouteClick(route) : undefined
            }
            active={index === 0}
            expanded={routes?.length === 1}
          />
        ))
      )}
    </Stack>
  )
}
