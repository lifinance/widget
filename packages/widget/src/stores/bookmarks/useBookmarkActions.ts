import { shallow } from 'zustand/shallow';
import { useBookmarkStore } from './BookmarkStore';
import type { BookmarkActions } from './types';

export const useBookmarkActions = () => {
  const actions = useBookmarkStore<BookmarkActions>(
    (store) => ({
      getBookmark: store.getBookmark,
      addBookmark: store.addBookmark,
      removeBookmark: store.removeBookmark,
      setSelectedBookmark: store.setSelectedBookmark,
      addRecentWallet: store.addRecentWallet,
      removeRecentWallet: store.removeRecentWallet,
    }),
    shallow,
  );

  return actions;
};
