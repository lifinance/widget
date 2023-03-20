import type { Route } from '@lifi/sdk';
import { createContext, useContext, useRef } from 'react';
import type { StoreApi, UseBoundStore } from 'zustand';
import { create } from 'zustand';
import type { PersistStoreProviderProps } from '../types';
import type { RecommendedRouteState } from './types';

export const createRecommendedRouteStore = () =>
  create<RecommendedRouteState>((set) => ({
    setRecommendedRoute: (recommendedRoute?: Route) => {
      set(() => ({
        recommendedRoute,
      }));
    },
  }));

export type RecommendedRouteStore = UseBoundStore<
  StoreApi<RecommendedRouteState>
>;

export const RecommendedRouteStoreContext =
  createContext<RecommendedRouteStore | null>(null);

export function RecommendedRouteStoreProvider({
  children,
  ...props
}: PersistStoreProviderProps) {
  const storeRef = useRef<RecommendedRouteStore>();
  if (!storeRef.current) {
    storeRef.current = createRecommendedRouteStore();
  }
  return (
    <RecommendedRouteStoreContext.Provider value={storeRef.current}>
      {children}
    </RecommendedRouteStoreContext.Provider>
  );
}

export function useRecommendedRouteStore<T>(
  selector: (state: RecommendedRouteState) => T,
  equalityFn?: (left: T, right: T) => boolean,
): T {
  const useStore = useContext(RecommendedRouteStoreContext);
  if (!useStore) {
    throw new Error(
      `You forgot to wrap your component in <${RecommendedRouteStoreProvider.name}>.`,
    );
  }
  return useStore(selector, equalityFn);
}

export function useRecommendedRouteStoreContext() {
  const useStore = useContext(RecommendedRouteStoreContext);
  if (!useStore) {
    throw new Error(
      `You forgot to wrap your component in <${RecommendedRouteStoreProvider.name}>.`,
    );
  }
  return useStore;
}
