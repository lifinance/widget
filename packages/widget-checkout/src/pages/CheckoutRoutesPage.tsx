import type { Route } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import {
  ProgressToNextUpdate,
  RouteCard,
  RouteCardSkeleton,
  RouteNotFoundCard,
  Stack,
  useFieldValues,
  useHeader,
  useRoutes,
  useToAddressRequirements,
  useWidgetEvents,
  WidgetEvent,
} from '@lifi/widget/shared'
import { useNavigate } from '@tanstack/react-router'
import { type JSX, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { checkoutAbsolutePaths } from '../utils/navigationRoutes.js'

/** Same as main `RoutesPage`, but navigation uses checkout absolute paths. */
export const CheckoutRoutesPage = (): JSX.Element => {
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
      to: checkoutAbsolutePaths.transactionExecution,
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
    <Stack
      className="long-list"
      direction="column"
      spacing={2}
      sx={{ flex: 1 }}
    >
      {routeNotFound ? (
        <RouteNotFoundCard />
      ) : isLoading && !routes?.length ? (
        Array.from({ length: 3 }).map((_, index) => (
          <RouteCardSkeleton key={index} />
        ))
      ) : (
        routes?.map((route: Route, index: number) => (
          <RouteCard
            key={route.id}
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
