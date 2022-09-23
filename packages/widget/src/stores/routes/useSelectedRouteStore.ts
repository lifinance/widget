import type { Route } from '@lifi/sdk';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { SelectedRouteStore } from './types';

export const useSelectedRouteStore = create<SelectedRouteStore>()(
  immer((set) => ({
    setSelectedRoute: (route?: Route) => {
      set((state) => {
        state.selectedRoute = route;
      });
    },
  })),
);
