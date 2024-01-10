import { createWithEqualityFn } from 'zustand/traditional';
import { persist } from 'zustand/middleware';
import type { BookmarksState } from './types';
import { createSimpleUID } from '../../utils';
import type { PersistStoreProps } from '@lifi/widget/stores/types';
import type { StateCreator } from 'zustand';

export const createBookmarksStore = ({ namePrefix }: PersistStoreProps) =>
  createWithEqualityFn<BookmarksState>(
    persist(
      (set, get) => ({
        selectedBookmarkWallet: undefined,
        bookmarkedWallets: [],
        recentWallets: [],
        getBookmarkedWallet: (address) =>
          get().bookmarkedWallets.find(
            (bookmarkedWallet) => bookmarkedWallet.address === address,
          ),
        addBookmarkedWallet: (name, address) => {
          set((state) => ({
            bookmarkedWallets: [{ name, address }, ...state.bookmarkedWallets],
          }));
        },
        removeBookmarkedWallet: (bookmarkedWallet) => {
          set((state) => ({
            bookmarkedWallets: state.bookmarkedWallets.filter(
              (storedBookmark) =>
                storedBookmark.address !== bookmarkedWallet.address,
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
              (storedRecent) => storedRecent.address !== bookmark.address,
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
