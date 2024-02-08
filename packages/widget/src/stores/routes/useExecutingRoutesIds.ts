import { shallow } from 'zustand/shallow';
import { useAccount } from '../../hooks/useAccount.js';
import { useRouteExecutionStore } from './RouteExecutionStore.js';
import type { RouteExecution } from './types.js';
import { RouteExecutionStatus } from './types.js';

export const useExecutingRoutesIds = () => {
  const { accounts } = useAccount();
  const accountAddresses = accounts.map((account) => account.address);
  return useRouteExecutionStore(
    (state) =>
      (Object.values(state.routes) as RouteExecution[])
        .filter(
          (item) =>
            accountAddresses.includes(item.route.fromAddress) &&
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
