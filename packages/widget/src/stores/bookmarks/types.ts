import type { StoreApi } from 'zustand';
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional';
import type { ToAddress } from '../../types/widget.js';

export interface Bookmark extends ToAddress {
  isConnectedAccount?: boolean;
}

export interface BookmarkProps {
  selectedBookmark?: Bookmark;
  bookmarks: Bookmark[];
  recentWallets: Bookmark[];
}

export interface BookmarkActions {
  getBookmark: (address: string) => Bookmark | undefined;
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (address: string) => void;
  setSelectedBookmark: (bookmark?: Bookmark) => void;
  getSelectedBookmark: () => Bookmark | undefined;
  addRecentWallet: (bookmark: Bookmark) => void;
  removeRecentWallet: (address: string) => void;
}

export type BookmarkState = BookmarkProps & BookmarkActions;

export type BookmarkStore = UseBoundStoreWithEqualityFn<
  StoreApi<BookmarkState>
>;
