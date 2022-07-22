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
        <Box sx={{ display: 'flex' }}>
          <Stack
            direction="row"
            spacing={2}
            my={2}
            ml={2}
            mr={routeNotFound ? 2 : 1}
            sx={{
              borderWidth: isFetching || (routes && routes.length > 1) ? 1 : 0,
            }}
          >
            {routeNotFound ? (
              <SwapRouteNotFoundCard minWidth="100%" dense />
            ) : isLoading || isFetching || !currentRoute ? (
              <>
                <SwapRouteCardSkeleton minWidth="80%" dense />
                <SwapRouteCardSkeleton minWidth="80%" dense />
              </>
            ) : (
              <>
                <SwapRouteCard
                  minWidth={routes.length > 1 ? '80%' : '100%'}
                  route={currentRoute}
                  active
                  dense
                />
                {routes.length > 1 ? (
                  <SwapRouteCard minWidth="80%" route={routes[1]} dense />
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
                >
                  <KeyboardArrowRightIcon />
                </IconButton>
              </Box>
            ) : null}
          </Box>
        </Box>
      </CardContainer>
      {!isFetching ? (
        <GasSufficiencyMessage route={currentRoute} {...props} />
      ) : null}
    </>
  );
};
