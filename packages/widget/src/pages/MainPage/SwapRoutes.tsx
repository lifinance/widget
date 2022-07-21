/* eslint-disable react/no-array-index-key */
import { KeyboardArrowRight as KeyboardArrowRightIcon } from '@mui/icons-material';
import { Box, BoxProps, IconButton } from '@mui/material';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CardContainer, CardTitle } from '../../components/Card';
import { GasSufficiencyMessage } from '../../components/GasSufficiencyMessage';
import { ProgressToNextUpdate } from '../../components/ProgressToNextUpdate';
import {
  SwapRouteCard,
  SwapRouteCardSkeleton,
  SwapRouteNotFoundCard,
} from '../../components/SwapRouteCard';
import { useSwapRoutes } from '../../hooks';
import { navigationRoutes } from '../../utils';
import { Stack } from './SwapRoutes.style';

export const SwapRoutes: React.FC<BoxProps> = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    routes,
    isLoading,
    isFetching,
    isFetched,
    dataUpdatedAt,
    refetchTime,
    refetch,
  } = useSwapRoutes();

  const handleCardClick = useCallback(() => {
    navigate(navigationRoutes.swapRoutes);
  }, [navigate]);

  const currentRoute = routes?.[0];

  if (!currentRoute && !isLoading && !isFetching && !isFetched) {
    return null;
  }

  const routeNotFound = !currentRoute && isFetched;

  return (
    <>
      <CardContainer {...props}>
        <CardTitle>{t('swap.routes')}</CardTitle>
        {!routeNotFound ? (
          <ProgressToNextUpdate
            updatedAt={dataUpdatedAt}
            timeToUpdate={refetchTime}
            isLoading={isFetching}
            onClick={() => refetch()}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          />
        ) : null}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Stack direction="row" py={2} pl={2} pr={routeNotFound ? 2 : 1}>
            {routeNotFound ? (
              <SwapRouteNotFoundCard minWidth="100%" dense />
            ) : isLoading || isFetching || !currentRoute ? (
              <SwapRouteCardSkeleton minWidth="100%" active dense />
            ) : (
              <SwapRouteCard
                minWidth="100%"
                route={currentRoute}
                active
                dense
              />
            )}
          </Stack>
          {!routeNotFound ? (
            <Box py={1} pr={1}>
              <IconButton
                onClick={handleCardClick}
                size="medium"
                aria-label="swap-routes"
              >
                <KeyboardArrowRightIcon />
              </IconButton>
            </Box>
          ) : null}
        </Box>
      </CardContainer>
      {!isFetching ? (
        <GasSufficiencyMessage route={currentRoute} {...props} />
      ) : null}
    </>
  );
};
