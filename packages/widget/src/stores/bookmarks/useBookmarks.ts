import { shallow } from 'zustand/shallow';
import { useBookmarkStore } from './BookmarkStore';
import type { BookmarkProps } from './types';

export const useBookmarks = (): BookmarkProps => {
  const [bookmarkedWallets, selectedBookmarkWallet, recentWallets] =
    useBookmarkStore(
      (store) => [store.bookmarks, store.selectedBookmark, store.recentWallets],
      shallow,
    );

  return {
    bookmarks: bookmarkedWallets,
    selectedBookmark: selectedBookmarkWallet,
    recentWallets,
  };
};
