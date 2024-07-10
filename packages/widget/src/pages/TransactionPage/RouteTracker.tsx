import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useRef, useState } from 'react';
import { ProgressToNextUpdate } from '../../components/ProgressToNextUpdate.js';
import { useRoutes } from '../../hooks/useRoutes.js';
import { useRouteExecutionStoreContext } from '../../stores/routes/RouteExecutionStore.js';
import { useSetExecutableRoute } from '../../stores/routes/useSetExecutableRoute.js';

export interface RouteTrackerProps {
  observableRouteId: string;
  onChange: Dispatch<SetStateAction<string>>;
  onFetching: Dispatch<SetStateAction<boolean>>;
}

export const RouteTracker = ({
  observableRouteId,
  onChange,
  onFetching,
}: RouteTrackerProps) => {
  const routeExecutionStore = useRouteExecutionStoreContext();
  const setExecutableRoute = useSetExecutableRoute();
  const [observableRoute] = useState(
    () => routeExecutionStore.getState().routes[observableRouteId]?.route,
  );
  const observableRouteIdRef = useRef(observableRoute?.id);
  const { routes, isFetching, dataUpdatedAt, refetchTime, refetch } = useRoutes(
    { observableRoute },
  );
  const currentRoute = routes?.[0];

  useEffect(() => {
    if (
      observableRouteIdRef.current &&
      currentRoute &&
      observableRouteIdRef.current !== currentRoute.id
    ) {
      observableRouteIdRef.current = currentRoute.id;
      setExecutableRoute(currentRoute);
      onChange(currentRoute.id);
    }
  }, [currentRoute, observableRouteIdRef, onChange, setExecutableRoute]);

  useEffect(() => {
    onFetching(isFetching);
  }, [isFetching, onFetching]);

  const handleRefetch = () => {
    refetch();
  };

  return (
    <ProgressToNextUpdate
      updatedAt={dataUpdatedAt || new Date().getTime()}
      timeToUpdate={refetchTime}
      isLoading={isFetching}
      onClick={handleRefetch}
      sx={{ marginRight: -1 }}
      size="medium"
    />
  );
};
