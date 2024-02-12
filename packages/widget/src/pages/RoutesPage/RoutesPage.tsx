/* eslint-disable react/no-array-index-key */
import type { Route } from '@lifi/sdk';
import type { BoxProps } from '@mui/material';
import { useEffect } from 'react';
import { ProgressToNextUpdate } from '../../components/ProgressToNextUpdate.js';
import { RouteCard } from '../../components/RouteCard/RouteCard.js';
import { RouteCardSkeleton } from '../../components/RouteCard/RouteCardSkeleton.js';
import { RouteNotFoundCard } from '../../components/RouteCard/RouteNotFoundCard.js';
import { useNavigateBack } from '../../hooks/useNavigateBack.js';
import { useRoutes } from '../../hooks/useRoutes.js';
import { useHeaderStoreContext } from '../../stores/header/useHeaderStore.js';
import { useSetExecutableRoute } from '../../stores/routes/useSetExecutableRoute.js';
import { navigationRoutes } from '../../utils/navigationRoutes.js';
import { Stack } from './RoutesPage.style.js';

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
            key={index}
            route={route}
            onClick={() => handleRouteClick(route)}
            active={index === 0}
            expanded={routes?.length === 1}
          />
        ))
      )}
    </Stack>
  );
};
