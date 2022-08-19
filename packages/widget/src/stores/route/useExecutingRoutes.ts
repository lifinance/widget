import shallow from 'zustand/shallow';
import type { RouteExecution } from './types';
import { useRouteStore } from './useRouteStore';

export const useExecutingRoutes = (address?: string) => {
  return useRouteStore(
    (state) =>
      Object.values(state.routes).filter(
        (item) =>
          item?.route.fromAddress === address &&
          (item?.status === 'loading' || item?.status === 'error'),
      ) as RouteExecution[],
    shallow,
  );
};
