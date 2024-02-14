import { shallow } from 'zustand/shallow';
import { useBookmarkStore } from './BookmarkStore.js';
import type { BookmarkActions } from './types.js';

export const useBookmarkActions = () => {
  const actions = useBookmarkStore<BookmarkActions>(
    (store) => ({
      getBookmark: store.getBookmark,
      addBookmark: store.addBookmark,
      removeBookmark: store.removeBookmark,
      setSelectedBookmark: store.setSelectedBookmark,
      getSelectedBookmark: store.getSelectedBookmark,
      addRecentWallet: store.addRecentWallet,
      removeRecentWallet: store.removeRecentWallet,
    }),
    shallow,
  );

  return actions;
};
