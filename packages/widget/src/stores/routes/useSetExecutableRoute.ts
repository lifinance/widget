import { useRouteExecutionStore } from './RouteExecutionStore';

export const useSetExecutableRoute = () => {
  return useRouteExecutionStore((state) => state.setExecutableRoute);
};
