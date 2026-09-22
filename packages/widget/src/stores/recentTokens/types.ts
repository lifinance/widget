import type { StoreApi } from 'zustand'
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'

export interface RecentToken {
  chainId: number
  /** Stored lowercase. With chainId it forms the dedupe key. */
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
  clearRecentTokens: () => void
  isRecentToken: (chainId: number, address: string) => boolean
}

export type RecentTokensState = RecentTokensProps & RecentTokensActions

export type RecentTokensStore = UseBoundStoreWithEqualityFn<
  StoreApi<RecentTokensState>
>
