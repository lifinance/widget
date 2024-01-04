import { createContext, PropsWithChildren, useContext, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import { BookmarksState, BookmarksStore } from './types';
import { createBookmarksStore } from './createBookmarksStore';

export const BookmarksStoreContext = createContext<BookmarksStore | null>(null);

export const BookmarkStoreProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const storeRef = useRef<BookmarksStore>();

  if (!storeRef.current) {
    storeRef.current = createBookmarksStore();
  }

  return (
    <BookmarksStoreContext.Provider value={storeRef.current}>
      {children}
    </BookmarksStoreContext.Provider>
  );
};

export const useBookmarksStore = (
  selector: (store: BookmarksState) => any,
  equalityFunction = shallow,
) => {
  const useStore = useContext(BookmarksStoreContext);

  if (!useStore) {
    throw new Error(
      `You forgot to wrap your component in <${BookmarkStoreProvider.name}>.`,
    );
  }

  return useStore(selector, equalityFunction);
};
