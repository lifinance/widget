import type { Route } from '@lifi/sdk';
import create from 'zustand';
import type { RecommendedRouteStore } from './types';

export const useRecommendedRouteStore = create<RecommendedRouteStore>(
  (set) => ({
    setRecommendedRoute: (recommendedRoute?: Route) => {
      set(() => ({
        recommendedRoute,
      }));
    },
  }),
);
