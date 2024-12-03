import type { Route } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import { Collapse, Grow, Stack, Typography } from '@mui/material'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { RouteObject } from 'react-router-dom'
import { useRoutes as useDOMRoutes, useNavigate } from 'react-router-dom'
import { useRoutes } from '../../hooks/useRoutes.js'
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
import {
  CollapseContainer,
  Container,
  Header,
  RouteTopLevelGrow,
  RoutesExpandedCollapse,
  ScrollableContainer,
} from './RoutesExpanded.style.js'

const timeout = { enter: 225, exit: 225, appear: 0 }

const routes: RouteObject[] = [
  {
    path: '/',
    element: true,
  },
  {
    path: '*',
    element: null,
  },
]

export const RoutesExpanded = () => {
  const element = useDOMRoutes(routes)
  const match = Boolean(element?.props?.children)

  return (
    <CollapseContainer>
      <Collapse timeout={timeout} in={match} orientation="horizontal">
        <RouteTopLevelGrow
          timeout={timeout}
          in={match}
          mountOnEnter
          unmountOnExit
        >
          <div>
            <RoutesExpandedElement />
          </div>
        </RouteTopLevelGrow>
      </Collapse>
    </CollapseContainer>
  )
}

export const RoutesExpandedElement = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { subvariant, subvariantOptions } = useWidgetConfig()
  const routesRef = useRef<Route[]>()
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

  const currentRoute = routesRef.current?.[0]

  const expanded = Boolean(
    routesActiveRef.current || isLoading || isFetching || isFetched
  )

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
    <RoutesExpandedCollapse
      timeout={timeout.enter}
      in={expanded}
      orientation="horizontal"
      onExited={onExit}
    >
      <Grow timeout={timeout.enter} in={expanded} mountOnEnter unmountOnExit>
        <Container enableColorScheme minimumHeight={isLoading}>
          <ScrollableContainer>
            <Header>
              <Typography fontSize={18} fontWeight="700" flex={1} noWrap>
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
              <Stack direction="column" spacing={2} flex={1} paddingBottom={3}>
                {routeNotFound ? (
                  <RouteNotFoundCard />
                ) : isLoading || (isFetching && !routesRef.current?.length) ? (
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
      </Grow>
    </RoutesExpandedCollapse>
  )
}
