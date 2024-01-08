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
        selectedBookmark: undefined,
        bookmarks: [],
        addBookmark: (name, address) => {
          set((state) => ({
            bookmarks: [
              { name, address, id: createSimpleUID() },
              ...state.bookmarks,
            ],
          }));
        },
        removeBookmark: (bookmark) => {
          set((state) => ({
            bookmarks: state.bookmarks.filter(
              (storedBookmark) => storedBookmark.id !== bookmark.id,
            ),
          }));
        },
        setSelectedBookmark: (bookmark) => {
          set((state) => ({
            selectedBookmark: bookmark,
          }));
        },
      }),
      {
        name: `${namePrefix || 'li.fi'}-bookmarked-addresses`,
        version: 0,
        partialize: (state) => ({ bookmarks: state.bookmarks }),
      },
    ) as StateCreator<BookmarksState, [], [], BookmarksState>,
    Object.is,
  );
