import { useRouteStore } from './useRouteStore';

export const useExecutingRoutes = () => {
  return useRouteStore((state) =>
    Object.values(state.routes).filter(
      (route) => route.status === 'loading' || route.status === 'error',
    ),
  );
};
