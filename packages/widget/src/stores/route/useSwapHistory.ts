import shallow from 'zustand/shallow';
import { RouteExecution } from './types';
import { useRouteStore } from './useRouteStore';

export const useSwapHistory = (address?: string) => {
  return useRouteStore(
    (state) =>
      Object.values(state.routes)
        .filter(
          (item) =>
            item?.route.fromAddress === address && item?.status === 'success',
        )
        .sort(
          (a, b) =>
            (b?.route.steps[0].execution?.process[0].startedAt ?? 0) -
            (a?.route.steps[0].execution?.process[0].startedAt ?? 0),
        ) as RouteExecution[],
    shallow,
  );
};
