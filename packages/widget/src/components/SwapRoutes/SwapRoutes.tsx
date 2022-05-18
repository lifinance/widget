/* eslint-disable react/no-array-index-key */
import { Box, BoxProps, Skeleton } from '@mui/material';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSwapRoutes } from '../../hooks';
import { routes } from '../../utils/routes';
import { CardContainer, CardTitle } from '../Card';
import { SwapRouteCard } from '../SwapRouteCard';
import { Stack } from './SwapRoutes.style';

export const SwapRoutes: React.FC<BoxProps> = ({ mb }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { routes: swapRoutes, isLoading } = useSwapRoutes();

  const handleCardClick = useCallback(() => {
    navigate(routes.swapRoutes);
  }, [navigate]);

  if (!swapRoutes?.length && !isLoading) {
    return null;
  }

  return (
    <CardContainer mb={mb}>
      <CardTitle>{t('swap.routes')}</CardTitle>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Stack direction="row" spacing={2}>
          {isLoading
            ? Array.from({ length: 2 }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  width="75%"
                  height={193}
                  sx={{ borderRadius: 1, minWidth: '75%' }}
                />
              ))
            : swapRoutes
                ?.slice(0, 2)
                .map((route, index) => (
                  <SwapRouteCard
                    key={route.id}
                    onClick={index !== 0 ? handleCardClick : undefined}
                    minWidth="80%"
                    route={route}
                    index={index}
                    active={index === 0}
                    blur={index !== 0}
                    dense
                  />
                ))}
        </Stack>
        {/* <Box p={1}>
          <IconButton
            onClick={handleCardClick}
            size="medium"
            aria-label="swap-routes"
            color="inherit"
          >
            <KeyboardArrowRightIcon />
          </IconButton>
        </Box> */}
      </Box>
    </CardContainer>
  );
};
