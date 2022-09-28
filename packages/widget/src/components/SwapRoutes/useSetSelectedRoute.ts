import type { Route } from '@lifi/sdk';
import { useEffect } from 'react';
import { useSelectedRouteStore } from '../../stores';

export const useSetSelectedRoute = (
  currentRoute?: Route,
  isFetching?: boolean,
) => {
  const setSelectedRoute = useSelectedRouteStore(
    (state) => state.setSelectedRoute,
  );

  useEffect(() => {
    setSelectedRoute(!isFetching ? currentRoute : undefined);
    return () => setSelectedRoute(undefined);
  }, [currentRoute, isFetching, setSelectedRoute]);
};
