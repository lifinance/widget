/* eslint-disable react/no-array-index-key */
import { KeyboardArrowRight as KeyboardArrowRightIcon } from '@mui/icons-material';
import { Box, BoxProps, IconButton, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSwapRoutes } from '../../hooks';
import { formatTokenAmount } from '../../utils/format';
import { routes } from '../../utils/routes';
import { CardContainer } from '../Card';
import { SwapRouteCard } from '../SwapRouteCard';
import { Stack } from './SwapRoutes.style';

export const SwapRoutes: React.FC<BoxProps> = ({ mb }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { routes: swapRoutes, isLoading } = useSwapRoutes();

  const handleCardClick = () => {
    navigate(routes.swapRoutes);
  };

  if (!swapRoutes?.length && !isLoading) {
    return null;
  }

  return (
    <CardContainer mb={mb}>
      <Typography variant="body2" fontWeight="bold" pl={2} pt={2}>
        {t('swap.routes')}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Stack direction="row" spacing={2}>
          {isLoading
            ? Array.from({ length: 2 }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  width="75%"
                  height={195}
                  sx={{ borderRadius: 1, minWidth: '75%' }}
                />
              ))
            : swapRoutes
                ?.slice(0, 2)
                .map((route, index) => (
                  <SwapRouteCard
                    key={route.id}
                    onClick={index !== 0 ? handleCardClick : undefined}
                    minWidth="75%"
                    amount={formatTokenAmount(
                      route.toAmount,
                      route.toToken.decimals,
                    )}
                    token={route.toToken.name}
                    gas={t(`swap.currency`, { value: route.gasCostUSD })}
                    time={(
                      route.steps
                        .map((step) => step.estimate.executionDuration)
                        .reduce((cumulated, x) => cumulated + x) / 60
                    ).toFixed(0)}
                    type={index === 0 ? 'recommended' : 'fastest'}
                    active={index === 0}
                    blur={index !== 0}
                  />
                ))}
        </Stack>
        <Box p={1}>
          <IconButton
            onClick={handleCardClick}
            size="medium"
            aria-label="swap-routes"
            color="inherit"
          >
            <KeyboardArrowRightIcon />
          </IconButton>
        </Box>
      </Box>
    </CardContainer>
  );
};
