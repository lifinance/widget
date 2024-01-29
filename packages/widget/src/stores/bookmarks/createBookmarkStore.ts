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
          get().bookmarks.find((bookmark) => bookmark.address === address),
        addBookmark: (bookmark) => {
          set((state) => ({
            bookmarks: [bookmark, ...state.bookmarks],
          }));
        },
        removeBookmark: (address) => {
          set((state) => ({
            bookmarks: state.bookmarks.filter(
              (storedBookmark) => storedBookmark.address !== address,
            ),
          }));
        },
        setSelectedBookmark: (bookmark) => {
          set((state) => ({
            selectedBookmark: bookmark,
          }));
        },
        addRecentWallet: (bookmark) => {
          set((state) => ({
            recentWallets: [
              bookmark,
              ...state.recentWallets.filter(
                (recentWallet) => recentWallet.address !== bookmark.address,
              ),
            ].slice(0, recentWalletsLimit),
          }));
        },
        removeRecentWallet: (address) => {
          set((state) => ({
            recentWallets: state.recentWallets.filter(
              (storedRecent) => storedRecent.address !== address,
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
