/* eslint-disable react/no-array-index-key */
import { BoxProps, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SwapRouteCard } from '../../components/SwapRouteCard';
import { useSwapRoutes } from '../../hooks';
import { Stack } from './SwapRoutesPage.style';

export const SwapRoutesPage: React.FC<BoxProps> = ({ mb }) => {
  const { t } = useTranslation();
  const { routes, isLoading } = useSwapRoutes();

  if (!routes?.length && !isLoading) {
    // TODO: make no routes message
    return null;
  }

  return (
    <Stack direction="column" spacing={2}>
      {isLoading
        ? Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width="100%"
              height={195}
              sx={{ borderRadius: 1 }}
            />
          ))
        : routes?.map((route, index) => (
            <SwapRouteCard
              key={route.id}
              route={route}
              index={index}
              active={index === 0}
            />
          ))}
    </Stack>
  );
};
