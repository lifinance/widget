import { UseBoundStoreWithEqualityFn } from 'zustand/esm/traditional';
import { StoreApi } from 'zustand';

export interface Bookmark {
  id: string;
  address: string;
  name?: string;
}
export interface BookmarksProps {
  selectedBookmark?: Bookmark;
  bookmarks: Bookmark[];
}

export interface BookmarksActions {
  addBookmark: (name: string, address: string) => void;
  removeBookmark: (bookmark: Bookmark) => void;
  setSelectBookmark: (bookmark?: Bookmark) => void;
}

export type BookmarksActionNames = keyof BookmarksActions;
export type BookmarksActionFunctions = Array<
  BookmarksActions[BookmarksActionNames]
>;

export type BookmarksState = BookmarksProps & BookmarksActions;

export type BookmarksStore = UseBoundStoreWithEqualityFn<
  StoreApi<BookmarksState>
>;
