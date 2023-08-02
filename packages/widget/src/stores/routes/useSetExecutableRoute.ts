import { useRouteExecutionStore } from './RouteExecutionStore';

export const useSetExecutableRoute: any = () => {
  return useRouteExecutionStore((state) => state.setExecutableRoute);
};
