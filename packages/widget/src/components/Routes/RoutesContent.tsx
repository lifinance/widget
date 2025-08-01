import type { ExtendedChain, Route } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import { Stack, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useToAddressRequirements } from '../../hooks/useToAddressRequirements.js'
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { WidgetEvent } from '../../types/events.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { PageContainer } from '../PageContainer.js'
import { ProgressToNextUpdate } from '../ProgressToNextUpdate.js'
import { RouteCard } from '../RouteCard/RouteCard.js'
import { RouteCardSkeleton } from '../RouteCard/RouteCardSkeleton.js'
import { RouteNotFoundCard } from '../RouteCard/RouteNotFoundCard.js'
import { Container, Header } from './RoutesExpanded.style.js'

interface RoutesContentProps {
  routes: Route[]
  isFetching: boolean
  isLoading: boolean
  expanded: boolean
  setReviewableRoute: (route: Route) => void
  dataUpdatedAt: number
  refetchTime: number
  fromChain: ExtendedChain | undefined
  refetch: () => void
}

export const RoutesContent = ({
  routes,
  isFetching,
  isLoading,
  expanded,
  setReviewableRoute,
  dataUpdatedAt,
  refetchTime,
  fromChain,
  refetch,
}: RoutesContentProps) => {
  const { t } = useTranslation()

  const navigate = useNavigate()
  const { subvariant, subvariantOptions } = useWidgetConfig()

  const { account } = useAccount({ chainType: fromChain?.chainType })
  const [toAddress] = useFieldValues('toAddress')
  const { requiredToAddress } = useToAddressRequirements()

  const emitter = useWidgetEvents()

  const handleRouteClick = (route: Route) => {
    setReviewableRoute(route)
    navigate(navigationRoutes.transactionExecution, {
      state: { routeId: route.id },
    })
    emitter.emit(WidgetEvent.RouteSelected, { route, routes: routes! })
  }
  const currentRoute = routes?.[0]

  const routeNotFound = !currentRoute && !isLoading && !isFetching && expanded
  const toAddressUnsatisfied = currentRoute && requiredToAddress && !toAddress
  const allowInteraction = account.isConnected && !toAddressUnsatisfied

  useEffect(() => {
    emitter.emit(WidgetEvent.WidgetExpanded, expanded)
  }, [emitter, expanded])

  const title =
    subvariant === 'custom'
      ? subvariantOptions?.custom === 'deposit'
        ? t('header.deposit')
        : t('header.youPay')
      : t('header.receive')

  return (
    <Container enableColorScheme minimumHeight={isLoading}>
      <Header>
        <Typography
          noWrap
          sx={{
            fontSize: 18,
            fontWeight: '700',
            flex: 1,
          }}
        >
          {title}
        </Typography>
        <ProgressToNextUpdate
          updatedAt={dataUpdatedAt || Date.now()}
          timeToUpdate={refetchTime}
          isLoading={isFetching}
          onClick={() => refetch()}
          sx={{ marginRight: -1 }}
        />
      </Header>
      <PageContainer sx={{ overflow: 'auto' }}>
        <Stack
          direction="column"
          spacing={2}
          sx={{
            flex: 1,
            paddingBottom: 3,
          }}
        >
          {routeNotFound ? (
            <RouteNotFoundCard />
          ) : (isLoading || isFetching) && !routes?.length ? (
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
      </PageContainer>
    </Container>
  )
}
