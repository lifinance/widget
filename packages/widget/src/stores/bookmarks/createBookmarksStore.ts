import type { StateCreator } from 'zustand';
import { createWithEqualityFn } from 'zustand/traditional';
import { persist } from 'zustand/middleware';
import type { BookmarksState } from './types';
import type { PersistStoreProps } from '../../stores/types';

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
        addBookmarkedWallet: (name, address, addressType, chainType) => {
          set((state) => ({
            bookmarkedWallets: [
              { name, address, addressType, chainType },
              ...state.bookmarkedWallets,
            ],
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
        addRecentWallet: (address, addressType, chainType) => {
          const recentLimit = 5;

          set((state) => ({
            recentWallets: [
              { address, addressType, chainType },
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
