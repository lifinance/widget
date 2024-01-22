import { createContext, useContext, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import type { PersistStoreProviderProps } from '../types';
import { createBookmarksStore } from './createBookmarkStore';
import type { BookmarkState, BookmarkStore } from './types';

export const BookmarkStoreContext = createContext<BookmarkStore | null>(null);

export const BookmarkStoreProvider: React.FC<PersistStoreProviderProps> = ({
  children,
  ...props
}) => {
  const storeRef = useRef<BookmarkStore>();

  if (!storeRef.current) {
    storeRef.current = createBookmarksStore(props);
  }

  return (
    <BookmarkStoreContext.Provider value={storeRef.current}>
      {children}
    </BookmarkStoreContext.Provider>
  );
};

export function useBookmarkStore<T>(
  selector: (store: BookmarkState) => T,
  equalityFunction = shallow,
) {
  const useStore = useContext(BookmarkStoreContext);

  if (!useStore) {
    throw new Error(
      `You forgot to wrap your component in <${BookmarkStoreProvider.name}>.`,
    );
  }

  return useStore(selector, equalityFunction);
}
