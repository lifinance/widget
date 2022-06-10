import { Route } from '@lifinance/sdk';
import shallow from 'zustand/shallow';
import { useRouteStore } from './useRouteStore';

export const useCurrentRoute = (): [
  Route | undefined,
  (route?: Route) => void,
] => {
  return useRouteStore(
    (state) => [state.currentRoute, state.setCurrentRoute],
    shallow,
  );
};
