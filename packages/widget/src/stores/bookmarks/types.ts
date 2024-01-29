import type { ChainType } from '@lifi/sdk';
import type { StoreApi } from 'zustand';
import type { UseBoundStoreWithEqualityFn } from 'zustand/esm/traditional';

export interface Bookmark {
  address: string;
  chainType: ChainType;
  name?: string;
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
  addRecentWallet: (bookmark: Bookmark) => void;
  removeRecentWallet: (address: string) => void;
}

export type BookmarkState = BookmarkProps & BookmarkActions;

export type BookmarkStore = UseBoundStoreWithEqualityFn<
  StoreApi<BookmarkState>
>;
