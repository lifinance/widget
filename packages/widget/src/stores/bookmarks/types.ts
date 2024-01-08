import { UseBoundStoreWithEqualityFn } from 'zustand/esm/traditional';
import { StoreApi } from 'zustand';

export interface BookmarkedWallet {
  id: string;
  address: string;
  name?: string;
}
export interface BookmarksProps {
  selectedBookmarkWallet?: BookmarkedWallet;
  bookmarkedWallets: BookmarkedWallet[];
  recentWallets: BookmarkedWallet[];
}

export interface BookmarksActions {
  addBookmarkedWallet: (name: string, address: string) => void;
  removeBookmarkedWallet: (bookmarkedWallet: BookmarkedWallet) => void;
  setSelectedBookmarkWallet: (bookmarkedWallet?: BookmarkedWallet) => void;
  addRecentWallet: (address: string) => void;
  removeRecentWallet: (bookmarkedWallet: BookmarkedWallet) => void;
}

export type BookmarksActionNames = keyof BookmarksActions;
export type BookmarksActionFunctions = Array<
  BookmarksActions[BookmarksActionNames]
>;

export type BookmarksState = BookmarksProps & BookmarksActions;

export type BookmarksStore = UseBoundStoreWithEqualityFn<
  StoreApi<BookmarksState>
>;
