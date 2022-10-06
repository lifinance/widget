import type { Route } from '@lifi/sdk';
import { useEffect } from 'react';
import { useRecommendedRouteStore } from '../../stores';

export const useSetRecommendedRoute = (
  currentRoute?: Route,
  isFetching?: boolean,
) => {
  const setRecommendedRoute = useRecommendedRouteStore(
    (state) => state.setRecommendedRoute,
  );

  useEffect(() => {
    setRecommendedRoute(!isFetching ? currentRoute : undefined);
    return () => setRecommendedRoute(undefined);
  }, [currentRoute, isFetching, setRecommendedRoute]);
};
