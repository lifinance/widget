import type { UseBoundStoreWithEqualityFn } from 'zustand/esm/traditional';
import type { StoreApi } from 'zustand';
import { ChainType } from '@lifi/sdk';

export type AddressType = 'address' | 'ENS' | undefined;

export interface BookmarkedWallet {
  address: string;
  chainType: ChainType;
  addressType?: AddressType;
  name?: string;
}
export interface BookmarksProps {
  selectedBookmarkWallet?: BookmarkedWallet;
  bookmarkedWallets: BookmarkedWallet[];
  recentWallets: BookmarkedWallet[];
}

export interface BookmarksActions {
  getBookmarkedWallet: (address: string) => BookmarkedWallet | undefined;
  addBookmarkedWallet: (
    name: string,
    address: string,
    addressType: AddressType,
    chainType: ChainType,
  ) => void;
  removeBookmarkedWallet: (bookmarkedWallet: BookmarkedWallet) => void;
  setSelectedBookmarkWallet: (bookmarkedWallet?: BookmarkedWallet) => void;
  addRecentWallet: (
    address: string,
    addressType: AddressType,
    chainType: ChainType,
  ) => void;
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
