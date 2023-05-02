import { createContext, useContext, useRef } from 'react';
import { create } from 'zustand';
import type {
  SplitSubvariantProps,
  SplitSubvariantProviderProps,
  SplitSubvariantState,
  SplitSubvariantStore,
} from './types';

export const SplitSubvariantStoreContext =
  createContext<SplitSubvariantStore | null>(null);

export function SplitSubvariantStoreProvider({
  children,
  ...props
}: SplitSubvariantProviderProps) {
  const storeRef = useRef<SplitSubvariantStore>();
  if (!storeRef.current) {
    storeRef.current = createSplitSubvariantStore(props);
  }
  return (
    <SplitSubvariantStoreContext.Provider value={storeRef.current}>
      {children}
    </SplitSubvariantStoreContext.Provider>
  );
}

export function useSplitSubvariantStore<T>(
  selector: (state: SplitSubvariantState) => T,
  equalityFn?: (left: T, right: T) => boolean,
): T {
  const useStore = useContext(SplitSubvariantStoreContext);
  if (!useStore) {
    throw new Error(
      `You forgot to wrap your component in <${SplitSubvariantStoreProvider.name}>.`,
    );
  }
  return useStore(selector, equalityFn);
}

export function useSplitSubvariantStoreContext() {
  const useStore = useContext(SplitSubvariantStoreContext);
  if (!useStore) {
    throw new Error(
      `You forgot to wrap your component in <${SplitSubvariantStoreProvider.name}>.`,
    );
  }
  return useStore;
}

export const createSplitSubvariantStore = ({ state }: SplitSubvariantProps) =>
  create<SplitSubvariantState>((set) => ({
    state,
    setState(state) {
      set(() => ({
        state,
      }));
    },
  }));
