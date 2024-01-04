import { createWithEqualityFn } from 'zustand/traditional';
import { BookmarksState } from './types';
import { createSimpleUID } from '../../utils';

// TODO: add persist function
export const createBookmarksStore = () =>
  createWithEqualityFn<BookmarksState>(
    (set, get) => ({
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
      setSelectBookmark: (bookmark) => {
        set((state) => ({
          selectedBookmark: bookmark,
        }));
      },
    }),
    Object.is,
  );
