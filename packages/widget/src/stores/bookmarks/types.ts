import type { ChainId } from '@lifi/sdk'
import type { StoreApi, UseBoundStore } from 'zustand'
import type { ToAddress } from '../../types/widget.js'

export interface Bookmark extends ToAddress {
  isConnectedAccount?: boolean
  /**
   * The chain to show for an address its ecosystem's default chain rejects,
   * such as a Zcash address. It never decides whether the address is valid.
   */
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
