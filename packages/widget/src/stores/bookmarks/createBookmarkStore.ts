import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';
import type { PersistStoreProps } from '../types';
import type { BookmarkState } from './types';

const recentWalletsLimit = 5;

export const createBookmarksStore = ({ namePrefix }: PersistStoreProps) =>
  createWithEqualityFn<BookmarkState>(
    persist(
      (set, get) => ({
        selectedBookmark: undefined,
        bookmarks: [],
        recentWallets: [],
        getBookmark: (address) =>
          get().bookmarks.find(
            (bookmarkedWallet) => bookmarkedWallet.address === address,
          ),
        addBookmark: (name, address, addressType, chainType) => {
          set((state) => ({
            bookmarks: [
              { name, address, addressType, chainType },
              ...state.bookmarks,
            ],
          }));
        },
        removeBookmark: (bookmarkedWallet) => {
          set((state) => ({
            bookmarks: state.bookmarks.filter(
              (storedBookmark) =>
                storedBookmark.address !== bookmarkedWallet.address,
            ),
          }));
        },
        setSelectedBookmark: (bookmark) => {
          set((state) => ({
            selectedBookmark: bookmark,
          }));
        },
        addRecentWallet: (address, addressType, chainType) => {
          set((state) => ({
            recentWallets: [
              { address, addressType, chainType },
              ...state.recentWallets.filter(
                (recentWallet) => recentWallet.address !== address,
              ),
            ].slice(0, recentWalletsLimit),
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
        name: `${namePrefix || 'li.fi'}-bookmarks`,
        version: 0,
        partialize: (state) => ({
          bookmarks: state.bookmarks,
          recentWallets: state.recentWallets,
        }),
      },
    ) as StateCreator<BookmarkState, [], [], BookmarkState>,
    Object.is,
  );
