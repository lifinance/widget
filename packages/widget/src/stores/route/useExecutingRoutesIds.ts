import shallow from 'zustand/shallow';
import type { RouteExecution } from './types';
import { useRouteStore } from './useRouteStore';

export const useExecutingRoutesIds = (address?: string) => {
  return useRouteStore(
    (state) =>
      (Object.values(state.routes) as RouteExecution[])
        .filter(
          (item) =>
            item.route.fromAddress === address &&
            (item.status === 'loading' || item.status === 'error'),
        )
        .sort(
          (a, b) =>
            (b?.route.steps[0].execution?.process[0].startedAt ?? 0) -
            (a?.route.steps[0].execution?.process[0].startedAt ?? 0),
        )
        .map(({ route }) => route.id),
    shallow,
  );
};
