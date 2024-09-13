import { createContext, useContext, useEffect, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import type { PersistStoreProviderProps } from '../types.js';
import { createBookmarksStore } from './createBookmarkStore.js';
import type { BookmarkState, BookmarkStore } from './types.js';

export const BookmarkStoreContext = createContext<BookmarkStore | null>(null);

export const BookmarkStoreProvider: React.FC<PersistStoreProviderProps> = ({
  children,
  ...props
}) => {
  const { toAddress, formUpdateKey } = useWidgetConfig();
  const storeRef = useRef<BookmarkStore>();

  if (!storeRef.current) {
    storeRef.current = createBookmarksStore({ ...props, toAddress });
  }

  useEffect(() => {
    storeRef?.current?.getState()?.setSelectedBookmark(toAddress);
    // formUpdateKey is a unique key used to force updates for the form field values
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toAddress, formUpdateKey]);

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
