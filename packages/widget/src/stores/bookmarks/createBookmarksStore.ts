import { createWithEqualityFn } from 'zustand/traditional';
import { persist } from 'zustand/middleware';
import { BookmarksState } from './types';
import { createSimpleUID } from '../../utils';
import { PersistStoreProps } from '@lifi/widget/stores/types';
import { StateCreator } from 'zustand';

export const createBookmarksStore = ({ namePrefix }: PersistStoreProps) =>
  createWithEqualityFn<BookmarksState>(
    persist(
      (set) => ({
        selectedBookmarkWallet: undefined,
        bookmarkedWallets: [],
        recentWallets: [],
        addBookmarkedWallet: (name, address) => {
          set((state) => ({
            bookmarkedWallets: [
              { name, address, id: createSimpleUID() },
              ...state.bookmarkedWallets,
            ],
          }));
        },
        removeBookmarkedWallet: (bookmarkedWallet) => {
          set((state) => ({
            bookmarkedWallets: state.bookmarkedWallets.filter(
              (storedBookmark) => storedBookmark.id !== bookmarkedWallet.id,
            ),
          }));
        },
        setSelectedBookmarkWallet: (bookmark) => {
          set((state) => ({
            selectedBookmarkWallet: bookmark,
          }));
        },
        addRecentWallet: (address) => {
          const recentLimit = 5;

          set((state) => ({
            recentWallets: [
              { address, id: createSimpleUID() },
              ...state.recentWallets.filter(
                (recentWallet) => recentWallet.address !== address,
              ),
            ].slice(0, recentLimit),
          }));
        },
        removeRecentWallet: (bookmark) => {
          set((state) => ({
            recentWallets: state.recentWallets.filter(
              (storedRecent) => storedRecent.id !== bookmark.id,
            ),
          }));
        },
      }),
      {
        name: `${namePrefix || 'li.fi'}-bookmarked-addresses`,
        version: 0,
        partialize: (state) => ({
          bookmarkedWallets: state.bookmarkedWallets,
          recentWallets: state.recentWallets,
        }),
      },
    ) as StateCreator<BookmarksState, [], [], BookmarksState>,
    Object.is,
  );
