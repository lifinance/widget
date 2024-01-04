import { shallow } from 'zustand/shallow';
import { useBookmarksStore } from './BookmarksStore';
import { Bookmark } from './types';

export const useBookmarks = (): {
  bookmarks: Bookmark[];
  selectedBookmark: Bookmark;
} => {
  const [bookmarks, selectedBookmark] = useBookmarksStore(
    (store) => [store.bookmarks, store.selectedBookmark],
    shallow,
  );

  return {
    bookmarks,
    selectedBookmark,
  };
};
