import type { StoreApi } from 'zustand'
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'

export type HeaderStore = UseBoundStoreWithEqualityFn<StoreApi<HeaderState>>

export interface HeaderStateBase {
  element?: React.ReactNode | null
  title?: string
  headerHeight: number
}

export interface HeaderState extends HeaderStateBase {
  setAction(element?: React.ReactNode | null): () => void
  setTitle(title?: string): () => void
  removeAction(): void
  removeTitle(): void
  setHeaderHeight(headerHeight: number): void
}
