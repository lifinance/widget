import type { StoreApi } from 'zustand'
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'

export interface PinnedTokensProps {
  pinnedTokens: Record<number, string[]>
}

export interface PinnedTokensActions {
  pinToken: (chainId: number, tokenAddress: string) => void
  unpinToken: (chainId: number, tokenAddress: string) => void
  isPinned: (chainId: number, tokenAddress: string) => boolean
  getPinnedTokens: (chainId: number) => string[]
  getAllPinnedTokens: () => Array<{ chainId: number; tokenAddress: string }>
}

export type PinnedTokensState = PinnedTokensProps & PinnedTokensActions

export type PinnedTokensStore = UseBoundStoreWithEqualityFn<
  StoreApi<PinnedTokensState>
>
