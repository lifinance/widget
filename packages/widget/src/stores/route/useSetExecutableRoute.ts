import { useRouteStore } from './useRouteStore';

export const useSetExecutableRoute = () => {
  return useRouteStore((state) => state.setExecutableRoute);
};
