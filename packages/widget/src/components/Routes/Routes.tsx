import { Box, Collapse } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useRoutes } from '../../hooks/useRoutes'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider'
import { navigationRoutes } from '../../utils/navigationRoutes'
import { ButtonTertiary } from '../ButtonTertiary'
import type { CardProps } from '../Card/Card'
import { Card } from '../Card/Card'
import { CardTitle } from '../Card/CardTitle'
import { ProgressToNextUpdate } from '../ProgressToNextUpdate'
import { RouteCard } from '../RouteCard/RouteCard'
import { RouteCardSkeleton } from '../RouteCard/RouteCardSkeleton'
import { RouteNotFoundCard } from '../RouteCard/RouteNotFoundCard'

export const Routes: React.FC<CardProps> = (props) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { subvariant, subvariantOptions, useRecommendedRoute } =
    useWidgetConfig()
  const {
    routes,
    isLoading,
    isFetching,
    isFetched,
    dataUpdatedAt,
    refetchTime,
    refetch,
  } = useRoutes()

  const currentRoute = routes?.[0]

  if (!currentRoute && !isLoading && !isFetching && !isFetched) {
    return null
  }

  const handleCardClick = () => {
    navigate({ to: navigationRoutes.routes })
  }

  const routeNotFound = !currentRoute && !isLoading && !isFetching
  const onlyRecommendedRoute = subvariant === 'refuel' || useRecommendedRoute
  const showAll =
    !onlyRecommendedRoute && !routeNotFound && (routes?.length ?? 0) > 1

  const title =
    subvariant === 'custom'
      ? subvariantOptions?.custom === 'deposit'
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
