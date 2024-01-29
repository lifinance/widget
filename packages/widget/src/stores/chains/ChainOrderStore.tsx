import { createContext, useContext, useEffect, useRef } from 'react';
import type { StoreApi } from 'zustand';
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional';
import { useChains } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import { isItemAllowed } from '../../utils';
import type { FormType } from '../form';
import { useFieldActions } from '../form';
import type { PersistStoreProviderProps } from '../types';
import { createChainOrderStore } from './createChainOrderStore';
import type { ChainOrderState } from './types';

export type ChainOrderStore = UseBoundStoreWithEqualityFn<
  StoreApi<ChainOrderState>
>;

export const ChainOrderStoreContext = createContext<ChainOrderStore | null>(
  null,
);

export function ChainOrderStoreProvider({
  children,
  ...props
}: PersistStoreProviderProps) {
  const { chains: configChains } = useWidgetConfig();
  const storeRef = useRef<ChainOrderStore>();
  const { chains } = useChains();
  const { setFieldValue, getFieldValues } = useFieldActions();

  if (!storeRef.current) {
    storeRef.current = createChainOrderStore(props);
  }

  useEffect(() => {
    if (chains) {
      (['from', 'to'] as FormType[]).forEach((key) => {
        const filteredChains = configChains?.[key]
          ? chains.filter((chain) => isItemAllowed(chain.id, configChains[key]))
          : chains;
        const chainOrder = storeRef.current?.getState().initializeChains(
          filteredChains.map((chain) => chain.id),
          key,
        );
        if (chainOrder) {
          const [chainValue] = getFieldValues(`${key}Chain`);
          if (!chainValue) {
            setFieldValue(`${key}Chain`, chainOrder[0]);
          }
        }
      });
    }
  }, [chains, configChains, getFieldValues, setFieldValue]);

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
