/* eslint-disable react/no-array-index-key */
import { KeyboardArrowRight as KeyboardArrowRightIcon } from '@mui/icons-material';
import { Box, BoxProps, IconButton } from '@mui/material';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSwapRoutes } from '../../hooks';
import { useCurrentRoute } from '../../stores';
import { routes } from '../../utils/routes';
import { CardContainer, CardTitle } from '../Card';
import {
  SwapRouteCard,
  SwapRouteCardSkeleton,
  SwapRouteNotFoundCard,
} from '../SwapRouteCard';
import { Stack } from './SwapRoutes.style';
import { SwapRoutesUpdateProgress } from './SwapRoutesUpdateProgress';

export const SwapRoutes: React.FC<BoxProps> = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentRoute] = useCurrentRoute();
  const {
    routes: swapRoutes,
    isLoading,
    isFetching,
    isFetched,
  } = useSwapRoutes();

  const handleCardClick = useCallback(() => {
    navigate(routes.swapRoutes);
  }, [navigate]);

  if (!swapRoutes?.length && !isLoading && !isFetching && !isFetched) {
    return null;
  }

  const routeNotFound = !swapRoutes?.length && isFetched;

  return (
    <CardContainer {...props}>
      <CardTitle>{t('swap.routes')}</CardTitle>
      {!routeNotFound ? (
        <SwapRoutesUpdateProgress
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
            <SwapRouteCard minWidth="100%" route={currentRoute} active dense />
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
  );
};
