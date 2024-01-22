import type { ChainType } from '@lifi/sdk';
import type { StoreApi } from 'zustand';
import type { UseBoundStoreWithEqualityFn } from 'zustand/esm/traditional';

export type AddressType = 'address' | 'ENS' | undefined;

export interface Bookmark {
  address: string;
  chainType: ChainType;
  addressType?: AddressType;
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
  addBookmark: (
    name: string,
    address: string,
    addressType: AddressType,
    chainType: ChainType,
  ) => void;
  removeBookmark: (bookmark: Bookmark) => void;
  setSelectedBookmark: (bookmark?: Bookmark) => void;
  addRecentWallet: (
    address: string,
    addressType: AddressType,
    chainType: ChainType,
  ) => void;
  removeRecentWallet: (bookmark: Bookmark) => void;
}

export type BookmarkState = BookmarkProps & BookmarkActions;

export type BookmarkStore = UseBoundStoreWithEqualityFn<
  StoreApi<BookmarkState>
>;
