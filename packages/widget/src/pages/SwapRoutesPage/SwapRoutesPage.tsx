/* eslint-disable react/no-array-index-key */
import type { Route } from '@lifi/sdk';
import type { BoxProps } from '@mui/material';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSetHeaderAction } from '../../components/Header';
import { ProgressToNextUpdate } from '../../components/ProgressToNextUpdate';
import {
  SwapRouteCard,
  SwapRouteCardSkeleton,
  SwapRouteNotFoundCard,
} from '../../components/SwapRouteCard';
import { useSwapRoutes } from '../../hooks';
import { useSetExecutableRoute } from '../../stores';
import { navigationRoutes } from '../../utils';
import { Stack } from './SwapRoutesPage.style';

export const SwapRoutesPage: React.FC<BoxProps> = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const setHeaderAction = useSetHeaderAction();
  const {
    routes: swapRoutes,
    isLoading,
    isFetching,
    isFetched,
    dataUpdatedAt,
    refetchTime,
    refetch,
  } = useSwapRoutes();
  const setExecutableRoute = useSetExecutableRoute();

  const handleRouteClick = (route: Route) => {
    setExecutableRoute(route);
    navigate(navigationRoutes.swapExecution, {
      state: { routeId: route.id },
    });
  };

  useEffect(() => {
    if (!swapRoutes?.length && !isLoading && !isFetching) {
      navigate(pathname.substring(0, pathname.lastIndexOf('/')));
    }
    // redirect to the home page if no routes are found on page reload
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return setHeaderAction(
      <ProgressToNextUpdate
        updatedAt={dataUpdatedAt || new Date().getTime()}
        timeToUpdate={refetchTime}
        isLoading={isFetching}
        onClick={() => refetch()}
        sx={{ marginRight: -1 }}
        size="medium"
        edge="end"
      />,
    );
  }, [dataUpdatedAt, isFetching, refetch, refetchTime, setHeaderAction]);

  const routeNotFound = !swapRoutes?.length && !isLoading && !isFetching;

  return (
    <Stack direction="column" spacing={2} flex={1}>
      {routeNotFound ? (
        <SwapRouteNotFoundCard />
      ) : isLoading || isFetching ? (
        Array.from({ length: 3 }).map((_, index) => (
          <SwapRouteCardSkeleton key={index} />
        ))
      ) : (
        swapRoutes?.map((route) => (
          <SwapRouteCard
            key={route.id}
            route={route}
            onClick={() => handleRouteClick(route)}
          />
        ))
      )}
    </Stack>
  );
};
