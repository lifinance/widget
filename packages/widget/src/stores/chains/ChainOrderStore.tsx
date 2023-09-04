import { createContext, useContext, useRef } from 'react';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { PersistStoreProviderProps } from '../types';
import { createChainOrderStore } from './createChainOrderStore';
import type { ChainOrderState } from './types';

export type ChainOrderStore = UseBoundStore<StoreApi<ChainOrderState>>;

export const ChainOrderStoreContext = createContext<ChainOrderStore | null>(
  null,
);

export function ChainOrderStoreProvider({
  children,
  ...props
}: PersistStoreProviderProps) {
  const storeRef = useRef<ChainOrderStore>();
  if (!storeRef.current) {
    storeRef.current = createChainOrderStore(props);
  }
  return (
    <ChainOrderStoreContext.Provider value={storeRef.current}>
      {children}
    </ChainOrderStoreContext.Provider>
  );
}

export function useChainOrderStore<T>(
  selector: (state: ChainOrderState) => T,
  equalityFn?: (left: T, right: T) => boolean,
): T {
  const useStore = useContext(ChainOrderStoreContext);
  if (!useStore) {
    throw new Error(
      `You forgot to wrap your component in <${ChainOrderStoreProvider.name}>.`,
    );
  }
  return useStore(selector, equalityFn);
}

export function useChainOrderStoreContext() {
  const useStore = useContext(ChainOrderStoreContext);
  if (!useStore) {
    throw new Error(
      `You forgot to wrap your component in <${ChainOrderStoreProvider.name}>.`,
    );
  }
  return useStore;
}
