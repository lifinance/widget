import { KeyboardArrowRight as KeyboardArrowRightIcon } from '@mui/icons-material';
import type { BoxProps } from '@mui/material';
import { Box, IconButton } from '@mui/material';
import { useEffect } from 'react';
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
import { useSelectedRouteStore } from '../../stores';
import { navigationRoutes } from '../../utils';
import { Stack } from './SwapRoutes.style';

export const SwapRoutes: React.FC<BoxProps> = (props) => {
  const { t } = useTranslation();
  const { variant } = useWidgetConfig();
  const navigate = useNavigate();
  const { isValid, isValidating } = useFormState();
  const setSelectedRoute = useSelectedRouteStore(
    (state) => state.setSelectedRoute,
  );
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

  useEffect(() => {
    setSelectedRoute(!isFetching ? currentRoute : undefined);
    return () => setSelectedRoute(undefined);
  }, [currentRoute, isFetching, setSelectedRoute]);

  if (!currentRoute && !isLoading && !isFetching && !isFetched) {
    return null;
  }

  const handleCardClick = () => {
    navigate(navigationRoutes.swapRoutes);
  };

  const routeNotFound = !currentRoute && !isLoading && !isFetching;

  if (variant === 'expandable') {
    return null;
  }

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
      <Box sx={{ display: 'flex' }}>
        <Stack
          direction="row"
          spacing={2}
          my={2}
          ml={2}
          mr={routeNotFound ? 2 : 1}
          sx={{
            borderWidth:
              !routeNotFound && (isFetching || (routes && routes.length > 1))
                ? 1
                : 0,
          }}
        >
          {isLoading || isFetching ? (
            <>
              <SwapRouteCardSkeleton minWidth="80%" variant="dense" />
              <SwapRouteCardSkeleton minWidth="80%" variant="dense" />
            </>
          ) : !currentRoute ? (
            <SwapRouteNotFoundCard />
          ) : (
            <>
              <SwapRouteCard
                minWidth={routes.length > 1 ? '80%' : '100%'}
                route={currentRoute}
                variant="dense"
                active
              />
              {routes.length > 1 ? (
                <SwapRouteCard
                  minWidth="80%"
                  route={routes[1]}
                  variant="dense"
                />
              ) : null}
            </>
          )}
        </Stack>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!routeNotFound ? (
            <Box py={1} pr={1}>
              <IconButton
                onClick={handleCardClick}
                size="medium"
                aria-label="swap-routes"
                disabled={isValidating || !isValid}
              >
                <KeyboardArrowRightIcon />
              </IconButton>
            </Box>
          ) : null}
        </Box>
      </Box>
    </Card>
  );
};
