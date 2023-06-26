/* eslint-disable react/no-array-index-key */
import type { Route } from '@lifi/sdk';
import type { BoxProps } from '@mui/material';
import { useEffect } from 'react';
import { ProgressToNextUpdate } from '../../components/ProgressToNextUpdate';
import {
  RouteCard,
  RouteCardSkeleton,
  RouteNotFoundCard,
} from '../../components/RouteCard';
import { useNavigateBack, useRoutes } from '../../hooks';
import { useHeaderStoreContext, useSetExecutableRoute } from '../../stores';
import { navigationRoutes } from '../../utils';
import { Stack } from './RoutesPage.style';

export const RoutesPage: React.FC<BoxProps> = () => {
  const { navigateBack, navigate } = useNavigateBack();
  const { routes, isLoading, isFetching, dataUpdatedAt, refetchTime, refetch } =
    useRoutes();
  const setExecutableRoute = useSetExecutableRoute();
  const headerStoreContext = useHeaderStoreContext();

  const handleRouteClick = (route: Route) => {
    setExecutableRoute(route);
    navigate(navigationRoutes.transactionExecution, {
      state: { routeId: route.id },
    });
  };

  useEffect(() => {
    if (!routes?.length && !isLoading && !isFetching) {
      navigateBack();
    }
    // redirect to the home page if no routes are found on page reload
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return headerStoreContext
      .getState()
      .setAction(
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
  }, [dataUpdatedAt, headerStoreContext, isFetching, refetch, refetchTime]);

  const routeNotFound = !routes?.length && !isLoading && !isFetching;

  return (
    <Stack direction="column" spacing={2} flex={1}>
      {routeNotFound ? (
        <RouteNotFoundCard />
      ) : isLoading ? (
        Array.from({ length: 3 }).map((_, index) => (
          <RouteCardSkeleton key={index} />
        ))
      ) : (
        routes?.map((route: Route, index: number) => (
          <RouteCard
            key={route.id}
            route={route}
            onClick={() => handleRouteClick(route)}
            active={index === 0}
            expanded={routes?.length <= 2}
          />
        ))
      )}
    </Stack>
  );
};
