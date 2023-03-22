import { useRecommendedRouteStore } from './useRecommendedRouteStore';

export const useSetRecommendedRoute = () => {
  return useRecommendedRouteStore((state) => state.setRecommendedRoute);
};
