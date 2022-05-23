/* eslint-disable react/no-array-index-key */
import { Route } from '@lifinance/sdk';
import { BoxProps, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SwapRouteCard } from '../../components/SwapRouteCard';
import { useCurrentRoute, useSwapRoutes } from '../../hooks';
import { Stack } from './SwapRoutesPage.style';

export const SwapRoutesPage: React.FC<BoxProps> = () => {
  const navigate = useNavigate();
  const { routes, isLoading, isFetching } = useSwapRoutes();
  const [currentRoute, setCurrentRoute] = useCurrentRoute();

  if (!routes?.length && !isLoading && !isFetching) {
    // TODO: make no routes message
    return null;
  }

  const handleRouteClick = (route: Route) => {
    setCurrentRoute(route);
    navigate(-1);
  };

  return (
    <Stack direction="column" spacing={2}>
      {isLoading || isFetching
        ? Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width="100%"
              height={196}
              sx={{ borderRadius: 1 }}
            />
          ))
        : routes?.map((route, index) => (
            <SwapRouteCard
              key={route.id}
              route={route}
              active={currentRoute?.id === route.id}
              onClick={() => handleRouteClick(route)}
            />
          ))}
    </Stack>
  );
};
