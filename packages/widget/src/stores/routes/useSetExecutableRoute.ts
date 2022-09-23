import { useRouteExecutionStore } from './useRouteExecutionStore';

export const useSetExecutableRoute = () => {
  return useRouteExecutionStore((state) => state.setExecutableRoute);
};
