import type { Route } from '@lifi/sdk';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { RecommendedRouteStore } from './types';

export const useRecommendedRouteStore = create<RecommendedRouteStore>()(
  immer((set) => ({
    setRecommendedRoute: (route?: Route) => {
      set((state) => {
        state.recommendedRoute = route;
      });
    },
  })),
);
