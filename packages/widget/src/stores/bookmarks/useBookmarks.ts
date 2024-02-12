import { shallow } from 'zustand/shallow';
import { useBookmarkStore } from './BookmarkStore.js';
import type { BookmarkProps } from './types.js';

export const useBookmarks = (): BookmarkProps => {
  const [bookmarks, selectedBookmark, recentWallets] = useBookmarkStore(
    (store) => [store.bookmarks, store.selectedBookmark, store.recentWallets],
    shallow,
  );

  return {
    bookmarks,
    selectedBookmark,
    recentWallets,
  };
};
