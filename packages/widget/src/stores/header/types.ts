import type { StoreApi } from 'zustand'
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'

export type HeaderStore = UseBoundStoreWithEqualityFn<StoreApi<HeaderState>>

interface HeaderStateBase {
  element?: React.ReactNode | null
  title?: string
  headerHeight: number
  backAction?: () => void
}

export interface HeaderState extends HeaderStateBase {
  setAction(element?: React.ReactNode | null): () => void
  setTitle(title?: string): () => void
  removeAction(): void
  removeTitle(): void
  setHeaderHeight(headerHeight: number): void
  setBackAction(action: () => void): void
  executeBackAction(): void
}
