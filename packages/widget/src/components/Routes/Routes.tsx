import { useAccount } from '@lifi/wallet-management'
import { Box, Collapse, Stack } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useRoutes } from '../../hooks/useRoutes.js'
import { useToAddressRequirements } from '../../hooks/useToAddressRequirements.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { useLimitMode } from '../../stores/navigationTabs/useLimitMode.js'
import { getRouteProviderKey } from '../../utils/limitOrder.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { ButtonTertiary } from '../ButtonTertiary.js'
import type { CardProps } from '../Card/Card.js'
import { Card } from '../Card/Card.js'
import { CardTitle } from '../Card/CardTitle.js'
import { ProgressToNextUpdate } from '../ProgressToNextUpdate.js'
import { RouteCard } from '../RouteCard/RouteCard.js'
import { RouteCardSkeleton } from '../RouteCard/RouteCardSkeleton.js'
import { RouteNotFoundCard } from '../RouteCard/RouteNotFoundCard.js'
import {
  RouteProviderCard,
  RouteProviderCardSkeleton,
} from '../RouteCard/RouteProviderCard.js'

export const Routes: React.FC<CardProps> = (props) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isLimit = useLimitMode()
  const { mode, modeOptions, showSingleRoute } = useWidgetConfig()
  const {
    routes,
    isLoading,
    isFetching,
    isFetched,
    dataUpdatedAt,
    refetchTime,
    refetch,
    fromChain,
  } = useRoutes()
  const { account } = useAccount({ chainType: fromChain?.chainType })
  const [toAddress, selectedProviderKey] = useFieldValues(
    'toAddress',
    'selectedProviderKey'
  )
  const { setFieldValue } = useFieldActions()
  const { requiredToAddress } = useToAddressRequirements()

  const currentRoute = routes?.[0]

  if (!currentRoute && !isLoading && !isFetching && !isFetched) {
    return null
  }

  const handleCardClick = () => {
    navigate({ to: navigationRoutes.routes })
  }

  const toAddressUnsatisfied = currentRoute && requiredToAddress && !toAddress
  const allowInteraction = account.isConnected && !toAddressUnsatisfied

  // Falls back to the best route when nothing is selected yet or the previously
  // selected provider is no longer present in the latest results. Matching by
  // provider key (not route id) keeps the pick stable across refetches, since
  // route ids are regenerated on every fetch.
  const activeRouteId =
    routes?.find((route) => getRouteProviderKey(route) === selectedProviderKey)
      ?.id ?? currentRoute?.id

  const routeNotFound = !currentRoute && !isLoading && !isFetching
  const onlySingleRoute = mode === 'refuel' || showSingleRoute
  const showAll =
    !onlySingleRoute && !routeNotFound && (routes?.length ?? 0) > 1

  if (isLimit) {
    return (
      <Stack
        direction="column"
        spacing={1}
        sx={props.sx}
        className={props.className}
      >
        {isLoading && !currentRoute ? (
          Array.from({ length: 3 }).map((_, index) => (
            <RouteProviderCardSkeleton key={index} />
          ))
        ) : !currentRoute ? (
          <RouteNotFoundCard />
        ) : (
          routes?.map((route) => (
            <RouteProviderCard
              key={route.id}
              route={route}
              active={route.id === activeRouteId}
              onClick={
                allowInteraction
                  ? () =>
                      setFieldValue(
                        'selectedProviderKey',
                        getRouteProviderKey(route)
                      )
                  : undefined
              }
            />
          ))
        )}
      </Stack>
    )
  }

  const title =
    mode === 'custom'
      ? modeOptions?.custom?.type === 'deposit'
        ? t('header.receive')
        : t('header.youPay')
      : t('header.receive')

  return (
    <Card {...props}>
      <CardTitle>{title}</CardTitle>
      <ProgressToNextUpdate
        updatedAt={dataUpdatedAt || Date.now()}
        timeToUpdate={refetchTime}
        isLoading={isFetching}
        onClick={() => refetch()}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
        }}
      />
      <Box
        sx={{
          p: 2,
        }}
      >
        {isLoading && !currentRoute ? (
          <RouteCardSkeleton variant="cardless" />
        ) : !currentRoute ? (
          <RouteNotFoundCard />
        ) : (
          <RouteCard route={currentRoute} variant="cardless" active />
        )}

        <Collapse timeout={225} in={showAll} unmountOnExit mountOnEnter>
          <Box
            sx={{
              mt: 2,
            }}
          >
            <ButtonTertiary onClick={handleCardClick} fullWidth>
              {t('button.showAll')}
            </ButtonTertiary>
          </Box>
        </Collapse>
      </Box>
    </Card>
  )
}
