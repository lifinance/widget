/* eslint-disable react/no-array-index-key */
import { Route } from '@lifi/sdk';
import { BoxProps } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    navigate(navigationRoutes.swap, {
      state: { routeId: route.id },
    });
  };

  useEffect(() => {
    if (!swapRoutes?.length && !isLoading && !isFetching) {
      navigate(navigationRoutes.home);
    }
    // redirect to the home page if no routes are found on page reload
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return setHeaderAction(
      navigationRoutes.swapRoutes,
      <ProgressToNextUpdate
        updatedAt={dataUpdatedAt}
        timeToUpdate={refetchTime}
        isLoading={isFetching}
        onClick={() => refetch()}
        sx={{ marginRight: -1 }}
        size="medium"
        edge="end"
      />,
    );
  }, [dataUpdatedAt, isFetching, refetch, refetchTime, setHeaderAction]);

  const routeNotFound = !swapRoutes?.length && isFetched;

  return (
    <Stack direction="column" spacing={2}>
      {routeNotFound ? (
        <SwapRouteNotFoundCard dense />
      ) : isLoading || isFetching ? (
        Array.from({ length: 3 }).map((_, index) => (
          <SwapRouteCardSkeleton key={index} dense />
        ))
      ) : (
        swapRoutes?.map((route, index) => (
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
