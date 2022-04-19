import { formatTokenAmount } from '@lifinance/widget/utils/format';
import { BoxProps, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSwapRoutes } from '../../hooks';
import { routes } from '../../utils/routes';
import { CardContainer } from '../CardContainer';
import { SwapRouteCard } from '../SwapRouteCard';
import { Stack } from './SwapRoutes.style';

export const SwapRoutes: React.FC<BoxProps> = ({ mb }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { routes: swapRoutes, isFetching, isFetched } = useSwapRoutes();

  const handleCardClick = () => {
    navigate(routes.swapRoutes);
  };

  if (!swapRoutes?.length && !isFetched && !isFetching) {
    return null;
  }

  return (
    <CardContainer mb={mb}>
      <Typography variant="body2" fontWeight="bold" pl={2} pt={2}>
        {t('swap.routes')}
      </Typography>
      <Stack direction="row" spacing={2}>
        {!swapRoutes?.length && isFetching
          ? Array.from({ length: 2 }).map(() => (
              <Skeleton
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
    </CardContainer>
  );
};
