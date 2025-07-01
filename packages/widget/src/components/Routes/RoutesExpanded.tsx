import type { Route } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import { Stack, Typography } from '@mui/material'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useExpansionRoutes } from '../../hooks/useExpansionRoutes.js'
import { useRoutes } from '../../hooks/useRoutes.js'
import { useToAddressRequirements } from '../../hooks/useToAddressRequirements.js'
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { WidgetEvent } from '../../types/events.js'
import { ExpansionType } from '../../types/widget.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { ExpansionSlide } from '../Expansion/ExpansionSlide.js'
import { PageContainer } from '../PageContainer.js'
import { ProgressToNextUpdate } from '../ProgressToNextUpdate.js'
import { RouteCard } from '../RouteCard/RouteCard.js'
import { RouteCardSkeleton } from '../RouteCard/RouteCardSkeleton.js'
import { RouteNotFoundCard } from '../RouteCard/RouteNotFoundCard.js'
import {
  Container,
  Header,
  ScrollableContainer,
  routesExpansionWidth,
} from './RoutesExpanded.style.js'

export const animationTimeout = { enter: 225, exit: 225, appear: 0 }

interface RoutesExpandedProps {
  setOpenExpansion: (open: boolean) => void
}

export const RoutesExpanded = ({ setOpenExpansion }: RoutesExpandedProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { subvariant, subvariantOptions } = useWidgetConfig()
  const expansionType = useExpansionRoutes()
  const routesRef = useRef<Route[]>(undefined)
  const emitter = useWidgetEvents()
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
  const { account } = useAccount({ chainType: fromChain?.chainType })
  const [toAddress] = useFieldValues('toAddress')
  const { requiredToAddress } = useToAddressRequirements()

  const handleRouteClick = (route: Route) => {
    setReviewableRoute(route)
    navigate(navigationRoutes.transactionExecution, {
      state: { routeId: route.id },
    })
    emitter.emit(WidgetEvent.RouteSelected, { route, routes: routes! })
  }

  // We cache routes results in ref for a better exit animation
  if (routesRef.current && !routes) {
    routesActiveRef.current = false
  } else {
    routesRef.current = routes
    routesActiveRef.current = Boolean(routes)
  }

  const currentRoute = routesRef.current?.[0]

  const expanded =
    Boolean(routesActiveRef.current || isLoading || isFetching || isFetched) &&
    expansionType === ExpansionType.Routes

  useEffect(() => {
    setOpenExpansion(expanded)
    if (!expanded) {
      // Clean routes cache on exit
      routesRef.current = undefined
    }
  }, [expanded, setOpenExpansion])

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
    <ExpansionSlide open={expanded} expansionWidth={routesExpansionWidth}>
      <Container enableColorScheme minimumHeight={isLoading}>
        <ScrollableContainer>
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
              updatedAt={dataUpdatedAt || new Date().getTime()}
              timeToUpdate={refetchTime}
              isLoading={isFetching}
              onClick={() => refetch()}
              sx={{ marginRight: -1 }}
            />
          </Header>
          <PageContainer>
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
              ) : (isLoading || isFetching) && !routesRef.current?.length ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <RouteCardSkeleton key={index} />
                ))
              ) : (
                routesRef.current?.map((route: Route, index: number) => (
                  <RouteCard
                    key={index}
                    route={route}
                    onClick={
                      allowInteraction
                        ? () => handleRouteClick(route)
                        : undefined
                    }
                    active={index === 0}
                    expanded={routesRef.current?.length === 1}
                  />
                ))
              )}
            </Stack>
          </PageContainer>
        </ScrollableContainer>
      </Container>
    </ExpansionSlide>
  )
}
