import { shallow } from 'zustand/shallow';
import { useBookmarksStore } from './BookmarksStore';
import type { BookmarksProps } from './types';

export const useBookmarks = (): BookmarksProps => {
  const [bookmarkedWallets, selectedBookmarkWallet, recentWallets] =
    useBookmarksStore(
      (store) => [
        store.bookmarkedWallets,
        store.selectedBookmarkWallet,
        store.recentWallets,
      ],
      shallow,
    );

  return {
    bookmarkedWallets,
    selectedBookmarkWallet,
    recentWallets,
  };
};
