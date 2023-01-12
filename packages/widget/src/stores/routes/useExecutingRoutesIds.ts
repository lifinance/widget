import { shallow } from 'zustand/shallow';
import { useRouteExecutionStore } from './RouteExecutionStore';
import type { RouteExecution } from './types';
import { RouteExecutionStatus } from './types';

export const useExecutingRoutesIds = (address?: string) => {
  return useRouteExecutionStore(
    (state) =>
      (Object.values(state.routes) as RouteExecution[])
        .filter(
          (item) =>
            item.route.fromAddress === address &&
            (item.status === RouteExecutionStatus.Pending ||
              item.status === RouteExecutionStatus.Failed),
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
