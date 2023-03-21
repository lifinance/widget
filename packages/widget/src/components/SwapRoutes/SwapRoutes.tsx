import type { BoxProps } from '@mui/material';
import { Box, Button, Collapse } from '@mui/material';
import { useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardTitle } from '../../components/Card';
import { ProgressToNextUpdate } from '../../components/ProgressToNextUpdate';
import {
  SwapRouteCard,
  SwapRouteCardSkeleton,
  SwapRouteNotFoundCard,
} from '../../components/SwapRouteCard';
import { useSwapRoutes } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import { navigationRoutes } from '../../utils';
import { useSetRecommendedRoute } from './useSetRecommendedRoute';

export const SwapRoutes: React.FC<BoxProps> = (props) => {
  const { t } = useTranslation();
  const { variant, useRecommendedRoute } = useWidgetConfig();
  const navigate = useNavigate();
  const { isValid, isValidating } = useFormState();
  const {
    routes,
    isLoading,
    isFetching,
    isFetched,
    dataUpdatedAt,
    refetchTime,
    refetch,
  } = useSwapRoutes();

  const currentRoute = routes?.[0];

  useSetRecommendedRoute(currentRoute, isFetching);

  if (!currentRoute && !isLoading && !isFetching && !isFetched) {
    return null;
  }

  const handleCardClick = () => {
    navigate(navigationRoutes.swapRoutes);
  };

  const routeNotFound = !currentRoute && !isLoading && !isFetching;
  const onlyRecommendedRoute = variant === 'refuel' || useRecommendedRoute;
  const showAll =
    !onlyRecommendedRoute && !routeNotFound && (routes?.length ?? 0) > 1;

  return (
    <Card {...props}>
      <CardTitle>{t('swap.routes')}</CardTitle>
      <ProgressToNextUpdate
        updatedAt={dataUpdatedAt || new Date().getTime()}
        timeToUpdate={refetchTime}
        isLoading={isFetching}
        onClick={() => refetch()}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
        }}
      />
      <Box p={2}>
        {isLoading ? (
          <SwapRouteCardSkeleton variant="cardless" />
        ) : !currentRoute ? (
          <SwapRouteNotFoundCard />
        ) : (
          <SwapRouteCard route={currentRoute} variant="cardless" active />
        )}

        <Collapse timeout={225} in={showAll} unmountOnExit mountOnEnter appear>
          <Box mt={2}>
            <Button
              onClick={handleCardClick}
              disabled={isValidating || !isValid}
              fullWidth
            >
              {t('button.showAll')}
            </Button>
          </Box>
        </Collapse>
      </Box>
    </Card>
  );
};
