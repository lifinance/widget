import { createContext, useContext, useRef } from 'react';
import { createWithEqualityFn } from 'zustand/traditional';
import type { PersistStoreProps, PersistStoreProviderProps } from '../types.js';
import type { HeaderState, HeaderStore } from './types.js';

export const HeaderStoreContext = createContext<HeaderStore | null>(null);

export function HeaderStoreProvider({
  children,
  ...props
}: PersistStoreProviderProps) {
  const storeRef = useRef<HeaderStore>();
  if (!storeRef.current) {
    storeRef.current = createHeaderStore(props);
  }
  return (
    <HeaderStoreContext.Provider value={storeRef.current}>
      {children}
    </HeaderStoreContext.Provider>
  );
}

export function useHeaderStore<T>(selector: (state: HeaderState) => T): T {
  const useStore = useContext(HeaderStoreContext);
  if (!useStore) {
    throw new Error(
      `You forgot to wrap your component in <${HeaderStoreProvider.name}>.`,
    );
  }
  return useStore(selector);
}

export function useHeaderStoreContext() {
  const useStore = useContext(HeaderStoreContext);
  if (!useStore) {
    throw new Error(
      `You forgot to wrap your component in <${HeaderStoreProvider.name}>.`,
    );
  }
  return useStore;
}

export const createHeaderStore = ({ namePrefix }: PersistStoreProps) =>
  createWithEqualityFn<HeaderState>(
    (set, get) => ({
      setAction: (element) => {
        set(() => ({
          element,
        }));
        return get().removeAction;
      },
      setTitle: (title) => {
        set(() => ({
          title,
        }));
        return get().removeTitle;
      },
      removeAction: () => {
        set(() => ({
          element: null,
        }));
      },
      removeTitle: () => {
        set(() => ({
          title: undefined,
        }));
      },
    }),
    Object.is,
  );
