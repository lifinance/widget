import type { StoreApi } from 'zustand'
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'

export interface RecentToken {
  chainId: number
  /** The token's own casing. Compared case-insensitively with chainId. */
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
  native?: boolean
}

/** Identifies a stored entry. Compared case-insensitively. */
export interface RecentTokenId {
  chainId: number
  address: string
}

export interface RecentTokensProps {
  recentTokens: RecentToken[]
}

export interface RecentTokensActions {
  addRecentToken: (token: RecentToken) => void
  removeRecentToken: (chainId: number, address: string) => void
  /** Removes exactly these entries, never one outside the band's scope. */
  clearRecentTokens: (entries: RecentTokenId[]) => void
  isRecentToken: (chainId: number, address: string) => boolean
}

export type RecentTokensState = RecentTokensProps & RecentTokensActions

export type RecentTokensStore = UseBoundStoreWithEqualityFn<
  StoreApi<RecentTokensState>
>
