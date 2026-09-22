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

export interface RecentTokensProps {
  recentTokens: RecentToken[]
}

export interface RecentTokensActions {
  addRecentToken: (token: RecentToken) => void
  removeRecentToken: (chainId: number, address: string) => void
  /** Without a chainId, clears every chain. */
  clearRecentTokens: (chainId?: number) => void
  isRecentToken: (chainId: number, address: string) => boolean
}

export type RecentTokensState = RecentTokensProps & RecentTokensActions

export type RecentTokensStore = UseBoundStoreWithEqualityFn<
  StoreApi<RecentTokensState>
>
