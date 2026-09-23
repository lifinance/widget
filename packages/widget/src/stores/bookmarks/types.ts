import type { ChainId } from '@lifi/sdk'
import type { StoreApi, UseBoundStore } from 'zustand'
import type { ToAddress } from '../../types/widget.js'

export interface Bookmark extends ToAddress {
  isConnectedAccount?: boolean
  /** Display only: set when the ecosystem's default chain rejects the address. */
  chainId?: ChainId
}

export interface BookmarkProps {
  selectedBookmark?: Bookmark
  bookmarks: Bookmark[]
  recentWallets: Bookmark[]
}

export interface BookmarkActions {
  getBookmark: (address: string) => Bookmark | undefined
  addBookmark: (bookmark: Bookmark) => void
  removeBookmark: (address: string) => void
  setSelectedBookmark: (bookmark?: Bookmark) => void
  getSelectedBookmark: () => Bookmark | undefined
  addRecentWallet: (bookmark: Bookmark) => void
  removeRecentWallet: (address: string) => void
}

export type BookmarkState = BookmarkProps & BookmarkActions

export type BookmarkStore = UseBoundStore<StoreApi<BookmarkState>>
