import type { StoreApi } from 'zustand'
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'

export type HeaderStore = UseBoundStoreWithEqualityFn<StoreApi<HeaderState>>

interface HeaderStateBase {
  element?: React.ReactNode | null
  headerHeight: number
}

export interface HeaderState extends HeaderStateBase {
  setAction(element?: React.ReactNode | null): () => void
  removeAction(): void
  setHeaderHeight(headerHeight: number): void
}
