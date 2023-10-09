import { createContext, useContext, useRef } from 'react';
import { createWithEqualityFn } from 'zustand/traditional';
import type {
  SplitSubvariantProps,
  SplitSubvariantProviderProps,
  SplitSubvariantState,
  SplitSubvariantStore,
} from './types';

export const SplitSubvariantStoreContext =
  createContext<SplitSubvariantStore | null>(null);

const shouldRecreateStore = (
  store: SplitSubvariantStore,
  props: SplitSubvariantProps,
) => {
  const { state } = store.getState();
  return state !== props.state;
};

export function SplitSubvariantStoreProvider({
  children,
  ...props
}: SplitSubvariantProviderProps) {
  const storeRef = useRef<SplitSubvariantStore>();
  if (!storeRef.current || shouldRecreateStore(storeRef.current, props)) {
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
  createWithEqualityFn<SplitSubvariantState>(
    (set) => ({
      state,
      setState(state) {
        set(() => ({
          state,
        }));
      },
    }),
    Object.is,
  );
