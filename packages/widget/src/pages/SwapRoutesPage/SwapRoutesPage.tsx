/* eslint-disable react/no-array-index-key */
import { Route } from '@lifi/sdk';
import { BoxProps } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SwapRouteCard,
  SwapRouteCardSkeleton,
  SwapRouteNotFoundCard,
} from '../../components/SwapRouteCard';
import { useSwapRoutes } from '../../hooks';
import { useCurrentRoute, useSetExecutableRoute } from '../../stores';
import { routes } from '../../utils/routes';
import { Stack } from './SwapRoutesPage.style';

export const SwapRoutesPage: React.FC<BoxProps> = () => {
  const navigate = useNavigate();
  const {
    routes: swapRoutes,
    isLoading,
    isFetching,
    isFetched,
  } = useSwapRoutes();
  const [currentRoute] = useCurrentRoute();
  const setExecutableRoute = useSetExecutableRoute();

  const handleRouteClick = (route: Route) => {
    setExecutableRoute(route);
    navigate(routes.swap, { state: { routeId: route.id }, replace: true });
  };

  useEffect(() => {
    if (!swapRoutes?.length && !isLoading && !isFetching) {
      navigate(routes.home);
    }
    // redirect to the home page if no routes are found on page reload
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const routeNotFound = !swapRoutes?.length && isFetched;

  return (
    <Stack direction="column" spacing={2}>
      {routeNotFound ? (
        <SwapRouteNotFoundCard minWidth="100%" dense />
      ) : isLoading || isFetching ? (
        Array.from({ length: 3 }).map((_, index) => (
          <SwapRouteCardSkeleton key={index} minWidth="100%" dense />
        ))
      ) : (
        swapRoutes?.map((route, index) => (
          <SwapRouteCard
            key={route.id}
            route={route}
            active={currentRoute?.id === route.id}
            onClick={() => handleRouteClick(route)}
          />
        ))
      )}
    </Stack>
  );
};
